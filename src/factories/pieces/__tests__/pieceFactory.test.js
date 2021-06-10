import pieceFactory from "../pieceFactory";

describe("pieceFactory", () => {
  it("can render a piece with type `pawn` and color `white`", () => {
    const w_pawn = pieceFactory("pawn", "white");
    expect(w_pawn.color).toEqual("white");
    expect(w_pawn.type).toEqual("pawn");
    expect(w_pawn.isKilled).toEqual(false);
    expect(w_pawn.hasMoved).toEqual(false);
  });
});
