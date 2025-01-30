import { useState } from 'react';

function Square({value, winner, onSquareClick }) {
  var styleSquare = formatSquare(value, winner);
  
  return (
    <button className="square" onClick={onSquareClick} style={styleSquare}>
      {value}
    </button>
  );
}

function formatSquare(value, winner) {
  var textColor = "";
  if (value == "X") {
    textColor = "lime";
  } else if (value == "O") {
    textColor = "red";
  }
  var bgColor = "";
  if (winner) {
    bgColor = "white";
  }

  return {color:textColor, "background-color":bgColor};
}

function detWinner(squares) {
  if (calculateWinner(squares) == null) {
    return null;
  } else {
    return calculateWinner(squares)[0];
  }
}

export default function Board() {
  const clearState = () => {
    setXIsNext(initialBoard.xIsNext);
    setSquares(initialBoard.squares);
  }

  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  const winner = detWinner(squares);
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
    if (squares[i] || detWinner(squares)) {
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

  function isAWinner(i) {
    console.log(calculateWinner(squares));
    if (calculateWinner(squares) == null){
      return false;
    }
    else if (calculateWinner(squares)[1].includes(i)) {
      console.log("hi?");
      return true;
      
    }
    else {
      return false;
    }
  }

  return (
    <>
      <div className="gameboard">
      <div className="status">{status}</div>
      <div className="board-row"> 
        <Square value={squares[0]} winner={isAWinner(0)} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} winner={isAWinner(1)} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} winner={isAWinner(2)} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} winner={isAWinner(3)} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} winner={isAWinner(4)} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} winner={isAWinner(5)} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} winner={isAWinner(6)} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} winner={isAWinner(7)} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} winner={isAWinner(8)} onSquareClick={() => handleClick(8)} />
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
      return [squares[a], lines[i]];
    }
  }
  return null;
}

function minimax(squares, player) {
  let availableSpots = findSpots(squares);

  if (detWinner(squares) == "X") {
    return {"score": -10}
  } else if (detWinner(squares) == "O") {
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