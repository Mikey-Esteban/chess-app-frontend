import bishopFactory from "../bishopFactory";

describe("bishopFactory", () => {
  let bishop;
  beforeEach(() => {
    bishop = bishopFactory();
  });

  it("default creates a white bishop", () => {
    expect(bishop.color).toEqual("white");
  });
});
