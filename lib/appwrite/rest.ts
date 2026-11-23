import "server-only";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, DB_ID } from "./config";

/**
 * Accès REST anonyme à Appwrite côté serveur (lecture publique / création publique).
 * Aucune clé API : les permissions des tables autorisent read("any") ou create("any").
 */
const headers = { "X-Appwrite-Project": APPWRITE_PROJECT, "Content-Type": "application/json" };

export type Row = { $id: string; $createdAt: string; $updatedAt: string } & Record<string, unknown>;

export async function listRows(table: string, queries: object[] = []): Promise<Row[]> {
  const qs = [{ method: "limit", values: [500] }, ...queries].map((q) => `queries[]=${encodeURIComponent(JSON.stringify(q))}`).join("&");
  const res = await fetch(`${APPWRITE_ENDPOINT}/tablesdb/${DB_ID}/tables/${table}/rows?${qs}`, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`Appwrite ${table}: ${res.status}`);
  const json = (await res.json()) as { rows: Row[] };
  return json.rows;
}

export async function getRow(table: string, id: string): Promise<Row | null> {
  const res = await fetch(`${APPWRITE_ENDPOINT}/tablesdb/${DB_ID}/tables/${table}/rows/${encodeURIComponent(id)}`, { headers, cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Appwrite ${table}/${id}: ${res.status}`);
  return (await res.json()) as Row;
}

export async function createRow(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${APPWRITE_ENDPOINT}/tablesdb/${DB_ID}/tables/${table}/rows`, {
    method: "POST",
    headers,
    body: JSON.stringify({ rowId: "unique()", data }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Appwrite create ${table}: ${res.status} ${await res.text()}`);
  return (await res.json()) as Row;
}

/** Envoi anonyme d'un fichier dans un bucket qui autorise create("any") (ex. photos d'avis). */
export async function uploadPublicFile(bucketId: string, file: File) {
  const fd = new FormData();
  fd.append("fileId", "unique()");
  fd.append("file", file, file.name || "photo.jpg");
  const res = await fetch(`${APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files`, {
    method: "POST",
    headers: { "X-Appwrite-Project": APPWRITE_PROJECT },
    body: fd,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Appwrite upload: ${res.status} ${await res.text()}`);
  const f = (await res.json()) as { $id: string };
  return `${APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${f.$id}/view?project=${APPWRITE_PROJECT}`;
}
