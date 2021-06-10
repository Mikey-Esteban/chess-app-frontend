import pawnFactory from "./pieces/pawnFactory";
import bishopFactory from "./pieces/bishopFactory";
import knightFactory from "./pieces/knightFactory";
import rookFactory from "./pieces/rookFactory";
import queenFactory from "./pieces/queenFactory";
import kingFactory from "./pieces/kingFactory";

const boardFactory = () => {
  const board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
  ];

  const createSave = () => {
    let result = [];
    board.forEach(row => {
      let rowArray = [];
      row.forEach(col => {
        rowArray.push(col);
      });
      result.push(rowArray);
    });

    return result;
  };

  const placePiece = (piece, position) => {
    board[position[0]][position[1]] = piece;
  };

  const movePiece = (piece, start, end) => {
    board[start[0]][start[1]] = null;
    board[end[0]][end[1]] = piece;
    piece.hasMoved = true;
  };

  const removePiece = position => {
    board[position[0]][position[1]] = null;
  };

  const resetPiece = (piece, start, end) => {
    board[start[0]][start[1]] = null;
    board[end[0]][end[1]] = piece;
  };

  const getPiece = position => {
    return board[position[0]][position[1]];
  };

  const isSquareInbounds = square => {
    if (square[0] < 0 || square[0] > 7 || square[1] < 0 || square[1] > 7) {
      return false;
    }
    return true;
  };

  const findKingSquare = color => {
    let i = 0;
    while (i < 8) {
      let j = 0;
      while (j < 8) {
        const piece = getPiece([i, j]);
        if (piece && piece.type === "king" && piece.color === color) {
          let square = [i, j];
          return square;
        }
        j += 1;
      }
      i += 1;
    }
  };

  const grabKing = color => {
    let i = 0;
    while (i < 8) {
      let j = 0;
      while (j < 8) {
        const piece = getPiece([i, j]);
        if (piece && piece.type === "king" && piece.color === color) {
          piece.square = [i, j];
          return piece;
        }
        j += 1;
      }
      i += 1;
    }
  };

  const findEnPassantSquare = (start, end) => {
    let max = Math.max(start[0], end[0]);
    const square = [max - 1, start[1]];
    return square;
  };

  const getAllPiecesOfColor = color => {
    // returns array of object with piece and square
    const pieces = [];
    let i = 0;
    while (i < 8) {
      let j = 0;
      while (j < 8) {
        const piece = getPiece([i, j]);
        if (piece && piece.color === color) {
          piece.square = [i, j];
          pieces.push(piece);
        }
        j += 1;
      }
      i += 1;
    }

    return pieces;
  };

  const isEmpty = position => {
    return board[position[0]][position[1]] === null;
  };

  const resetBoard = () => {
    // initialize black
    placePiece(rookFactory("black"), [0, 0]);
    placePiece(knightFactory("black"), [0, 1]);
    placePiece(bishopFactory("black"), [0, 2]);
    placePiece(queenFactory("black"), [0, 3]);
    placePiece(kingFactory("black"), [0, 4]);
    placePiece(bishopFactory("black"), [0, 5]);
    placePiece(knightFactory("black"), [0, 6]);
    placePiece(rookFactory("black"), [0, 7]);

    placePiece(pawnFactory("black"), [1, 0]);
    placePiece(pawnFactory("black"), [1, 1]);
    placePiece(pawnFactory("black"), [1, 2]);
    placePiece(pawnFactory("black"), [1, 3]);
    placePiece(pawnFactory("black"), [1, 4]);
    placePiece(pawnFactory("black"), [1, 5]);
    placePiece(pawnFactory("black"), [1, 6]);
    placePiece(pawnFactory("black"), [1, 7]);

    // initialize white
    placePiece(rookFactory("white"), [7, 0]);
    placePiece(knightFactory("white"), [7, 1]);
    placePiece(bishopFactory("white"), [7, 2]);
    placePiece(queenFactory("white"), [7, 3]);
    placePiece(kingFactory("white"), [7, 4]);
    placePiece(bishopFactory("white"), [7, 5]);
    placePiece(knightFactory("white"), [7, 6]);
    placePiece(rookFactory("white"), [7, 7]);

    placePiece(pawnFactory("white"), [6, 0]);
    placePiece(pawnFactory("white"), [6, 1]);
    placePiece(pawnFactory("white"), [6, 2]);
    placePiece(pawnFactory("white"), [6, 3]);
    placePiece(pawnFactory("white"), [6, 4]);
    placePiece(pawnFactory("white"), [6, 5]);
    placePiece(pawnFactory("white"), [6, 6]);
    placePiece(pawnFactory("white"), [6, 7]);
  };

  return {
    board,
    placePiece,
    resetPiece,
    movePiece,
    removePiece,
    getPiece,
    grabKing,
    findKingSquare,
    getAllPiecesOfColor,
    isEmpty,
    isSquareInbounds,
    resetBoard,
    createSave,
    findEnPassantSquare
  };
};

export default boardFactory;
