import pawnFactory from "../pawnFactory";

describe("pawnFactory", () => {
  let pawn;
  beforeEach(() => {
    pawn = pawnFactory("white");
  });

  it("creates a pawn with a `color white`", () => {
    expect(pawn.color).toBe("white");
  });
});
