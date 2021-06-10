import gameFactory from "../gameFactory";

describe("gameFactory", () => {
  let game;
  beforeEach(() => {
    game = gameFactory();
  });

  it("has correct defaults", () => {
    expect(game.currentPlayer).toEqual("white");
  });

  describe("changePlayerTurn", () => {
    it("if currentPlayer is white, changePlayerTurn returns black", () => {
      expect(game.currentPlayer).toEqual("white");
      game.changePlayerTurn();
      expect(game.currentPlayer).toBe("black");
    });

    it("if currentPlayer is black, changePlayerTurn returns white", () => {
      expect(game.currentPlayer).toEqual("white");
      game.changePlayerTurn();
      expect(game.currentPlayer).toBe("black");
      game.changePlayerTurn();
      expect(game.currentPlayer).toBe("white");
    });
  });

  it("isChecked is true when any opposing piece can attack king", () => {
    const w_pawn = game.gameboard.getPiece([6, 3]);
    game.gameboard.movePiece(w_pawn, [6, 3], [4, 3]);
    const b_bishop = game.gameboard.getPiece([0, 5]);
    game.gameboard.movePiece(b_bishop, [0, 5], [4, 1]);
    expect(game.isChecked("white")).toEqual(true);
  });

  it("isChecked is false when no opposing piece can attack king", () => {
    // default board
    expect(game.isChecked("white")).toEqual(false);
  });

  describe("checkMove", () => {
    it("returns an array of [ bool, message ]", () => {
      const w_pawn = game.gameboard.getPiece([6, 3]);
      const result = game.checkMove(w_pawn, [6, 3], [4, 3]);
      expect(typeof result).toEqual("object");
      expect(typeof result[0]).toEqual("boolean");
      expect(typeof result[1]).toEqual("string");
    });

    it("returns `[true, good move!]` if move is legal", () => {
      const w_pawn = game.gameboard.getPiece([6, 3]);
      expect(game.checkMove(w_pawn, [6, 3], [4, 3])).toEqual([
        true,
        "good move!"
      ]);
    });

    it("returns `that move leads to check!!` if move leads to check", () => {
      const b_bishop = game.gameboard.getPiece([0, 2]);
      game.gameboard.placePiece(b_bishop, [4, 1]);
      const w_pawn = game.gameboard.getPiece([6, 3]);
      expect(game.checkMove(w_pawn, [6, 3], [3, 3])).toEqual([
        false,
        "that move leads to check!!"
      ]);
    });

    it("returns `sorry can't play move` if move is invalid", () => {
      const w_pawn = game.gameboard.getPiece([6, 3]);
      game.checkMove(w_pawn, [6, 3], [3, 3]);
      expect(game.checkMove(w_pawn, [6, 3], [3, 3])).toEqual([
        false,
        "sorry can't play move"
      ]);
    });
  });
});
