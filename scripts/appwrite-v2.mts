/**
 * Ajouts v2 (idempotent) : avis à valider, tests/quiz, résultats, photos envoyées par les visiteurs, nouvelles plateformes.
 *   node --experimental-strip-types scripts/appwrite-v2.mts
 */
import { Client, Permission, Role, Storage, TablesDB, Project } from "node-appwrite";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

if (process.env.HTTPS_PROXY || process.env.https_proxy) setGlobalDispatcher(new EnvHttpProxyAgent());

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT ?? "6afefa5b0006e80c84a3")
  .setKey(process.env.APPWRITE_API_KEY ?? "proxy-injected");
const db = new TablesDB(client);
const storage = new Storage(client);
const project = new Project(client);
const DB = "site";
const admins = Role.team("admins");

async function safe<T>(label: string, fn: () => Promise<T>) {
  try {
    await fn();
    console.log("•", label, "✓");
  } catch (e) {
    const err = e as { code?: number; message?: string };
    console.log("•", label, err.code === 409 ? "(existe déjà)" : `✗ ${err.code} ${err.message}`);
  }
}

const publicCreate = [Permission.create(Role.any()), Permission.read(admins), Permission.update(admins), Permission.delete(admins)];
const publicRead = [Permission.read(Role.any()), Permission.create(admins), Permission.update(admins), Permission.delete(admins)];

type Col = [key: string, type: "varchar" | "text" | "longtext" | "int" | "bool", size?: number, required?: boolean];
async function table(id: string, name: string, perms: string[], cols: Col[]) {
  await safe(`table ${id}`, () => db.createTable({ databaseId: DB, tableId: id, name, permissions: perms, rowSecurity: false }));
  for (const [key, type, size, required] of cols) {
    const base = { databaseId: DB, tableId: id, key, required: !!required };
    await safe(`  ${id}.${key}`, () =>
      type === "varchar" ? db.createVarcharColumn({ ...base, size: size ?? 255 })
      : type === "text" ? db.createTextColumn(base)
      : type === "longtext" ? db.createLongtextColumn(base)
      : type === "int" ? db.createIntegerColumn({ ...base, required: false })
      : db.createBooleanColumn({ ...base, required: false }),
    );
  }
}

// Plateformes web (CORS) pour le domaine
for (const host of ["yaoavevor.com", "www.yaoavevor.com"]) {
  await safe(`plateforme ${host}`, () => project.createWebPlatform({ platformId: host.replace(/[^a-z0-9]/g, "-"), name: host, hostname: host }));
}

// Avis envoyés par le public (en attente de validation)
await table("reviews", "Avis reçus (à valider)", publicCreate, [
  ["firstName", "varchar", 80, true],
  ["lastName", "varchar", 80, true],
  ["email", "varchar", 254],
  ["role", "varchar", 200],
  ["rating", "int"],
  ["message", "text", undefined, true],
  ["photo", "varchar", 600],
  ["status", "varchar", 20],
  ["consent", "bool"],
]);

// Note sur les témoignages publiés
await safe("testimonials.rating", () => db.createIntegerColumn({ databaseId: DB, tableId: "testimonials", key: "rating", required: false }));

// Tests / quiz
await table("tests", "Tests", publicRead, [
  ["slug", "varchar", 160, true],
  ["title", "varchar", 300, true],
  ["subject", "varchar", 120],
  ["description", "text"],
  ["passPct", "int"],
  ["questions", "longtext"],
  ["showCorrection", "bool"],
  ["published", "bool"],
  ["certificate", "varchar", 20],
  ["trainingName", "varchar", 300],
  ["certificateText", "text"],
]);

// Résultats des tests
await table("test_results", "Résultats des tests", publicCreate, [
  ["testSlug", "varchar", 160, true],
  ["testTitle", "varchar", 300],
  ["firstName", "varchar", 80, true],
  ["lastName", "varchar", 80, true],
  ["email", "varchar", 254, true],
  ["score", "int"],
  ["total", "int"],
  ["pct", "int"],
  ["passed", "bool"],
  ["answers", "longtext"],
]);

// Photos envoyées par les visiteurs (avis)
await safe("bucket uploads", () =>
  storage.createBucket({
    bucketId: "uploads",
    name: "Photos envoyées (avis)",
    permissions: [Permission.create(Role.any()), Permission.read(Role.any()), Permission.update(admins), Permission.delete(admins)],
    fileSecurity: false,
    maximumFileSize: 5_000_000,
    allowedFileExtensions: ["jpg", "jpeg", "png", "webp", "heic"],
  }),
);
console.log("• terminé");
