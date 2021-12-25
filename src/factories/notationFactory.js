const notationFactory = () => {
  let moveCount = 1;
  let moves = {};

  const pieceData = {
    pawn: "",
    knight: "N",
    bishop: "B",
    rook: "R",
    queen: "Q",
    king: "K"
  };

  const rowData = {
    0: "8",
    1: "7",
    2: "6",
    3: "5",
    4: "4",
    5: "3",
    6: "2",
    7: "1"
  };

  const colData = {
    0: "a",
    1: "b",
    2: "c",
    3: "d",
    4: "e",
    5: "f",
    6: "g",
    7: "h"
  };

  const getMoveCount = () => {
    return moveCount;
  };

  const getMoves = () => {
    return moves;
  };

  const addMove = move => {
    // if its black move
    if (moves[moveCount]) {
      moves[moveCount].push(move);
      moveCount++;
    } else {
      // white to move
      moves[moveCount] = [move];
    }
  };

  const squareToNote = square => {
    let result = "";
    result += colData[square[1]];
    result += rowData[square[0]];

    return result;
  };

  const createNotation = (
    piece,
    start,
    end,
    isTake,
    isCheck,
    isCastle: false
  ) => {
    if (isCastle) return `O-O`;
    let pieceStr = pieceData[piece.type];
    let takeStr = "";
    if (isTake) {
      if (piece.type === "pawn") {
        // find file pawn started at
        pieceStr = colData[start[1]];
      }
      takeStr = "x";
    }
    let checkStr;
    isCheck ? (checkStr = "+") : (checkStr = "");

    const positionStr = `${colData[end[1]]}${rowData[end[0]]}`;

    return `${pieceStr}${takeStr}${positionStr}${checkStr}`;
  };

  return { getMoveCount, getMoves, addMove, squareToNote, createNotation };
};

export default notationFactory;
