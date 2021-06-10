import notationFactory from "../notationFactory";

describe("notationFactory", () => {
  let notation;
  beforeEach(() => {
    notation = notationFactory();
  });

  it("default moveCount is 1", () => {
    expect(notation.getMoveCount()).toEqual(1);
  });

  it("expect createNotation(knight, [2,1], false, false) to return `Nb6`", () => {
    let piece = {
      type: "knight"
    };
    let result = notation.createNotation(piece, [2, 1], false, false);
    expect(result).toEqual("Nb6");
  });

  it("expect createNotation(knight, [2,1], true, false) to return `Nxb6`", () => {
    let piece = {
      type: "knight"
    };
    let result = notation.createNotation(piece, [2, 1], true, false);
    expect(result).toEqual("Nxb6");
  });
});
