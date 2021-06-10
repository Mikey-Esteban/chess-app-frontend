import playerFactory from "../playerFactory";

describe("playerFactory", () => {
  let player;
  beforeEach(() => {
    player = playerFactory("white");
  });

  it("getColor returns `white`", () => {
    expect(player.getColor()).toEqual("white");
  });

  it("getPoints returns 0", () => {
    expect(player.getPoints()).toEqual(0);
  });

  it("getHasEaten returns []", () => {
    expect(player.getHasEaten()).toEqual([]);
  });

  it("addPoints(7) adds 7 to points", () => {
    player.addPoints(7);
    expect(player.getPoints()).toEqual(7);
  });
});
