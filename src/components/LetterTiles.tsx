import { LETTER_SCORES } from "../data/scores";

interface LetterTilesProps {
  guessedLetters: string[];
  onLetterClick: (letter: string) => void;
  word: string;
  solved: boolean;
}

export default function LetterTiles(props: LetterTilesProps) {
  const { guessedLetters, onLetterClick, word, solved } = props;
  return (
    <div className="font-mono flex flex-wrap gap-2 max-w-[400px] justify-center">
      {Object.entries(LETTER_SCORES).map(([letter, value], index) => (
        <div
          key={index}
          className={`w-12 h-12 relative flex items-center justify-center border-2 ${
            guessedLetters.includes(letter)
              ? `cursor-default ${
                  word.includes(letter)
                    ? "border-green-300 text-green-300"
                    : "border-red-300 text-red-300"
                }`
              : "cursor-pointer"
          }`}
          onClick={
            guessedLetters.includes(letter) || solved
              ? () => {}
              : () => onLetterClick(letter)
          }
        >
          <span className="absolute right-0 bottom-0 leading-3 pr-0.5 text-xs tracking-tighter">
            {value}
          </span>
          <span className="text-2xl">{letter}</span>
        </div>
      ))}
    </div>
  );
}
