import toTitleCase from "./toTitleCase";

describe("toTitleCase", () => {
  it("title cases a string", () => {
    let str = "mary had a little lamb";
    expect(toTitleCase(str)).toEqual("Mary Had A Little Lamb");
  });
});
