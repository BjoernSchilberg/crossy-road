const isLauncher = typeof globalThis._jsg !== 'undefined';

/**
 * Returns a platform string for the PocketBase scores collection.
 * Format: "Console" | "Mobile: <browser>" | "Desktop: <browser>"
 */
export function getPlatform() {
    if (isLauncher) return 'Console';

    const browser = parseBrowser(navigator.userAgent);
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    return `${isMobile ? 'Mobile' : 'Desktop'}: ${browser}`;
}

function parseBrowser(ua) {
    if (/OPR\/|Opera\//.test(ua)) return 'Opera';
    if (/Edg\//.test(ua))         return 'Edge';
    if (/Chrome\//.test(ua))      return 'Chrome';
    if (/Firefox\//.test(ua))     return 'Firefox';
    if (/Safari\//.test(ua))      return 'Safari';
    return 'Browser';
}
