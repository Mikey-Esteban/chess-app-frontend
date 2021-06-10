import boardFactory from "../boardFactory";

import pieceFactory from "../pieces/pieceFactory";

describe("boardFactory", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = boardFactory();
  });

  it("has a board with an empty 8 x 8 squares", () => {
    expect(gameboard.board).toEqual([
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ]);
  });

  it("placePiece places piece on board", () => {
    const position = [0, 0];
    const p = pieceFactory("pawn", "white");
    gameboard.placePiece(p, position);
    expect(gameboard.board[position[0]][position[1]]).toEqual(p);
  });

  it("resetPiece moves piece on board to old spot", () => {
    const end = [2, 0];
    const p = pieceFactory("pawn", "black");
    gameboard.placePiece(p, [1, 0]);
    expect(p.hasMoved).toEqual(false);
    gameboard.resetPiece(p, [1, 0], [2, 0]);
    expect(gameboard.getPiece([1, 0])).toEqual(null);
    expect(gameboard.getPiece(end)).toEqual(p);
    expect(p.hasMoved).toEqual(false);
  });

  it("movePiece moves piece on board to new spot", () => {
    const end = [2, 0];
    const p = pieceFactory("pawn", "black");
    gameboard.placePiece(p, [1, 0]);
    expect(p.hasMoved).toEqual(false);
    gameboard.movePiece(p, [1, 0], [2, 0]);
    expect(gameboard.getPiece([1, 0])).toEqual(null);
    expect(gameboard.getPiece(end)).toEqual(p);
    expect(p.hasMoved).toEqual(true);
  });

  it("getPiece returns piece at given position", () => {
    gameboard.resetBoard();
    const position = [0, 5];
    expect(gameboard.getPiece(position)).toEqual({
      type: "bishop",
      color: "black",
      img: "b_bishop.svg",
      hasMoved: false,
      isKilled: false
    });
  });

  it("grabKing returns the king of a given color", () => {
    gameboard.resetBoard();
    const king = gameboard.grabKing("white");
    expect(king).toEqual({
      type: "king",
      color: "white",
      img: "w_king.svg",
      isKilled: false,
      hasMoved: false,
      square: [7, 4]
    });
  });

  it("getAllPiecesOfColor returns all pieces of a given color", () => {
    gameboard.resetBoard();
    const pieces = gameboard.getAllPiecesOfColor("black");
    expect(pieces.length).toEqual(16);
    expect(pieces[0]).toEqual({
      type: "rook",
      color: "black",
      img: "b_rook.svg",
      hasMoved: false,
      isKilled: false,
      square: [0, 0]
    });
  });

  it("isEmpty returns true if board at given position is null", () => {
    gameboard.resetBoard();
    let position = [2, 0];
    expect(gameboard.isEmpty(position)).toBe(true);
    position = [0, 0];
    expect(gameboard.isEmpty(position)).toBe(false);
  });

  it("resetBoard set the chess board to its default pieces", () => {
    gameboard.resetBoard();
    expect(gameboard.board[0][0]).toEqual({
      type: "rook",
      color: "black",
      img: "b_rook.svg",
      hasMoved: false,
      isKilled: false
    });
    expect(gameboard.board[6][6]).toEqual({
      type: "pawn",
      color: "white",
      img: "w_pawn.svg",
      hasMoved: false,
      isKilled: false,
      isEnPassantAble: false
    });
  });
});
