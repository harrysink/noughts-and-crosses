import { useState } from 'react';
import useSound from 'use-sound'
import bopSound from './assets/iphone-haptic-bop.wav'
import tingSound from './assets/news-alert-ting.wav'
import './App.css'

// Square component for individual buttons to be clicked
function Square({ value, onSquareClick }) {
  const [initSound] = useSound(tingSound, {
    volume: 0.2,
    playbackRate: 1.5,
    interrupt: false
  })
  return (
    <div onClick={initSound}>
      <button className="square-button" onClick={onSquareClick}>
        {value}
      </button>
    </div>
  );
}

// Board component to house square components
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'winner: ' + winner;
  } else {
    status = 'next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className='board-wrapper'>
      <div className='board'>
        <div className="status">{status}</div>
        <div className="board-row" style={{marginTop: '20px'}}>
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
    </div>
  );
}

// Game component is parent wrapper for Board component
function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [playSound] = useSound(bopSound, {
    volume: 1,
    playbackRate: 1.5,
    interrupt: false
  })

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'show move #' + move;
    } else {
      description = 'go to game start';
    }

    return (
      <div className='ol-second-wrapper'>
        <div className='ol-first-wrapper'>
          <ol key={move} onClick={playSound}>
            <button onClick={() => jumpTo(move)}>
              {description}
            </button>
          </ol>
        </div>
      </div>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// calculateWinner function to determine winner based on clicked Squares
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <div className='App'>
      <p className='x'>X</p>
      <p className='o'>O</p>
      <Game />
    </div>
  )
}

export default App