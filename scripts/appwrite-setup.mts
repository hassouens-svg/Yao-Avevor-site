/**
 * Installation Appwrite (idempotente) : base, tables, stockage, équipe admin, plateformes Web, import du contenu.
 *
 * Usage :
 *   APPWRITE_API_KEY=… node --experimental-strip-types scripts/appwrite-setup.mts [--seed] [--force-seed]
 *
 * Sans --seed : crée seulement la structure. --seed importe le contenu des fichiers `content/` si les tables sont vides.
 */
import { Client, ID, Permission, Role, Storage, TablesDB, Teams, Project, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import { readFileSync } from "node:fs";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

// Le SDK utilise undici : on lui fait respecter HTTPS_PROXY (environnements avec proxy sortant)
if (process.env.HTTPS_PROXY || process.env.https_proxy) setGlobalDispatcher(new EnvHttpProxyAgent());

const ENDPOINT = process.env.APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1";
const PROJECT = process.env.APPWRITE_PROJECT ?? "6afefa5b0006e80c84a3";
const KEY = process.env.APPWRITE_API_KEY ?? "proxy-injected";
const DB = "site";
const BUCKET = "media";
const TEAM = "admins";

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT).setKey(KEY);
const db = new TablesDB(client);
const storage = new Storage(client);
const teams = new Teams(client);
const project = new Project(client);

const args = new Set(process.argv.slice(2));
const log = (...a: unknown[]) => console.log("•", ...a);

async function safe<T>(label: string, fn: () => Promise<T>): Promise<T | undefined> {
  try {
    const r = await fn();
    log(label, "✓");
    return r;
  } catch (e: unknown) {
    const err = e as { code?: number; message?: string };
    if (err.code === 409) log(label, "(existe déjà)");
    else log(label, "✗", err.code, err.message);
    return undefined;
  }
}

const admins = Role.team(TEAM);
const publicRead = [Permission.read(Role.any()), Permission.create(admins), Permission.update(admins), Permission.delete(admins)];
const publicCreate = [Permission.create(Role.any()), Permission.read(admins), Permission.update(admins), Permission.delete(admins)];

type Col =
  | { t: "varchar"; key: string; size: number; required?: boolean }
  | { t: "text" | "longtext"; key: string; required?: boolean }
  | { t: "int"; key: string }
  | { t: "bool"; key: string; def?: boolean };

