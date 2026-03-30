/**
 * Returns the pixel height reserved at the bottom of the viewport for
 * on-screen controls on touch devices (mobile/tablet).
 * Zero on desktop and in the jsgamelauncher.
 */
export function mobileControlsReserve() {
    if (typeof globalThis._jsg !== 'undefined') return 0;
    if (!window.matchMedia('(pointer: coarse)').matches) return 0;
    // Controls: two button rows (40px each) + 10px gap + 20px bottom margin + safety
    return 150;
}
