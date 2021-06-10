import queenFactory from "../queenFactory";

describe("queenFactory", () => {
  let queen;
  beforeEach(() => {
    queen = queenFactory();
  });

  it("renders", () => {
    expect(queen).toBeTruthy();
  });
});
