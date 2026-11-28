import "server-only";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, ADMIN_TEAM } from "@/lib/appwrite/config";

/** Vérifie, à partir d'un jeton de session Appwrite (JWT), que l'appelant est administrateur. */
export async function requireAdmin(jwt: string) {
  const headers = { "X-Appwrite-Project": APPWRITE_PROJECT, "X-Appwrite-JWT": jwt };
  const me = await fetch(`${APPWRITE_ENDPOINT}/account`, { headers, cache: "no-store" });
  if (!me.ok) throw new Error("Session expirée : reconnectez-vous.");
  const user = (await me.json()) as { email: string };
  const t = await fetch(`${APPWRITE_ENDPOINT}/teams`, { headers, cache: "no-store" });
  const teams = t.ok ? ((await t.json()) as { teams: { $id: string }[] }).teams : [];
  if (!teams.some((x) => x.$id === ADMIN_TEAM)) throw new Error("Accès réservé aux administrateurs.");
  return user;
}

/** Mise à jour d'une ligne avec les droits de l'administrateur connecté (pas de clé API sur le serveur). */
export async function adminUpdateRow(jwt: string, table: string, rowId: string, data: Record<string, unknown>) {
  const res = await fetch(`${APPWRITE_ENDPOINT}/tablesdb/site/tables/${table}/rows/${encodeURIComponent(rowId)}`, {
    method: "PATCH",
    headers: { "X-Appwrite-Project": APPWRITE_PROJECT, "X-Appwrite-JWT": jwt, "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Mise à jour impossible (${res.status}).`);
}
