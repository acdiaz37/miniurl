import { randomBytes } from "crypto";

export const RESERVED_SUBDOMAINS = new Set([
  "admin",
  "api",
  "app",
  "dashboard",
  "help",
  "login",
  "mail",
  "status",
  "support",
  "www"
]);

const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/;
const SLUG_PATTERN = /^[a-zA-Z0-9_-]{3,80}$/;

export function normalizeSubdomain(input: FormDataEntryValue | null) {
  return String(input ?? "").trim().toLowerCase();
}

export function normalizeSlug(input: FormDataEntryValue | null) {
  return String(input ?? "").trim();
}

export function assertValidSubdomain(subdomain: string) {
  if (!SUBDOMAIN_PATTERN.test(subdomain)) {
    throw new Error("Use a subdomain with 3-63 letters, numbers, or hyphens.");
  }

  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    throw new Error("That subdomain is reserved.");
  }
}

export function assertValidSlug(slug: string) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error("Use a slug with 3-80 letters, numbers, dashes, or underscores.");
  }
}

export function generateSlug() {
  return randomBytes(5).toString("base64url");
}

function isPrivateHostname(hostname: string) {
  const normalized = hostname.toLowerCase();

  if (normalized === "localhost" || normalized.endsWith(".localhost")) {
    return true;
  }

  const ipv4 = normalized.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);

  if (!ipv4) {
    return false;
  }

  const first = Number(ipv4[1]);
  const second = Number(ipv4[2]);

  return (
    first === 10 ||
    first === 127 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

export function normalizeDestinationUrl(input: FormDataEntryValue | null) {
  const raw = String(input ?? "").trim();

  if (!raw) {
    throw new Error("Destination URL is required.");
  }

  let url: URL;

  try {
    url = new URL(raw);
  } catch {
    throw new Error("Destination URL is not valid.");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Destination URL must use http or https.");
  }

  if (
    process.env.ALLOW_PRIVATE_DESTINATIONS !== "true" &&
    isPrivateHostname(url.hostname)
  ) {
    throw new Error("Private network destinations are disabled.");
  }

  return url.toString();
}

