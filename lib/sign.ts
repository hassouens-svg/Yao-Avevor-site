import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/** Jetons signés (HMAC) : données portées par le client mais infalsifiables. */
const secret = () => process.env.CERTIFICATE_SECRET ?? process.env.UNSUBSCRIBE_SECRET ?? process.env.RESEND_API_KEY ?? "dev";
const mac = (payload: string) => createHmac("sha256", secret()).update(`tok:${payload}`).digest("base64url").slice(0, 32);

export function signToken(data: unknown) {
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${mac(payload)}`;
}

export function readToken<T>(token: string | undefined | null): T | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const a = Buffer.from(mac(payload));
  const b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}
