import { POCKETBASE_TOKEN as _deviceToken } from '../token.js';

const POCKETBASE_URL = 'https://9fdb90be-c897-4b83-a2ea-0148556c6cc1.pub.instances.scw.cloud';

// Vite builds: VITE_POCKETBASE_TOKEN is injected from the environment at build time.
// Launcher (Node.js): import.meta.env is undefined → falls back to token.js on the device.
const _envToken = import.meta.env?.VITE_POCKETBASE_TOKEN ?? '';
const POCKETBASE_TOKEN = _envToken || _deviceToken;

let _recordId = null;   // PocketBase record ID after first submission
let _bestScore = -1;    // highest score submitted this session

/**
 * Submits or updates the player's score in PocketBase.
 * - First call: POST (creates record), stores the record ID.
 * - Subsequent calls: PATCH only if new score beats the stored best.
 * Fire-and-forget — never throws.
 */
export async function submitScore(player, score, platform) {
    if (!POCKETBASE_TOKEN) return;
    if (score <= _bestScore) return; // only keep the best score

    try {
        if (_recordId === null) {
            // First game over this session — create a new record
            const res = await fetch(`${POCKETBASE_URL}/api/collections/scores/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': POCKETBASE_TOKEN,
                },
                body: JSON.stringify({ player, score, plattform: platform }),
            });
            if (res.ok) {
                const data = await res.json();
                _recordId = data.id;
                _bestScore = score;
            }
        } else {
            // Update existing record with the new best score
            await fetch(`${POCKETBASE_URL}/api/collections/scores/records/${_recordId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': POCKETBASE_TOKEN,
                },
                body: JSON.stringify({ score }),
            });
            _bestScore = score;
        }
    } catch (_) {
        // Offline or server unreachable — silently ignore
    }
}

/** Resets session state (call when a completely new session starts, e.g. page reload). */
export function resetScoreSession() {
    _recordId = null;
    _bestScore = -1;
}

/**
 * Fetches the top scores from PocketBase, sorted by score descending.
 * Reading is public (no token required).
 * Returns an array of { player, score } objects, or [] on error/offline.
 * @param {number} limit
 * @returns {Promise<Array<{player: string, score: number}>>}
 */
export async function getTopScores(limit = 10) {
    try {
        const url = `${POCKETBASE_URL}/api/collections/scores/records?sort=-score&perPage=${limit}`;
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.items ?? []).map(({ player, score }) => ({ player, score }));
    } catch (_) {
        return [];
    }
}

