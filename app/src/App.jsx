import { useState } from 'react';

function Square({value, onSquareClick }) {
  var styleSquare = formatSquare(value);
  
  return (
    <button className="square" onClick={onSquareClick} style={styleSquare}>
      {value}
    </button>
  );
}

function formatSquare(value) {
  var textColor = "";
  if (value == "X") {
    textColor = "lime";
  } else if (value == "O") {
    textColor = "red";
  }
  return {color: textColor};
}

export default function Board() {
  const clearState = () => {
    setXIsNext(initialBoard.xIsNext);
    setSquares(initialBoard.squares);
  }

  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  const winner = calculateWinner(squares);
  const tie = isATie(squares);
  const player = "X";
  const ai = "O";

  const initialBoard = {
    xIsNext: true,
    squares: Array(9).fill(null)
  }

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (tie){
    status = "Tie!";
  } else {
    status = "Next player: " + (xIsNext ? "X":"O");
  }
 
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    
    const nextSquares = squares.slice(); 
    nextSquares[i] = player;

    if (isATie(squares)) {
      return;
    } else {
      const minimaxsquares = nextSquares.slice()
      nextSquares[minimax(minimaxsquares, "O")["index"]] = ai;
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="gameboard">
      <div className="status">{status}</div>
      <div className="board-row"> 
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
      <div className="restart">
        <button onClick={clearState}>Restart</button>
      </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function minimax(squares, player) {
  let availableSpots = findSpots(squares);

  if (calculateWinner(squares) == "X") {
    return {"score": -10}
  } else if (calculateWinner(squares) == "O") {
    return {"score": 10};
  } else if (availableSpots.length === 0) {
    return {"score": 0};
  }

  var moves = [];
  for (var i = 0; i < availableSpots.length; i++) {
    var move = { "index": -1, "score": -1 };
    move["index"] = availableSpots[i];
    squares[availableSpots[i]] = player;

    if (player == "O") {
      var result = minimax(squares, "X");
      move["score"] = result["score"];
    } else {
      var result = minimax(squares, "O");
      move["score"] = result["score"];
    }

    squares[availableSpots[i]] = move["index"];

    moves.push(move);
  }

  var idealMove;
  if (player === "O") {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i]["score"] > bestScore) {
        bestScore = moves[i]["score"];
        idealMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i]["score"] < bestScore) {
        bestScore = moves[i]["score"];
        idealMove = i;
      }
    }
  }
  return moves[idealMove];
}

function findSpots(squares) {
  const spots = [];
  for (var i = 0; i < squares.length; i++) {
    if (squares[i] != "X" && squares[i] != "O") {
      spots.push(i);
    }
  }
  return spots;
}

function isATie(squares) {
  return findSpots(squares).length == 0 ? true : false;
}