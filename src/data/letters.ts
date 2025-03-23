export const LETTER_SCORES = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
} as const;

export type Letter = keyof typeof LETTER_SCORES;

export function getLetterScore(letter: Letter, numBlanks: number) {
  return Math.min(LETTER_SCORES[letter], numBlanks);
}

export function toLetters(word: string) {
  return word.split("") as Letter[];
}

export function getFrequency(word: string, letter: Letter) {
  return toLetters(word).filter((wordLetter) => wordLetter === letter).length;
}
