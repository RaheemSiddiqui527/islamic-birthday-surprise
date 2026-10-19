/**
 * Resolves media paths (photos, audio, videos) to either:
 * - Direct URL if path is external or data URL
 * - Prepending VITE_API_URL in production (e.g. Render backend URL when hosted on Vercel)
 * - Keeping relative path in local development (proxied by Vite)
 */
export function getMediaUrl(path) {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const backendBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '';
  if (backendBase) {
    const cleanBase = backendBase.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }

  return path;
}
