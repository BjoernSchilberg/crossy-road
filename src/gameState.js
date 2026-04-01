export let gameOver = false;
export let playerName = '';

export function setGameOver() {
    gameOver = true;
}

export function resetGameOver() {
    gameOver = false;
}

export function setPlayerName(name) {
    playerName = name && name.trim() ? name.trim() : generateRandomName();
}

const ADJECTIVES = ['Fast', 'Brave', 'Sneaky', 'Mighty', 'Lucky', 'Swift', 'Bold', 'Calm', 'Daring', 'Fuzzy'];
const ANIMALS    = ['Frog', 'Fox', 'Bear', 'Wolf', 'Duck', 'Hawk', 'Lynx', 'Mole', 'Newt', 'Panda'];

export function generateRandomName() {
    const adj    = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    return `${adj}${animal}`;
}
