import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * Returns the winning line (array of indices) if a player has won.
 * @param {!Array<?string>} squares Board squares (length 9).
 * @return {?{winner: string, line: !Array<number>}} Winner info, or null if no winner.
 */
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line };
        }
    }
    return null;
}

/**
 * Returns true if all squares are filled and there is no winner.
 * @param {!Array<?string>} squares Board squares.
 * @param {?{winner: string, line: !Array<number>}} winnerInfo Winner info.
 * @return {boolean} Whether the game is a draw.
 */
function isDraw(squares, winnerInfo) {
    if (winnerInfo) {
        return false;
    }
    return squares.every((s) => Boolean(s));
}

/**
 * Square button in the board.
 * @param {{value: ?string, onClick: function():void, isWinningSquare: boolean, index: number}} props
 * @return {JSX.Element}
 */
function Square(props) {
    const { value, onClick, isWinningSquare, index } = props;

    return (
        <button
            type="button"
            className={`ttt-square${isWinningSquare ? ' ttt-square--win' : ''}`}
            onClick={onClick}
            aria-label={`Square ${index + 1}${value ? `, ${value}` : ''}`}
        >
            <span className={`ttt-mark${value ? ` ttt-mark--${value.toLowerCase()}` : ''}`}>
                {value || ''}
            </span>
        </button>
    );
}

/**
 * Retro-themed Tic Tac Toe app.
 * @return {JSX.Element}
 */
// PUBLIC_INTERFACE
function App() {
    const [theme, setTheme] = useState('light');
    const [squares, setSquares] = useState(() => Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const winnerInfo = useMemo(() => calculateWinner(squares), [squares]);
    const draw = useMemo(() => isDraw(squares, winnerInfo), [squares, winnerInfo]);

    /**
     * Resets the game state.
     * @return {void}
     */
    // PUBLIC_INTERFACE
    function handleRestart() {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
    }

    /**
     * Toggles the app theme between light and dark.
     * @return {void}
     */
    // PUBLIC_INTERFACE
    function toggleTheme() {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    }

    /**
     * Handles a click on a board square.
     * @param {number} index Square index (0-8).
     * @return {void}
     */
    function handleSquareClick(index) {
        if (winnerInfo || squares[index]) {
            return;
        }

        const nextSquares = squares.slice();
        nextSquares[index] = xIsNext ? 'X' : 'O';
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    const nextPlayer = xIsNext ? 'X' : 'O';
    let statusText = `Next player: ${nextPlayer}`;
    if (winnerInfo) {
        statusText = `Winner: ${winnerInfo.winner}`;
    } else if (draw) {
        statusText = 'Draw game!';
    }

    const winningSet = new Set(winnerInfo ? winnerInfo.line : []);

    return (
        <div className="App">
            <main className="ttt-page">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    type="button"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>

                <section className="ttt-card" aria-label="Tic Tac Toe game">
                    <header className="ttt-header">
                        <h1 className="ttt-title">Tic Tac Toe</h1>
                        <p className="ttt-subtitle">Retro classic. Modern polish.</p>
                    </header>

                    <div className="ttt-status" role="status" aria-live="polite">
                        {statusText}
                    </div>

                    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
                        {squares.map((value, idx) => (
                            <Square
                                // eslint-disable-next-line react/no-array-index-key
                                key={idx}
                                value={value}
                                index={idx}
                                isWinningSquare={winningSet.has(idx)}
                                onClick={() => handleSquareClick(idx)}
                            />
                        ))}
                    </div>

                    <div className="ttt-actions">
                        <button className="ttt-btn" type="button" onClick={handleRestart}>
                            Restart
                        </button>
                    </div>

                    <footer className="ttt-footer">
                        <span className="ttt-hint">
                            Tip: First to get 3 in a row wins. X starts.
                        </span>
                    </footer>
                </section>
            </main>
        </div>
    );
}

export default App;
