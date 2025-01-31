import { useState } from 'react';

function Square({value, won, onSquareClick }) {
  var style = styleSquare(value, won);
  
  return (
    <button className="square" onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

function styleSquare(value, won) {
  var textColor = "";
  var bgColor = "";

  if (value == "X") {
    textColor = "deepskyblue";
  } else if (value == "O") {
    textColor = "red";
  }
  
  if (won) {
    bgColor = textColor;
    textColor = "white";
  }

  return {color:textColor, backgroundColor:bgColor};
}

export default function Board() {
  const clearState = () => {
    setXIsNext(initialBoard.xIsNext);
    setSquares(initialBoard.squares);
  }

  const initialBoard = {
    xIsNext: true,
    squares: Array(9).fill(null)
  }

  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  const winner = whoWon(squares, gameWon(squares));
  const tie = gameTie(squares);
  const player = "X";
  const ai = "O";

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (tie){
    status = "It's a tie!";
  } else {
    status = "Next player: " + (xIsNext ? player : ai);
  }
 
  function handleClick(i) {
    if (squares[i] || gameWon(squares)) {
      return;
    }
    
    const nextSquares = squares.slice(); 
    nextSquares[i] = player;

    if (gameTie(squares)) {
      return;
    } else {
      const miniMaxSquares = nextSquares.slice()
      nextSquares[miniMax(miniMaxSquares, ai)["index"]] = ai;
    }

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function isAWinner(i) {
    if (gameWon(squares) != null && gameWon(squares).includes(i)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <div className="gameboard">
        <h1 className="status">{status}</h1>
        <div className="board-row"> 
          <Square value={squares[0]} won={isAWinner(0)} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} won={isAWinner(1)} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} won={isAWinner(2)} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} won={isAWinner(3)} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} won={isAWinner(4)} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} won={isAWinner(5)} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} won={isAWinner(6)} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} won={isAWinner(7)} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} won={isAWinner(8)} onSquareClick={() => handleClick(8)} />
        </div>
        <div className="restart">
          <button onClick={clearState}>Restart</button>
        </div>
      </div>
    </>
  );
}

function gameTie(squares) {
  return findSpots(squares).length == 0 ? true : false;
}

function gameWon(squares) {
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
      return lines[i];
    }
  }
  return null;
}

function whoWon(squares, line) {
  if (line == null) {
    return null;
  } else {
    return squares[line[0]];
  }
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

function miniMax(squares, turn) {
  let availableSpots = findSpots(squares);
  var line = gameWon(squares)
  var winner = whoWon(squares, line);

  if (winner == "X") {
    return {"score": -10}
  } else if (winner == "O") {
    return {"score": 10};
  } else if (availableSpots.length === 0) {
    return {"score": 0};
  }

  var moves = [];
  for (var i = 0; i < availableSpots.length; i++) {
    var move = { "index": -1, "score": -1 };
    move["index"] = availableSpots[i];
    squares[availableSpots[i]] = turn;

    if (turn == "O") {
      var result = miniMax(squares, "X");
      move["score"] = result["score"];
    } else {
      var result = miniMax(squares, "O");
      move["score"] = result["score"];
    }

    squares[availableSpots[i]] = move["index"];

    moves.push(move);
  }

  var bestMove;
  if (turn === "O") {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i]["score"] > bestScore) {
        bestScore = moves[i]["score"];
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i]["score"] < bestScore) {
        bestScore = moves[i]["score"];
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}