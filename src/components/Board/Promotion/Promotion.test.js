import { shallow } from "enzyme";

import Promotion from "./Promotion";

describe("Promotion", () => {
  let wrapper;
  let initialProps = {};
  beforeEach(() => {
    wrapper = shallow(<Promotion {...initialProps} />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBeTruthy();
  });
});
