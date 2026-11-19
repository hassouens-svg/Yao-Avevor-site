/** Configuration publique Appwrite (non secrète). */
export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "6afefa5b0006e80c84a3";
export const DB_ID = "site";
export const BUCKET_ID = "media";
export const ADMIN_TEAM = "admins";

export const fileViewUrl = (fileId: string) =>
  `${APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT}`;
