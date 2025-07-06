/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const MAX_STRIKES = 3;
const MAX_PASSES = 3;

const initialWords = [
  "planet", "coffee", "banana", "rocket", "guitar",
  "sunset", "dragon", "castle", "cookie", "pirate"
];

function App() {
  const [words, setWords] = React.useState([]);
  const [originalWord, setOriginalWord] = React.useState("");
  const [scrambledWord, setScrambledWord] = React.useState("");
  const [guess, setGuess] = React.useState("");
  const [points, setPoints] = React.useState(0);
  const [strikes, setStrikes] = React.useState(0);
  const [passes, setPasses] = React.useState(MAX_PASSES);
  const [message, setMessage] = React.useState("");
  const [gameOver, setGameOver] = React.useState(false);

  // Load game state from localStorage on mount
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("scrambleGame"));
    if (saved && saved.words?.length > 0) {
      setWords(saved.words);
      setOriginalWord(saved.originalWord);
      setScrambledWord(saved.scrambledWord);
      setPoints(saved.points);
      setStrikes(saved.strikes);
      setPasses(saved.passes);
      setGameOver(saved.gameOver);
    } else {
      startNewGame();
    }
  }, []);

  // Save to localStorage on every state change
  React.useEffect(() => {
    localStorage.setItem(
      "scrambleGame",
      JSON.stringify({
        words,
        originalWord,
        scrambledWord,
        points,
        strikes,
        passes,
        gameOver,
      })
    );
  }, [words, originalWord, scrambledWord, points, strikes, passes, gameOver]);

  function startNewGame() {
    const shuffled = shuffle(initialWords);
    const word = shuffled[0];
    setWords(shuffled.slice(1));
    setOriginalWord(word);
    setScrambledWord(shuffle(word));
    setGuess("");
    setPoints(0);
    setStrikes(0);
    setPasses(MAX_PASSES);
    setMessage("");
    setGameOver(false);
  }

  function loadNextWord() {
    if (words.length === 0) {
      setGameOver(true);
      return;
    }
    const next = words[0];
    setOriginalWord(next);
    setScrambledWord(shuffle(next));
    setWords(words.slice(1));
  }

  function handleGuessSubmit(e) {
    e.preventDefault();
    if (gameOver) return;

    if (guess.trim().toLowerCase() === originalWord.toLowerCase()) {
      setPoints(p => p + 1);
      setMessage("✅ Correct!");
      loadNextWord();
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setMessage("❌ Incorrect.");
      if (newStrikes >= MAX_STRIKES) {
        setGameOver(true);
      }
    }
    setGuess("");
  }

  function handlePass() {
    if (passes > 0 && !gameOver) {
      setPasses(p => p - 1);
      setMessage("⏭️ Passed.");
      loadNextWord();
    }
  }

  function handleRestart() {
    localStorage.removeItem("scrambleGame");
    startNewGame();
  }

  return (
    <div className="game-container">
      <h1>Scramble Game</h1>

      {gameOver ? (
        <div>
          <h2>🎮 Game Over</h2>
          <p>Points: {points}</p>
          <p>Strikes: {strikes}</p>
          <button onClick={handleRestart}>🔁 Play Again</button>
        </div>
      ) : (
        <div>
          <h2>Scrambled Word: <span className="scrambled">{scrambledWord}</span></h2>

          <form onSubmit={handleGuessSubmit}>
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Type your guess"
              required
            />
          </form>

          <button onClick={handlePass} disabled={passes <= 0}>
            ⏭️ Pass ({passes} left)
          </button>

          <p>{message}</p>
          <p>✅ Points: {points}</p>
          <p>❌ Strikes: {strikes} / {MAX_STRIKES}</p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
