import { useState } from "react";
import Word from "./Word";
import LetterTiles from "./LetterTiles";
import {
  allLetters,
  getFrequency,
  getLetterScore,
  Letter,
  toLetters,
} from "../data/letters";
import enable1 from "../data/enable1.json";
import wiktionary from "../data/wiktionary100000.json";

const commonWords = new Set(wiktionary);
const wordlist = enable1.filter((word) => commonWords.has(word));

function chooseWord(length: number) {
  const options = wordlist.filter((word) => word.length === length);
  return options[Math.floor(Math.random() * options.length)].toUpperCase();
}

function getWordScore(letter: Letter, word: string, numBlanks: number) {
  return getLetterScore(letter, numBlanks) * getFrequency(word, letter);
}

function getMaxScore(word: string) {
  const wordLetters = new Set(toLetters(word));
  let score = 0;
  let numBlanks = word.length;
  const guesses = [];

  while (wordLetters.size > 0) {
    // at each step, guess the letter with the highest letter score (accounting for numBlanks)
    // to break ties, guess the letter with the highest frequency in the word
    const sortedLetters = [...wordLetters].toSorted(
      (a, b) =>
        getLetterScore(b, numBlanks) - getLetterScore(a, numBlanks) ||
        getFrequency(word, b) - getFrequency(word, a)
    );

    const guess = sortedLetters[0];
    wordLetters.delete(guess);
    score += getWordScore(guess, word, numBlanks);
    guesses.push([guess, getLetterScore(guess, numBlanks)]);
    numBlanks -= getFrequency(word, guess);
  }

  return score;
}

export default function App() {
  const [word] = useState(() => chooseWord(10));
  const [score, setScore] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Map<Letter, number>>(
    new Map()
  );
  const [highlightedLetters, setHighlightedLetters] = useState<Set<Letter>>(
    new Set()
  );
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);

  getMaxScore(word);

  const numBlanks =
    word.length -
    toLetters(word).filter((letter) => guessedLetters.has(letter)).length;

  const guessLetter = (letter: Letter) => {
    const letterScore = getLetterScore(letter, numBlanks);
    const newGuessedLetters = guessedLetters.set(letter, letterScore);

    if (word.includes(letter)) {
      const frequency = getFrequency(word, letter);
      setScore((score) => score + getWordScore(letter, word, numBlanks));
      setMessage(
        `There${frequency === 1 ? "'s" : " are"} ${frequency} ${letter}${
          frequency === 1 ? "" : "'s"
        }!`
      );

      setHighlightedLetters(
        new Set(
          allLetters().filter(
            (highlightedLetter) =>
              getLetterScore(highlightedLetter, numBlanks) >
                numBlanks - getFrequency(word, letter) &&
              !newGuessedLetters.has(highlightedLetter)
          )
        )
      );
      setTimeout(() => {
        setHighlightedLetters(new Set());
      }, 750);
    } else {
      setScore((score) => score - getLetterScore(letter, numBlanks));
      setMessage(`There's no ${letter}!`);
    }

    setGuessedLetters(newGuessedLetters);

    if (toLetters(word).every((letter) => newGuessedLetters.has(letter))) {
      setSolved(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-center">Gambler's Hangman</h1>
      <p>by Adam Aaronson</p>
      <div className="max-w-[500px] my-4 text-center flex flex-col gap-2">
        <p>
          If you guess a letter correctly, you gain that letter's score for each
          of its appearances. If you guess a letter incorrectly, you lose its
          score.
        </p>
        <p>
          But as the game goes on, the score of each letter is adjusted so that
          it doesn't exceed the number of blanks remaining.
        </p>
        <p>Try to guess the word with as high a score as possible!</p>
      </div>
      <p className="text-2xl font-bold">
        <span className="font-bold">Score: {score}</span>
      </p>
      <Word guessedLetters={guessedLetters} word={word} />

      <LetterTiles
        guessedLetters={guessedLetters}
        highlightedLetters={highlightedLetters}
        numBlanks={numBlanks}
        onLetterClick={(letter: Letter) => guessLetter(letter)}
        word={word}
        solved={solved}
      />

      {solved ? (
        <div className="text-center mt-4">
          <p className="text-3xl mb-2">You did it!</p>
          <p>
            You got {score} out of the maximum possible {getMaxScore(word)}{" "}
            points.
          </p>
          <p>Refresh for a new word.</p>
        </div>
      ) : (
        <p className="mt-4 text-2xl">{message}</p>
      )}
    </div>
  );
}
