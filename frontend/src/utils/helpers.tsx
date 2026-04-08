export function toRelativePath(url: string): string {
  try {
    const u = new URL(url, window.location.origin);
    return `${u.pathname}${u.search}`;
  } catch {
    return url;
  }
}

export function stripApiPrefix(path: string): string {
  return path.replace(/^\/api(\/|$)/, '/');
}
