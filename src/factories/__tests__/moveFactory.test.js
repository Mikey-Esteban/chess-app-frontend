import moveFactory from "../moveFactory";

import boardFactory from "../boardFactory";
import pawnFactory from "../pieces/pawnFactory";
import knightFactory from "../pieces/knightFactory";
import bishopFactory from "../pieces/bishopFactory";
import rookFactory from "../pieces/rookFactory";
import queenFactory from "../pieces/queenFactory";

describe("moveFactory", () => {
  let gameboard;

  beforeEach(() => {
    gameboard = boardFactory();
    gameboard.resetBoard();
  });

  describe("legalPawnMoves", () => {
    let move;
    beforeEach(() => {
      move = moveFactory("pawn");
    });

    it("on default board, given black pawn only has two moves", () => {
      const pawn = gameboard.getPiece([1, 0]);
      const pawnMoves = move(pawn, [1, 0], gameboard);
      let result = [
        [2, 0],
        [3, 0]
      ];
      expect(pawnMoves).toEqual(result);
    });

    it("on default board, given white pawn only has two moves", () => {
      const pawn = gameboard.getPiece([6, 4]);
      const pawnMoves = move(pawn, [6, 4], gameboard);
      let result = [
        [5, 4],
        [4, 4]
      ];
      expect(pawnMoves).toEqual(result);
    });

    it("if en passant is legal, adds it to results", () => {
      const myPawn = pawnFactory();
      gameboard.placePiece(myPawn, [3, 3]);
      const opponentPawn = pawnFactory("black");
      opponentPawn.isEnPassantAble = true;
      gameboard.placePiece(opponentPawn, [3, 2]);
      const pawnMoves = move(myPawn, [3, 3], gameboard);
      let result = [
        [2, 3],
        [2, 2]
      ];
      expect(pawnMoves).toEqual(result);
    });
  });

  describe("legalKnightMoves", () => {
    let move;
    beforeEach(() => {
      move = moveFactory("knight");
    });

    it("on default board, given black knight only has two moves", () => {
      const knight = gameboard.getPiece([0, 1]);
      const knightMoves = move(knight, [0, 1], gameboard);
      let result = [
        [2, 0],
        [2, 2]
      ];
      expect(knightMoves).toEqual(result);
    });

    it("on default board, given white knight only has two moves", () => {
      const knight = gameboard.getPiece([7, 6]);
      const knightMoves = move(knight, [7, 6], gameboard);
      let result = [
        [5, 5],
        [5, 7]
      ];
      expect(knightMoves).toEqual(result);
    });

    it("on default board, extra white knight on [3,3] has all 8 moves", () => {
      const myKnight = knightFactory();
      gameboard.placePiece(myKnight, [3, 3]);
      const knightMoves = move(myKnight, [3, 3], gameboard);
      let result = [
        [1, 2],
        [2, 1],
        [4, 1],
        [5, 2],
        [5, 4],
        [4, 5],
        [2, 5],
        [1, 4]
      ];
      expect(knightMoves).toEqual(result);
    });
  });

  describe("legalBishopMoves", () => {
    let move;
    beforeEach(() => {
      move = moveFactory("bishop");
    });

    it("on default board, bishop has no moves", () => {
      const bishop = gameboard.getPiece([0, 2]);
      const bishopMoves = move(bishop, [0, 2], gameboard);
      expect(bishopMoves).toEqual([]);
    });

    it("on default board, extra white bishop on [3,3] has 8 moves", () => {
      const myBishop = bishopFactory();
      gameboard.placePiece(myBishop, [3, 3]);
      const bishopMoves = move(myBishop, [3, 3], gameboard);
      let result = [
        [2, 2],
        [1, 1],
        [4, 2],
        [5, 1],
        [4, 4],
        [5, 5],
        [2, 4],
        [1, 5]
      ];
      expect(bishopMoves).toEqual(result);
    });
  });

  describe("legalRookMoves", () => {
    let move;
    beforeEach(() => {
      move = moveFactory("rook");
    });

    it("on default board, rook has no moves", () => {
      const rook = gameboard.getPiece([0, 0]);
      const rookMoves = move(rook, [0, 0], gameboard);
      expect(rookMoves).toEqual([]);
    });

    it("on default board, extra white rook on [3,3] has 11 moves", () => {
      const myRook = rookFactory();
      gameboard.placePiece(myRook, [3, 3]);
      const rookMoves = move(myRook, [3, 3], gameboard);
      let result = [
        [2, 3],
        [1, 3],
        [3, 2],
        [3, 1],
        [3, 0],
        [4, 3],
        [5, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7]
      ];
      expect(rookMoves).toEqual(result);
    });
  });

  describe("legalQueenMoves", () => {
    let move;
    beforeEach(() => {
      move = moveFactory("queen");
    });

    it("on default board, queen has no moves", () => {
      const queen = gameboard.getPiece([0, 3]);
      const queenMoves = move(queen, [0, 0], gameboard);
      expect(queenMoves).toEqual([]);
    });

    it("on default board, extra white queen on [3,3] has 19 moves", () => {
      const myQueen = queenFactory();
      gameboard.placePiece(myQueen, [3, 3]);
      const queenMoves = move(myQueen, [3, 3], gameboard);
      let result = [
        [2, 2],
        [1, 1],
        [4, 2],
        [5, 1],
        [4, 4],
        [5, 5],
        [2, 4],
        [1, 5],
        [2, 3],
        [1, 3],
        [3, 2],
        [3, 1],
        [3, 0],
        [4, 3],
        [5, 3],
        [3, 4],
        [3, 5],
        [3, 6],
        [3, 7]
      ];
      expect(queenMoves).toEqual(result);
    });
  });
});
