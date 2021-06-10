import pieceFactory from "./pieceFactory";
import w_bishop2 from "../../images/w_bishop2.png";
import b_bishop2 from "../../images/b_bishop2.png";

const bishopFactory = color => {
  const piece = pieceFactory("bishop", color);

  const img = color === "black" ? b_bishop2 : w_bishop2;

  return { ...piece, img };
};

export default bishopFactory;
