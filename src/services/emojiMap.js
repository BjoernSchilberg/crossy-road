/**
 * Maps common emoji code points to short ASCII text representations.
 * Used by the jsgamelauncher (RGB30) where no emoji font is available.
 * Extend as needed.
 */
const EMOJI_MAP = {
    // Faces
    '😀': ':D',  '😁': ':D',  '😂': 'xD',  '🤣': 'xD',  '😃': ':D',
    '😄': ':D',  '😅': ':S',  '😆': 'xD',  '😊': ':)',  '😋': ':p',
    '😎': 'B)',  '😍': '<3',  '😘': ':*',  '🤩': '*_*', '😜': ':p',
    '😏': ':/',  '😒': ':/',  '😢': ':(',  '😭': ":'(", '😤': '>:(',
    '😡': '>:(', '🤬': '>:(', '😱': ':O',  '🤯': ':O',  '😴': 'zzz',
    '🤔': ':?',  '🤗': ':)',  '😇': 'o:)', '😈': '>:)', '🤖': '[x]',
    '👻': 'boo', '💀': 'xxx', '☠': 'xxx',
    // Hands / gestures
    '👍': '+1',  '👎': '-1',  '👊': 'pow', '✊': 'fist','👋': 'hi',
    '🤝': 'hi',  '🙏': '/\\', '💪': 'str', '🖐': 'hi',  '✌': 'v',
    '🤞': 'fx',  '🤟': 'ilu', '🤘': 'rock','🖖': 'llap',
    // Animals
    '🐸': 'frog','🐶': 'dog', '🐱': 'cat', '🐭': 'mous','🐹': 'hams',
    '🐰': 'rabb','🦊': 'fox', '🐻': 'bear','🐼': 'pand','🐨': 'koal',
    '🐯': 'tigr','🦁': 'lion','🐮': 'cow', '🐷': 'pig', '🐸': 'frog',
    '🐔': 'chkn','🐧': 'peng','🐦': 'bird','🦆': 'duck','🦅': 'eagl',
    '🦉': 'owl', '🦇': 'bat', '🐺': 'wolf','🐗': 'boar','🦄': 'uni',
    '🐝': 'bee', '🦋': 'btfl','🐢': 'turt','🐍': 'snak','🦖': 'dino',
    '🦕': 'dino','🐙': 'oct', '🦑': 'sqid','🦐': 'shmp','🦞': 'lobstr',
    '🐡': 'fish','🐠': 'fish','🐟': 'fish','🐬': 'dolp','🐳': 'whal',
    '🦈': 'shrk','🐊': 'croc','🐆': 'leop','🐅': 'tigr','🦍': 'gori',
    '👀': 'eyes','🙈': 'c u!','🎶': 'music',
    // Nature / objects
    '🌟': '*',   '⭐': '*',   '🔥': 'fire','💥': 'boom','❄': 'ice',
    '🌊': 'wave','⚡': 'zap', '🌈': 'rbw', '☀': 'sun', '🌙': 'moon',
    '💎': 'gem', '🏆': 'win', '🥇': '#1', '🎮': 'game','🕹': 'ctrl',
    '⚔': 'swd', '🛡': 'shld','💣': 'bomb','🎯': 'aim', '🎲': 'dice',
    '🚀': 'rkt', '👾': 'inv', '🤖': 'bot',
    // Hearts / symbols
    '❤': '<3',  '🧡': '<3',  '💛': '<3',  '💚': '<3',  '💙': '<3',
    '💜': '<3',  '🖤': '<3',  '🤍': '<3',  '💔': '</3', '💯': '100',
    '🔞': '18+', '⛔': 'no',  '✅': 'ok',  '❌': 'x',   '❓': '?',
    '❗': '!',   '⚠': '!',   '🆒': 'cool','🆕': 'new', '🆓': 'free',
};

/**
 * Replaces emoji characters with short ASCII text equivalents.
 * Unknown emojis are removed. Used in the launcher where no emoji font is available.
 * @param {string} str
 * @returns {string}
 */
export function replaceEmoji(str) {
    // Replace known emojis, then strip any remaining emoji/non-BMP characters
    let result = '';
    for (const char of str) {
        if (EMOJI_MAP[char]) {
            result += EMOJI_MAP[char];
        } else if (/\p{Emoji}/u.test(char) && char.codePointAt(0) > 0x00ff) {
            // unknown emoji — skip
        } else {
            result += char;
        }
    }
    return result.replace(/\s+/g, ' ').trim() || '???';
}
