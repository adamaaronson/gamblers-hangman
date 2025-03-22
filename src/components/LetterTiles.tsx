import { getLetterScore, Letter, LETTER_SCORES } from "../data/letters";

const letters = Object.keys(LETTER_SCORES) as Letter[];

interface LetterTilesProps {
  guessedLetters: Map<Letter, number>;
  numBlanks: number;
  onLetterClick: (letter: Letter) => void;
  word: string;
  solved: boolean;
}

export default function LetterTiles(props: LetterTilesProps) {
  const { guessedLetters, numBlanks, onLetterClick, word, solved } = props;
  return (
    <div className="font-mono flex flex-wrap gap-2 max-w-[400px] justify-center">
      {letters.map((letter, index) => (
        <div
          key={index}
          className={`w-12 h-12 relative flex items-center justify-center border-2 ${
            guessedLetters.has(letter)
              ? `cursor-default ${
                  word.includes(letter)
                    ? "border-green-300 text-green-300"
                    : "border-red-300 text-red-300"
                }`
              : "cursor-pointer"
          }`}
          onClick={
            guessedLetters.has(letter) || solved
              ? () => {}
              : () => onLetterClick(letter)
          }
        >
          <span className="absolute right-0 bottom-0 leading-3 pr-0.5 text-xs tracking-tighter">
            {guessedLetters.get(letter) ?? getLetterScore(letter, numBlanks)}
          </span>
          <span className="text-2xl">{letter}</span>
        </div>
      ))}
    </div>
  );
}
