import { useState } from "react";
import Word from "./Word";
import LetterTiles from "./LetterTiles";
import { LETTER_SCORES } from "../data/scores";
import enable1 from "../data/enable1.json";

function chooseWord(length: number) {
  const options = enable1.filter((word) => word.length === length);
  return options[Math.floor(Math.random() * options.length)].toUpperCase();
}

function getMaxScore(word: string) {
  return word.split("").reduce((accum, curr) => accum + LETTER_SCORES[curr], 0);
}

export default function App() {
  const [score, setScore] = useState(0);
  const [word, setWord] = useState(() => chooseWord(10));
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);

  const guessLetter = (letter: string) => {
    const newGuessedLetters = [letter, ...guessedLetters];
    setGuessedLetters(newGuessedLetters);
    if (word.includes(letter)) {
      const frequency = word
        .split("")
        .filter((wordLetter) => wordLetter === letter).length;
      setScore((score) => score + LETTER_SCORES[letter] * frequency);
      setMessage(
        `There${frequency === 1 ? "'s" : " are"} ${frequency} ${letter}${
          frequency === 1 ? "" : "'s"
        }!`
      );
    } else {
      setScore((score) => score - LETTER_SCORES[letter]);
      setMessage(`There's no ${letter}!`);
    }

    if (word.split("").every((letter) => newGuessedLetters.includes(letter))) {
      setSolved(true);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-center">Gambler's Hangman</h1>
      <p>by Adam Aaronson</p>
      <div className="max-w-[800px] my-4 text-center flex flex-col gap-2">
        <p>
          For each letter you guess correctly, you gain that letter's score
          <br />
          multiplied by its number of appearances.
        </p>
        <p>
          For each letter you guess incorrectly, you lose that letter's score.
        </p>
        <p>Try to guess the word with as high a score as possible!</p>
      </div>
      <p className="text-2xl font-bold">
        <span className="font-bold">Score: {score}</span>
      </p>
      <Word guessedLetters={guessedLetters} word={word} />

      <LetterTiles
        guessedLetters={guessedLetters}
        onLetterClick={(letter: string) => guessLetter(letter)}
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
