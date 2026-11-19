/**
 * Outils d'administration Appwrite (clé API requise) :
 *   node --experimental-strip-types scripts/appwrite-admin.mts sync home timeline …   → republie des blocs de content/ dans la base
 *   node --experimental-strip-types scripts/appwrite-admin.mts create-admin <email> <nom>  → crée un compte admin et affiche son mot de passe
 */
import { Client, ID, Query, TablesDB, Teams, Users } from "node-appwrite";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";
import { randomBytes } from "node:crypto";

if (process.env.HTTPS_PROXY || process.env.https_proxy) setGlobalDispatcher(new EnvHttpProxyAgent());

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT ?? "6afefa5b0006e80c84a3")
  .setKey(process.env.APPWRITE_API_KEY ?? "proxy-injected");
const db = new TablesDB(client);
const users = new Users(client);
const teams = new Teams(client);
const [cmd, ...rest] = process.argv.slice(2);

if (cmd === "sync") {
  const sources: Record<string, () => Promise<unknown>> = {
    home: async () => (await import("../content/home.ts")).home,
    lexicon: async () => (await import("../content/lexicon.ts")).lexicon,
    categories: async () => (await import("../content/articles.ts")).categories,
    timeline: async () => (await import("../content/timeline.ts")).timeline,
    certifications: async () => (await import("../content/timeline.ts")).certifications,
  };
  for (const id of rest) {
    await db.upsertRow({ databaseId: "site", tableId: "content", rowId: id, data: { data: JSON.stringify(await sources[id]()) } });
    console.log("• bloc", id, "republié ✓");
  }
}

if (cmd === "create-admin") {
  const [email, ...nameParts] = rest;
  const name = nameParts.join(" ") || email;
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(14);
  const password = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("").replace(/(.{4})(?=.)/g, "$1-");
  const existing = await users.list({ queries: [Query.equal("email", email)] });
  let userId: string;
  if (existing.users[0]) {
    userId = existing.users[0].$id;
    await users.updatePassword({ userId, password });
    console.log("• compte existant, mot de passe réinitialisé");
  } else {
    const u = await users.create({ userId: ID.unique(), email, name, password });
    userId = u.$id;
    console.log("• compte créé");
  }
  await users.updateEmailVerification({ userId, emailVerification: true }).catch(() => {});
  const members = await teams.listMemberships({ teamId: "admins" });
  if (!members.memberships.some((m) => m.userId === userId)) {
    await teams.createMembership({ teamId: "admins", roles: ["owner"], userId });
    console.log("• ajouté à l'équipe admins");
  } else console.log("• déjà dans l'équipe admins");
  console.log(`IDENTIFIANTS ${email} ${password}`);
}

if (cmd === "add-missing-articles") {
  const { articles } = await import("../content/articles.ts");
  const existing = await db.listRows({ databaseId: "site", tableId: "articles", queries: [Query.limit(500)] });
  const slugs = new Set(existing.rows.map((r) => (r as unknown as { slug: string }).slug));
  for (const a of articles) {
    if (slugs.has(a.slug)) continue;
    await db.createRow({ databaseId: "site", tableId: "articles", rowId: ID.unique(), data: { ...a, coverImage: "", body: "", published: true } });
    console.log("• article ajouté", a.slug);
  }
}
