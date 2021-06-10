import knightFactory from "../knightFactory";

describe("knightFactory", () => {
  let knight;
  beforeEach(() => {
    knight = knightFactory();
  });

  it("renders", () => {
    expect(knight).toBeTruthy();
  });
});