const tables: { id: string; name: string; perms: string[]; cols: Col[]; indexes?: string[] }[] = [
  { id: "content", name: "Contenus des pages", perms: publicRead, cols: [{ t: "longtext", key: "data", required: true }] },
  {
    id: "articles",
    name: "Articles",
    perms: publicRead,
    cols: [
      { t: "varchar", key: "slug", size: 160, required: true },
      { t: "varchar", key: "title", size: 300, required: true },
      { t: "text", key: "excerpt" },
      { t: "varchar", key: "category", size: 60 },
      { t: "int", key: "readingMinutes" },
      { t: "varchar", key: "publishedAt", size: 30 },
      { t: "varchar", key: "cover", size: 30 },
      { t: "varchar", key: "coverImage", size: 600 },
      { t: "longtext", key: "body" },
      { t: "bool", key: "published", def: true },
    ],
    indexes: ["slug"],
  },
  {
    id: "books",
    name: "Livres",
    perms: publicRead,
    cols: [
      { t: "varchar", key: "slug", size: 160, required: true },
      { t: "varchar", key: "title", size: 300, required: true },
      { t: "varchar", key: "subtitle", size: 300 },
      { t: "varchar", key: "status", size: 20 },
      { t: "varchar", key: "statusLabel", size: 80 },
      { t: "text", key: "pitch" },
      { t: "varchar", key: "cover", size: 600 },
      { t: "longtext", key: "excerpts" },
      { t: "text", key: "buyLinks" },
      { t: "int", key: "position" },
      { t: "bool", key: "published", def: true },
    ],
    indexes: ["slug"],
  },
  {
    id: "testimonials",
    name: "Témoignages",
    perms: publicRead,
    cols: [
      { t: "text", key: "quote" },
      { t: "varchar", key: "name", size: 200, required: true },
      { t: "varchar", key: "role", size: 300 },
      { t: "varchar", key: "linkedin", size: 400 },
      { t: "varchar", key: "photo", size: 600 },
      { t: "varchar", key: "videoUrl", size: 600 },
      { t: "varchar", key: "poster", size: 600 },
      { t: "bool", key: "featured", def: false },
      { t: "bool", key: "published", def: true },
      { t: "int", key: "position" },
    ],
  },
  {
    id: "subscribers",
    name: "Abonnés newsletter",
    perms: publicCreate,
    cols: [
      { t: "varchar", key: "email", size: 254, required: true },
      { t: "varchar", key: "firstName", size: 80 },
      { t: "varchar", key: "segments", size: 200 },
      { t: "varchar", key: "status", size: 20 },
      { t: "varchar", key: "consentAt", size: 40 },
    ],
  },
  {
    id: "messages",
    name: "Messages de contact",
    perms: publicCreate,
    cols: [
      { t: "varchar", key: "name", size: 120, required: true },
      { t: "varchar", key: "email", size: 254, required: true },
      { t: "varchar", key: "reason", size: 60 },
      { t: "text", key: "message", required: true },
      { t: "varchar", key: "status", size: 20 },
    ],
  },
];

async function createColumn(table: string, c: Col) {
  const base = { databaseId: DB, tableId: table, key: c.key };
  switch (c.t) {
    case "varchar":
      return db.createVarcharColumn({ ...base, size: c.size, required: !!c.required });
    case "text":
      return db.createTextColumn({ ...base, required: !!c.required });
    case "longtext":
      return db.createLongtextColumn({ ...base, required: !!c.required });
    case "int":
      return db.createIntegerColumn({ ...base, required: false });
    case "bool":
      return db.createBooleanColumn({ ...base, required: false, xdefault: c.def ?? null });
  }
}

