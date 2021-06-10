import { shallow } from "enzyme";

import App from "./App";

describe("App", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("renders Board", () => {
    expect(wrapper.find("Board").exists()).toBeTruthy();
  });
});
