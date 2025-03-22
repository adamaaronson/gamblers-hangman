import { toLetters } from "../data/letters";

interface WordProps {
  guessedLetters: Map<string, number>;
  word: string;
}

export default function Word(props: WordProps) {
  const { guessedLetters, word } = props;
  return (
    <div className="flex gap-2 text-2xl font-mono my-4">
      {toLetters(word).map((letter, index) => (
        <span key={index}>{guessedLetters.has(letter) ? letter : "_"}</span>
      ))}
    </div>
  );
}
