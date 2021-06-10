import rookFactory from "../rookFactory";

describe("rookFactory", () => {
  let rook;
  beforeEach(() => {
    rook = rookFactory();
  });

  it("renders", () => {
    expect(rook).toBeTruthy();
  });
});