async function waitColumns(table: string) {
  for (let i = 0; i < 180; i++) {
    const r = await db.listColumns({ databaseId: DB, tableId: table });
    const cols = r.columns as unknown as { key: string; status: string }[];
    if (cols.length && cols.every((c) => c.status === "available")) return;
    if (cols.some((c) => c.status === "failed")) throw new Error(`colonne en échec dans ${table}`);
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error(`colonnes de ${table} toujours en traitement`);
}

async function structure() {
  for (const host of ["yao-avevor-site.vercel.app", "localhost"]) {
    await safe(`plateforme web ${host}`, () => project.createWebPlatform({ platformId: host.replace(/[^a-z0-9]/g, "-").slice(0, 36), name: host, hostname: host }));
  }
  await safe("équipe admins", () => teams.create({ teamId: TEAM, name: "Administrateurs" }));
  await safe("base de données site", () => db.create({ databaseId: DB, name: "Site Yao AVEVOR" }));
  for (const t of tables) {
    await safe(`table ${t.id}`, () => db.createTable({ databaseId: DB, tableId: t.id, name: t.name, permissions: t.perms, rowSecurity: false }));
    await safe(`permissions ${t.id}`, () => db.updateTable({ databaseId: DB, tableId: t.id, name: t.name, permissions: t.perms, rowSecurity: false }));
    for (const c of t.cols) await safe(`  colonne ${t.id}.${c.key}`, () => createColumn(t.id, c));
    await waitColumns(t.id);
  }
  await safe("bucket media", () =>
    storage.createBucket({
      bucketId: BUCKET,
      name: "Médias (images, vidéos, PDF)",
      permissions: publicRead,
      fileSecurity: false,
      maximumFileSize: 50_000_000,
      allowedFileExtensions: ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg", "mp4", "webm", "mov", "pdf"],
    }),
  );
}

const fileUrl = (id: string) => `${ENDPOINT}/storage/buckets/${BUCKET}/files/${id}/view?project=${PROJECT}`;

async function upload(path: string, name: string) {
  const existing = await storage.listFiles({ bucketId: BUCKET, queries: [Query.equal("name", name), Query.limit(1)] });
  if (existing.files[0]) return fileUrl(existing.files[0].$id);
  const f = await storage.createFile({ bucketId: BUCKET, fileId: ID.unique(), file: InputFile.fromBuffer(readFileSync(path), name) });
  return fileUrl(f.$id);
}

async function isEmpty(table: string) {
  const r = await db.listRows({ databaseId: DB, tableId: table, queries: [Query.limit(1)] });
  return r.total === 0;
}

async function seed() {
  const force = args.has("--force-seed");
  const { home } = await import("../content/home.ts");
  const { lexicon } = await import("../content/lexicon.ts");
  const { articles, categories } = await import("../content/articles.ts");
  const { books } = await import("../content/books.ts");
  const { testimonials } = await import("../content/testimonials.ts");
  const { timeline, certifications } = await import("../content/timeline.ts");

  const blocks: Record<string, unknown> = { home, lexicon, categories, timeline, certifications };
  for (const [id, data] of Object.entries(blocks)) {
    const exists = await db.getRow({ databaseId: DB, tableId: "content", rowId: id }).catch(() => null);
    if (exists && !force) {
      log(`contenu ${id} (déjà présent)`);
      continue;
    }
    await safe(`contenu ${id}`, () => db.upsertRow({ databaseId: DB, tableId: "content", rowId: id, data: { data: JSON.stringify(data) } }));
  }

  if (force || (await isEmpty("articles"))) {
    for (const a of articles) {
      await safe(`article ${a.slug}`, () =>
        db.createRow({ databaseId: DB, tableId: "articles", rowId: ID.unique(), data: { ...a, coverImage: "", body: "", published: true } }),
      );
    }
  }

  if (force || (await isEmpty("books"))) {
    for (const [i, b] of books.entries()) {
      await safe(`livre ${b.slug}`, () =>
        db.createRow({
          databaseId: DB,
          tableId: "books",
          rowId: ID.unique(),
          data: {
            slug: b.slug,
            title: b.title,
            subtitle: b.subtitle,
            status: b.status,
            statusLabel: b.statusLabel,
            pitch: b.pitch,
            cover: b.cover ?? "",
            excerpts: JSON.stringify(b.excerpts),
            buyLinks: JSON.stringify(b.buyLinks),
            position: i,
            published: true,
          },
        }),
      );
    }
  }

  if (force || (await isEmpty("testimonials"))) {
    for (const [i, t] of testimonials.filter((x) => x.published).entries()) {
      let videoUrl = t.videoUrl ?? "";
      let poster = t.poster ?? "";
      if (videoUrl.startsWith("/videos/")) videoUrl = (await upload(`public${videoUrl}`, videoUrl.split("/").pop()!)) ?? videoUrl;
      if (poster.startsWith("/videos/")) poster = (await upload(`public${poster}`, poster.split("/").pop()!)) ?? poster;
      await safe(`témoignage ${t.name}`, () =>
        db.createRow({
          databaseId: DB,
          tableId: "testimonials",
          rowId: ID.unique(),
          data: { quote: t.quote, name: t.name, role: t.role, linkedin: t.linkedin ?? "", photo: t.photo ?? "", videoUrl, poster, featured: !!t.featured, published: true, position: i },
        }),
      );
    }
  }
}

if (!args.has("--seed-only")) await structure();
for (const t of tables) await waitColumns(t.id);
log("colonnes disponibles");
if (args.has("--seed") || args.has("--seed-only") || args.has("--force-seed")) await seed();
log("terminé");
