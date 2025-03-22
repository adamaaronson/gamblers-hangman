import { useState } from "react";
import Word from "./Word";
import LetterTiles from "./LetterTiles";
import { getLetterScore, Letter, toLetters } from "../data/letters";
import enable1 from "../data/enable1.json";
import wiktionary from "../data/wiktionary100000.json";

const commonWords = new Set(wiktionary);
const wordlist = enable1.filter((word) => commonWords.has(word));
const word = chooseWord(10);

function chooseWord(length: number) {
  const options = wordlist.filter((word) => word.length === length);
  return options[Math.floor(Math.random() * options.length)].toUpperCase();
}

export default function App() {
  const [score, setScore] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<Map<Letter, number>>(
    new Map()
  );
  const [message, setMessage] = useState("");
  const [solved, setSolved] = useState(false);

  const numBlanks =
    word.length -
    toLetters(word).filter((letter) => guessedLetters.has(letter as Letter))
      .length;

  const guessLetter = (letter: Letter) => {
    const letterScore = getLetterScore(letter, numBlanks);
    const newGuessedLetters = guessedLetters.set(letter, letterScore);
    setGuessedLetters(newGuessedLetters);

    if (word.includes(letter)) {
      const frequency = toLetters(word).filter(
        (wordLetter) => wordLetter === letter
      ).length;
      setScore(
        (score) => score + getLetterScore(letter, numBlanks) * frequency
      );
      setMessage(
        `There${frequency === 1 ? "'s" : " are"} ${frequency} ${letter}${
          frequency === 1 ? "" : "'s"
        }!`
      );
    } else {
      setScore((score) => score - getLetterScore(letter, numBlanks));
      setMessage(`There's no ${letter}!`);
    }

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
          Letter scores are capped at the number of blanks remaining, so the
          risk and reward decreases as the game goes on.
        </p>
        <p>Try to guess the word with as high a score as possible!</p>
      </div>
      <p className="text-2xl font-bold">
        <span className="font-bold">Score: {score}</span>
      </p>
      <Word guessedLetters={guessedLetters} word={word} />

      <LetterTiles
        guessedLetters={guessedLetters}
        numBlanks={numBlanks}
        onLetterClick={(letter: Letter) => guessLetter(letter)}
        word={word}
        solved={solved}
      />

      {solved ? (
        <div className="text-center mt-4">
          <p className="text-3xl mb-2">You did it!</p>
          <p>Refresh for a new word.</p>
        </div>
      ) : (
        <p className="mt-4 text-2xl">{message}</p>
      )}
    </div>
  );
}
