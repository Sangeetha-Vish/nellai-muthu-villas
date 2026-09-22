const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL || '';
const IS_CDN_ENABLED = process.env.NEXT_PUBLIC_CDN_ENABLED === 'true';

export function getAssetUrl(path) {
    if (!path) return '';
    if (!IS_CDN_ENABLED || path.startsWith('http')) {
        return path;
    }

    // Ensure the path starts with a slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${CDN_URL}${cleanPath}`;
}
