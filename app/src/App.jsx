import { useState } from 'react';

function Tile({value, won, onTileClick }) {
  var style = styleTile(value, won);
  
  return (
    <button className="tile" onClick={onTileClick} style={style}>
      {value}
    </button>
  );
}

function styleTile(value, won) {
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

export default function Gameboard() {
  const clearState = () => {
    setPlayerIsNext(initialBoard.playerIsNext);
    setBoard(initialBoard.board);
  }

  const initialBoard = {
    playerIsNext: true,
    board: Array(9).fill(null)
  }

  const [playerIsNext, setPlayerIsNext] = useState(true);
  const [board, setBoard] = useState(Array(9).fill(null));

  const winner = whoWon(board, gameWon(board));
  const tie = gameTie(board);
  const player = "X";
  const ai = "O";

  let status;

  if (winner) {
    status = "Winner: " + winner;
  } else if (tie){
    status = "It's a tie!";
  } else {
    status = "Next player: " + (playerIsNext ? player : ai);
  }
 
  function handleClick(i) {
    if (board[i] || gameWon(board)) {
      return;
    }
    
    const nextBoard = board.slice(); 
    nextBoard[i] = player;

    if (gameTie(board)) {
      return;
    } else {
      const miniMaxBoard = nextBoard.slice()
      nextBoard[miniMax(miniMaxBoard, ai)["index"]] = ai;
    }

    setBoard(nextBoard);
    setPlayerIsNext(!playerIsNext);
  }

  function isAWinner(i) {
    if (gameWon(board) != null && gameWon(board).includes(i)) {
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
          <Tile value={board[0]} won={isAWinner(0)} onTileClick={() => handleClick(0)} />
          <Tile value={board[1]} won={isAWinner(1)} onTileClick={() => handleClick(1)} />
          <Tile value={board[2]} won={isAWinner(2)} onTileClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Tile value={board[3]} won={isAWinner(3)} onTileClick={() => handleClick(3)} />
          <Tile value={board[4]} won={isAWinner(4)} onTileClick={() => handleClick(4)} />
          <Tile value={board[5]} won={isAWinner(5)} onTileClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Tile value={board[6]} won={isAWinner(6)} onTileClick={() => handleClick(6)} />
          <Tile value={board[7]} won={isAWinner(7)} onTileClick={() => handleClick(7)} />
          <Tile value={board[8]} won={isAWinner(8)} onTileClick={() => handleClick(8)} />
        </div>
        <div className="restart">
          <button onClick={clearState}>Restart</button>
        </div>
      </div>
    </>
  );
}

function gameTie(board) {
  return findSpots(board).length == 0 ? true : false;
}

function gameWon(board) {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return winningCombos[i];
    }
  }
  return null;
}

function whoWon(board, winningCombo) {
  if (winningCombo == null) {
    return null;
  } else {
    return board[winningCombo[0]];
  }
}

function findSpots(board) {
  const spots = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] != "X" && board[i] != "O") {
      spots.push(i);
    }
  }
  return spots;
}

function miniMax(board, turn) {
  let availableSpots = findSpots(board);
  let line = gameWon(board)
  let winner = whoWon(board, line);

  if (winner == "X") {
    return {"score": -10}
  } else if (winner == "O") {
    return {"score": 10};
  } else if (availableSpots.length === 0) {
    return {"score": 0};
  }

  let moves = [];
  for (let i = 0; i < availableSpots.length; i++) {
    var move = { "index": -1, "score": -1 };
    move["index"] = availableSpots[i];
    board[availableSpots[i]] = turn;

    if (turn == "O") {
      var result = miniMax(board, "X");
      move["score"] = result["score"];
    } else {
      var result = miniMax(board, "O");
      move["score"] = result["score"];
    }

    board[availableSpots[i]] = move["index"];

    moves.push(move);
  }

  let bestMove;
  if (turn === "O") {
    var bestScore = -999;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i]["score"] > bestScore) {
        bestScore = moves[i]["score"];
        bestMove = i;
      }
    }
  } else {
    var bestScore = 999;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i]["score"] < bestScore) {
        bestScore = moves[i]["score"];
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}