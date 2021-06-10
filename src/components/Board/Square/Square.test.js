import { shallow } from "enzyme";

import Square from "./Square";

describe("Square", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Square />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("if props.piece exists, renders a Piece", () => {
    const props = {
      piece: true
    };
    wrapper = shallow(<Square piece={props.piece} />);
    expect(wrapper.find("Piece").exists()).toBeTruthy();
  });
});
