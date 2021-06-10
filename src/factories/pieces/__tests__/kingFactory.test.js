import kingFactory from "../kingFactory";

describe("kingFactory", () => {
  let king;
  beforeEach(() => {
    king = kingFactory();
  });

  it("renders", () => {
    expect(king).toBeTruthy();
  });
});
