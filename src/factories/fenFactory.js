const fenFactory = () => {
  const data = {
    black: {
      pawn: "p",
      bishop: "b",
      knight: "n",
      rook: "r",
      queen: "q",
      king: "k"
    },
    white: {
      pawn: "P",
      bishop: "B",
      knight: "N",
      rook: "R",
      queen: "Q",
      king: "K"
    }
  };

  const createFenStr = (
    board,
    player,
    enPassantNote,
    halfMoveCount,
    moveCount
  ) => {
    let result = "";
    result += _createPiecePlacement(board) + " ";
    result += _createActiveColor(player) + " ";
    result += _createCastling(board) + " ";
    result += enPassantNote + " ";
    result += halfMoveCount + " ";
    result += moveCount;

    return result;
  };

  ////////////////
  /// PRIVATE
  ////////

  const _createActiveColor = currentPlayer => {
    return currentPlayer === "white" ? "b" : "w";
  };

  const _createCastling = board => {
    let result = "";
    let bKing = board[0][4];
    let wKing = board[7][4];
    let bRookQueenSide = board[0][0];
    let bRookKingSide = board[0][7];
    let wRookQueenSide = board[7][0];
    let wRookKingSide = board[7][7];

    // check white
    if (wKing && wKing.type === "king" && wKing.hasMoved === false) {
      if (
        wRookKingSide &&
        wRookKingSide.type === "rook" &&
        wRookKingSide.hasMoved === false
      ) {
        result += "K";
      }
      if (
        wRookQueenSide &&
        wRookQueenSide.type === "rook" &&
        wRookQueenSide.hasMoved === false
      ) {
        result += "Q";
      }
    }
    // check black
    if (bKing && bKing.type === "king" && bKing.hasMoved === false) {
      if (
        bRookKingSide &&
        bRookKingSide.type === "rook" &&
        bRookKingSide.hasMoved === false
      ) {
        result += "k";
      }
      if (
        bRookQueenSide &&
        bRookQueenSide.type === "rook" &&
        bRookQueenSide.hasMoved === false
      ) {
        result += "q";
      }
    }

    // check if can't castle
    if (result === "") {
      return "-";
    }

    return result;
  };

  const _createPiecePlacement = board => {
    let result = "";
    let i = 0;
    while (i < 8) {
      let row = "";
      let j = 0;
      let counter = 0;
      while (j < 8) {
        // if piece exists
        if (board[i][j]) {
          let color = board[i][j].color;
          let piece = board[i][j].type;
          if (counter > 0) {
            let counterStr = counter.toString();
            row += counterStr;
            counter = 0;
          }
          row += data[color][piece];
        } else {
          // add counter
          counter++;
        }
        // add last counter
        if (j === 7 && counter > 0) {
          let counterStr = counter.toString();
          row += counterStr;
        }
        j++;
      }
      result += row;
      result += "/";
      i++;
    }

    return result.substring(0, result.length - 1);
  };

  return {
    createFenStr
  };
};

export default fenFactory;
