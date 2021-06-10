import { shallow } from "enzyme";

import Eats from "./Eats";

describe("Eats", () => {
  let wrapper;
  let initialProps = [];
  beforeEach(() => {
    wrapper = shallow(<Eats {...initialProps} />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBeTruthy();
  });
});
