interface WordProps {
  guessedLetters: string[];
  word: string;
}

export default function Word(props: WordProps) {
  const { guessedLetters, word } = props;
  console.log(guessedLetters);
  return (
    <div className="flex gap-2 text-2xl font-mono my-4">
      {word.split("").map((letter, index) => (
        <span key={index}>
          {guessedLetters.includes(letter) ? letter : "_"}
        </span>
      ))}
    </div>
  );
}
