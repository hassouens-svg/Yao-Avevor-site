"use client";

import { Account, Client, ID, Query, Storage, TablesDB, Teams } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT, BUCKET_ID, DB_ID, fileViewUrl } from "./config";

export const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT);
export const account = new Account(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export { ID, Query, DB_ID, BUCKET_ID };

/** Envoie un fichier dans la médiathèque et renvoie son URL publique. */
export async function uploadFile(file: File, onProgress?: (pct: number) => void) {
  const f = await storage.createFile({
    bucketId: BUCKET_ID,
    fileId: ID.unique(),
    file,
    onProgress: (p) => onProgress?.(Math.round(p.progress)),
  });
  return { id: f.$id, url: fileViewUrl(f.$id), name: f.name };
}

export function errorMessage(e: unknown) {
  const m = (e as { message?: string })?.message ?? String(e);
  if (/Invalid credentials|Invalid `password`/i.test(m)) return "Email ou mot de passe incorrect.";
  if (/missing scope|unauthorized|not authorized/i.test(m)) return "Accès refusé : ce compte n’est pas administrateur.";
  if (/rate limit/i.test(m)) return "Trop de tentatives. Patientez une minute.";
  return m;
}
