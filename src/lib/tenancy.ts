export function getSubdomainFromHost(hostHeader: string | null) {
  if (!hostHeader) {
    return null;
  }

  const baseDomain = (process.env.BASE_DOMAIN ?? "localhost")
    .split(":")[0]
    .toLowerCase();
  const hostname = hostHeader.split(":")[0].toLowerCase();

  if (
    hostname === baseDomain ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0"
  ) {
    return null;
  }

  if (!hostname.endsWith(`.${baseDomain}`)) {
    return null;
  }

  const leftSide = hostname.slice(0, -(`.${baseDomain}`).length);

  if (!leftSide || leftSide.includes(".")) {
    return null;
  }

  return leftSide;
}

