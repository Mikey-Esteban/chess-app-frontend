import canSlide from "./helpers/slideAttack";

const moveFactory = type => {
  // given a starting square, returns an array
  // of all possible squares pawn can attack
  const legalPawnMoves = (piece, square, board) => {
    let result = [];

    let opponentColor;
    piece.color === "white"
      ? (opponentColor = "black")
      : (opponentColor = "white");

    let direction;
    piece.color === "white" ? (direction = -1) : (direction = 1);

    const _legalEnPassants = (square, board) => {
      const leftSquare = [square[0], square[1] - 1];
      const rightSquare = [square[0], square[1] + 1];

      const squares = [leftSquare, rightSquare];

      squares.forEach(square => {
        if (
          board.isSquareInbounds(square) &&
          !board.isEmpty(square) &&
          board.getPiece(square).type === "pawn" &&
          board.getPiece(square).color === opponentColor &&
          board.getPiece(square).isEnPassantAble === true
        ) {
          const landingSquare = [square[0] + 1 * direction, square[1]];
          result.push(landingSquare);
        }
      });
    };

    const _legalPawnTravels = (piece, square, board) => {
      const nextSquare = [square[0] + 1 * direction, square[1]];
      if (board.isSquareInbounds(nextSquare) && board.isEmpty(nextSquare)) {
        result.push(nextSquare);
      }
      if (piece.hasMoved === false) {
        const nextSquare = [square[0] + 1 * direction, square[1]];
        const afterNextSquare = [square[0] + 2 * direction, square[1]];
        if (board.isEmpty(nextSquare) && board.isEmpty(afterNextSquare))
          result.push(afterNextSquare);
      }
    };

    const _legalPawnAttacks = (square, board) => {
      if (
        board.isSquareInbounds(square) &&
        !board.isEmpty(square) &&
        board.getPiece(square).color === opponentColor
      ) {
        return true;
      } else {
        return false;
      }
    };

    // grab pawn travels
    _legalPawnTravels(piece, square, board);

    // grab legal enPassants
    _legalEnPassants(square, board);

    // grab pawn eats
    const diagonalRight = [square[0] + direction, square[1] + 1];
    const diagonalLeft = [square[0] + direction, square[1] - 1];
    if (_legalPawnAttacks(diagonalRight, board)) {
      result.push(diagonalRight);
    }
    if (_legalPawnAttacks(diagonalLeft, board)) {
      result.push(diagonalLeft);
    }

    return result;
  };

  // given a starting square, returns a list of all possible squares knight can attack
  const legalKnightMoves = (piece, square, board) => {
    let result = [];

    const directions = [
      [-2, -1],
      [-1, -2],
      [1, -2],
      [2, -1],
      [2, 1],
      [1, 2],
      [-1, 2],
      [-2, 1]
    ];

    directions.forEach(direction => {
      let nextSquare = [square[0] + direction[0], square[1] + direction[1]];
      if (_isLandOnSquareLegal(nextSquare, board, piece.color)) {
        result.push(nextSquare);
      }
    });

    return result;
  };

  const legalBishopMoves = (piece, square, board) => {
    return canSlide(piece, square, board, _isLandOnSquareLegal, "diagonal");
  };

  const legalRookMoves = (piece, square, board) => {
    return canSlide(piece, square, board, _isLandOnSquareLegal, "orthogonal");
  };

  const legalQueenMoves = (piece, square, board) => {
    return [
      ...canSlide(piece, square, board, _isLandOnSquareLegal, "diagonal"),
      ...canSlide(piece, square, board, _isLandOnSquareLegal, "orthogonal")
    ];
  };

  const legalKingMoves = (piece, square, board) => {
    let result = [];
    const directions = [
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1]
    ];

    directions.forEach(direction => {
      let nextSquare = [square[0] + direction[0], square[1] + direction[1]];
      if (_isLandOnSquareLegal(nextSquare, board, piece.color)) {
        result.push(nextSquare);
      }
    });

    return result;
  };

  // returns true or false if a piece can land on square
  const _isLandOnSquareLegal = (square, board, color) => {
    if (!board.isSquareInbounds(square)) return false;
    // if same color piece occupies square
    if (!board.isEmpty(square) && board.getPiece(square).color === color) {
      return false;
    }

    return true;
  };

  if (type === "pawn") {
    return legalPawnMoves;
  } else if (type === "bishop") {
    return legalBishopMoves;
  } else if (type === "knight") {
    return legalKnightMoves;
  } else if (type === "rook") {
    return legalRookMoves;
  } else if (type === "queen") {
    return legalQueenMoves;
  } else if (type === "king") {
    return legalKingMoves;
  }
};

export default moveFactory;
