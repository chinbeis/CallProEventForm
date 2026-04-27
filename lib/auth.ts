import "server-only";

export function getSessionToken(): string {
  return Buffer.from(
    `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`
  ).toString("base64");
}

export function verifySession(token: string | undefined): boolean {
  if (!token) return false;
  return token === getSessionToken();
}
