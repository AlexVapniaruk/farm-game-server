export function generateUuid() {
    return Math.random().toString(36).substring(2, 10); // Generate a random alphanumeric string
}

export function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function getRandomInt(N: number) {
    return Math.floor(Math.random() * N);
}
