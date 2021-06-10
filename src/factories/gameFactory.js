import boardFactory from "./boardFactory";
import moveFactory from "./moveFactory";
import playerFactory from "./playerFactory";
import notationFactory from "./notationFactory";
import fenFactory from "./fenFactory";

const gameFactory = () => {
  let currentPlayer = "white";
  let blackPlayer = playerFactory("black");
  let whitePlayer = playerFactory("white");
  let fen = fenFactory();
  let notation = notationFactory();
  let memory = [];
  let fens = ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"];
  let moveCount = 1;
  let halfMoveCount = 0;
  let gameboard = boardFactory();
  gameboard.resetBoard();
  let board = gameboard.board;

  ///////////////////////////
  ////// GETTERS ///
  /////////
  const getGameboard = () => {
    return gameboard;
  };

  const getBoard = () => {
    return gameboard.board;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const getBlackPlayer = () => {
    return blackPlayer;
  };

  const getWhitePlayer = () => {
    return whitePlayer;
  };

  const getMemory = () => {
    return memory;
  };

  const getNotation = () => {
    return notation;
  };

  const getMoveCount = () => {
    return moveCount;
  };

  const getHalfMoveCount = () => {
    return halfMoveCount;
  };

  // returns pawn to promote if pawn is at end of board
  const getPawnToPromote = player => {
    const allPieces = gameboard.getAllPiecesOfColor(player);
    const pawns = allPieces.filter(piece => piece.type === "pawn");

    if (player === "white") {
      return pawns.filter(piece => piece.square[0] === 0);
    } else {
      return pawns.filter(piece => piece.square[0] === 7);
    }
  };

  // returns string of score up by if player is up points
  const getIsUpBy = player => {
    let opponent = _getOpponentColor(player);
    let playerPieces = gameboard.getAllPiecesOfColor(player);
    let opponentPieces = gameboard.getAllPiecesOfColor(opponent);
    let playerScore;
    let opponentScore;

    player === "white"
      ? (playerScore = whitePlayer.getPoints(playerPieces))
      : (playerScore = blackPlayer.getPoints(playerPieces));
    opponent === "white"
      ? (opponentScore = whitePlayer.getPoints(opponentPieces))
      : (opponentScore = blackPlayer.getPoints(opponentPieces));

    if (playerScore > opponentScore) {
      return `+${playerScore - opponentScore}`;
    }
  };

  // returns array of squares a particular piece can move to
  const getGoodPieceMoves = square => {
    let goodMoves = [];
    const allMoves = _getAllMovesByPlayer(currentPlayer);
    // find array that only contains moves from square
    const squareMovesArray = allMoves.filter(
      pieceMove =>
        pieceMove.piece.square[0] === square[0] &&
        pieceMove.piece.square[1] === square[1]
    );
    const squareMoves = squareMovesArray[0];
    // check if squareMoves
    if (squareMoves) {
      squareMoves.moves.forEach(move => {
        const result = canMoveWithMessage(
          squareMoves.piece,
          squareMoves.piece.square,
          move
        );
        if (result[0]) {
          goodMoves.push(move);
        }
      });
    }

    return goodMoves;
  };

  ///////////////////////////
  ////// SETTERS ///
  /////////

  // updates object currentPlayer
  const changePlayerTurn = () => {
    if (currentPlayer === "white") {
      currentPlayer = "black";
    } else {
      currentPlayer = "white";
    }
  };

  // changes pawn piece to piece
  const promotePawnTo = (pawn, promotePiece, player) => {
    const allPieces = gameboard.getAllPiecesOfColor(player);

    allPieces.forEach(piece => {
      if (piece.square === pawn.square) {
        gameboard.removePiece(pawn.square);
        gameboard.placePiece(promotePiece, pawn.square);
      }
    });
  };

  // updates players pawn pieces to isEnPassantAble = false
  const clearEnPassantables = player => {
    const allPieces = gameboard.getAllPiecesOfColor(player);
    const pawns = allPieces.filter(piece => piece.type === "pawn");

    pawns.forEach(pawn => {
      pawn.isEnPassantAble = false;
    });
  };

  // updates board by playing move and
  // halfMoveCount and moveCount
  // returns board and
  // boolean on if move was an eat and
  // boolean on if move led to stalemate
  const playMove = (piece, start, end) => {
    // game counters
    halfMoveCount++;
    currentPlayer === "black" && moveCount++;

    let enPassantNote = "-";
    let eatenPiece = gameboard.getPiece(end);

    // returns boolean, if true plays capture
    let isEat = _handleIsCapture(eatenPiece);

    // handle odd pawn movements
    if (piece.type === "pawn") {
      // returns array of bool on enPassantCapture, enPassantNote
      const [enPassantCapture, note] = _handlePawnMovement(piece, start, end);
      isEat === false && enPassantCapture === true && (isEat = true);
      note && (enPassantNote = note);
    }

    // returns boolean, if true plays castling
    let isCastle = _handleIsCastle(piece, start, end);

    // update board
    gameboard.movePiece(piece, start, end);

    // create notation
    let noteMove = notation.createNotation(
      piece,
      start,
      end,
      isEat,
      isChecked(_getOpponentColor(currentPlayer)),
      isCastle
    );
    // add notation to moves notation list
    notation.addMove(noteMove);
    // add board to memory
    let boardState = gameboard.createSave();
    memory.push(boardState);
    // create fen
    let fenStr = fen.createFenStr(
      board,
      currentPlayer,
      enPassantNote,
      halfMoveCount,
      moveCount
    );
    fens.push(fenStr);

    // check for stalemate
    let stalemate;
    _isStalemateBy50(fenStr) || _isStalemateByRepetition()
      ? (stalemate = true)
      : (stalemate = false);

    return [gameboard.board, isEat, stalemate];
  };

  ///////////////////////////
  ////// BOOLEAN METHODS ///
  /////////

  // if player is checked
  const isChecked = player => {
    let checked = false;
    const playerKing = gameboard.grabKing(player);

    const allMoves = _getAllMovesByPlayer(_getOpponentColor(player));
    allMoves.forEach(piece => {
      piece.moves.forEach(move => {
        if (
          move[0] === playerKing.square[0] &&
          move[1] === playerKing.square[1]
        ) {
          checked = true;
        }
      });
    });

    return checked;
  };

  // if player has any moves left
  const anyMovesLeft = player => {
    let movesLeft = false;
    const allMoves = _getAllMovesByPlayer(player);
    allMoves.forEach(piece => {
      piece.moves.forEach(move => {
        const result = canMoveWithMessage(
          piece.piece,
          piece.piece.square,
          move
        );
        if (result[0]) {
          movesLeft = true;
        }
      });
    });

    return movesLeft;
  };

  // returns array `[boolean, message]` if move is legal & message
  const canMoveWithMessage = (piece, start, end) => {
    // check if trying to castle
    if (piece.type === "king" && Math.abs(start[1] - end[1]) === 2) {
      const squaresCanCastleTo = _canCastleTo(currentPlayer);
      const filtered = squaresCanCastleTo.filter(square => {
        return square[0] === end[0] && square[1] === end[1];
      });
      if (filtered.length > 0) {
        return [true, "castling!"];
        // castle
      } else {
        return [false, "you can't castle there"];
      }
    }

    const flag = _doesMoveLeadToCheck(piece, start, end);

    if (_isMoveValid(piece, start, end) && !flag) {
      return [true, "good move!"];
    } else if (flag) {
      return [false, "that move leads to check!!"];
    } else {
      return [false, "sorry can't play move"];
    }
  };

  ///////////////////////
  // PRIVATE METHODS
  /////////////////

  ////////////////////
  ///// GETTERS ///
  /////////////

  // returns castling rook
  const _getRookToCastle = (piece, start, end) => {
    // short castle
    if (end[1] === 6) {
      if (piece.color === "white") return gameboard.getPiece([7, 7]);
      if (piece.color === "black") return gameboard.getPiece([0, 7]);
    } else {
      // long castle
      if (piece.color === "white") return gameboard.getPiece([7, 0]);
      if (piece.color === "black") return gameboard.getPiece([0, 0]);
    }
  };

  // returns array of position of rook landing square in castle
  const _getCastlingRookEndSquare = piece => {
    // white rook
    if (piece.color === "white") {
      if (piece.square[1] === 7) return [7, 5];
      if (piece.square[1] === 0) return [7, 3];
    } else {
      // black rook
      if (piece.square[1] === 7) return [0, 5];
      if (piece.square[1] === 0) return [0, 3];
    }
  };

  // returns string of opponent color
  const _getOpponentColor = player => {
    return player === "white" ? "black" : "white";
  };

  // returns pawn that is being en passant
  const _getCapturedPawn = player => {
    const allPieces = gameboard.getAllPiecesOfColor(player);
    const pawnArr = allPieces.filter(
      piece => piece.type === "pawn" && piece.isEnPassantAble === true
    );
    return pawnArr[0];
  };

  // returns array of all moves possible by given player
  const _getAllMovesByPlayer = player => {
    const pieces = gameboard.getAllPiecesOfColor(player);
    let allMoves = [];
    pieces.forEach(piece => {
      let move = moveFactory(piece.type);
      const pieceMoves = move(piece, piece.square, gameboard);
      const obj = {
        piece: piece,
        moves: pieceMoves
      };
      allMoves.push(obj);
    });

    return allMoves;
  };

  ////////////////////
  ///// BOOLEAN SETTERS ///
  /////////////

  // update player eats array and returns boolean
  const _handleIsCapture = piece => {
    if (piece !== null) {
      halfMoveCount = 0;
      currentPlayer === "white" && whitePlayer.addEaten(piece);
      currentPlayer === "black" && blackPlayer.addEaten(piece);
      return true;
    }
    return false;
  };

  // plays castling move and returns boolean
  const _handleIsCastle = (piece, start, end) => {
    if (piece.type === "king" && Math.abs(start[1] - end[1]) === 2) {
      const rook = _getRookToCastle(piece, start, end);
      const rookEnd = _getCastlingRookEndSquare(rook);
      gameboard.movePiece(rook, rook.square, rookEnd);
      return true;
    }
    return false;
  };

  // handles en passant and 2 forward movement by pawn
  const _handlePawnMovement = (piece, start, end) => {
    halfMoveCount = 0;
    let enPassantCapture = false;
    let note;
    let enPassant = _isEnPassantPlayed(piece, start, end);
    if (enPassant) {
      const pawn = _getCapturedPawn(_getOpponentColor(currentPlayer));
      // update player eats array
      currentPlayer === "white" && whitePlayer.addEaten(pawn);
      currentPlayer === "black" && blackPlayer.addEaten(pawn);
      gameboard.removePiece(pawn.square);
      enPassantCapture = true;
    }
    // check if moved two spots
    let diff = Math.abs(start[0] - end[0]);
    if (diff === 2) {
      piece.isEnPassantAble = true;
      // grab enPassantSquare && note
      const enPassantSquare = gameboard.findEnPassantSquare(start, end);
      note = notation.squareToNote(enPassantSquare);
    }
    return [enPassantCapture, note];
  };

  ////////////////////
  ///// BOOLEANS ///
  /////////////

  // if move is valid
  const _isMoveValid = (piece, start, end) => {
    let valid = false;
    let move = moveFactory(piece.type);
    const pieceMoves = move(piece, start, gameboard);

    pieceMoves.forEach(move => {
      if (move[0] === end[0] && move[1] === end[1]) {
        valid = true;
      }
    });

    return valid;
  };

  // if playing move leads to check
  const _doesMoveLeadToCheck = (piece, start, end) => {
    const king = gameboard.grabKing(currentPlayer);

    // grab old values
    gameboard.board[start[0]][start[1]] = null;
    const tempPiece = gameboard.board[end[0]][end[1]];
    gameboard.board[end[0]][end[1]] = piece;

    // check if piece is king
    let isChecked;
    if (piece.type === "king") {
      isChecked = _canBeChecked(currentPlayer, end);
    } else {
      isChecked = _canBeChecked(currentPlayer, king.square);
    }

    // reset
    gameboard.board[start[0]][start[1]] = piece;
    gameboard.board[end[0]][end[1]] = tempPiece;

    return isChecked;
  };

  // returns boolean on if move is en passant
  const _isEnPassantPlayed = (piece, start, end) => {
    if (start[1] - end[1] !== 0 && gameboard.getPiece(end) === null) {
      return true;
    }
    return false;
  };

  // returns array of arrays of possible king landing positions
  const _canCastleTo = player => {
    let result = [];

    const allPieces = gameboard.getAllPiecesOfColor(player);
    const rooks = allPieces.filter(piece => piece.type === "rook");
    const king = allPieces.filter(piece => piece.type === "king")[0];

    if (isChecked(player) === true) return result;
    if (king.hasMoved === true) return result;
    if (rooks.length === 0) return result;
    // check if rooks have moved
    rooks.forEach(rook => {
      if (rook.hasMoved === false) {
        // find the direction
        let direction;
        rook.square[1] - king.square[1] < 0
          ? (direction = -1)
          : (direction = 1);
        // grab squares to check
        const squaresToCheck = [
          [king.square[0], king.square[1] + 1 * direction],
          [king.square[0], king.square[1] + 2 * direction]
        ];
        let flag = true;
        squaresToCheck.forEach(square => {
          const result = _canBeChecked(player, square);
          if (result || !gameboard.isEmpty(square)) {
            flag = false;
          }
        });
        flag && result.push(squaresToCheck[1]);
      }
    });

    return result;
  };

  // returns boolean if player can be checked
  const _canBeChecked = (player, squareToCheck) => {
    let checked = false;
    const allMoves = _getAllMovesByPlayer(_getOpponentColor(player));
    allMoves.forEach(piece => {
      piece.moves.forEach(move => {
        if (move[0] === squareToCheck[0] && move[1] === squareToCheck[1]) {
          checked = true;
        }
      });
    });

    return checked;
  };

  const _isStalemateBy50 = fen => {
    let halfMove = fen.split(" ")[4];
    if (halfMove >= 50) return true;
    return false;
  };

  const _isStalemateByRepetition = () => {
    let repetitions = 0;
    let lastFen = fens[fens.length - 1];
    let lastFenToArray = lastFen.split(" ");
    let lastFenPiecePlacement = lastFenToArray[0];
    let lastFenCastling = lastFenToArray[2];
    let lastFenHalfMove = lastFenToArray[4];
    // if move is a capture or pawn push
    if (lastFenHalfMove === "0") {
      return false;
    }
    let i = fens.length - 2;
    while (i >= 0) {
      let tempFen = fens[i];
      let tempFenToArray = tempFen.split(" ");
      let tempFenStr = tempFenToArray[0];
      let tempFenCastling = tempFenToArray[2];
      let tempFenHalfMove = tempFenToArray[4];
      // if match
      if (tempFenStr === lastFenPiecePlacement) {
        repetitions++;
        if (repetitions === 2) {
          return true;
        }
      }
      // if move is a capture or pawn push
      if (tempFenHalfMove === "0") {
        return false;
      }
      // if the castles dont equal each other, return false
      if (lastFenCastling !== tempFenCastling) {
        return false;
      }
      i--;
    }
    return false;
  };

  const obj = {
    getGameboard,
    getBoard,
    getCurrentPlayer,
    getBlackPlayer,
    getWhitePlayer,
    getMoveCount,
    getHalfMoveCount,
    getMemory,
    getNotation,
    getPawnToPromote,
    getIsUpBy,
    getGoodPieceMoves,
    promotePawnTo,
    clearEnPassantables,
    changePlayerTurn,
    canMoveWithMessage,
    anyMovesLeft,
    playMove,
    isChecked
  };

  return obj;
};

export default gameFactory;
