import { shallow } from "enzyme";

import Board from "./Board";

describe("Board", () => {
  let wrapper;
  let initialProps = {
    board: [[], [], [], [], [], [], [], []]
  };
  beforeEach(() => {
    wrapper = shallow(<Board {...initialProps} />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("renders 64 Squares", () => {
    expect(wrapper.find("Square").length).toEqual(64);
  });
});
