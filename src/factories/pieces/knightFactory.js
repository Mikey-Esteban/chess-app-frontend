import pieceFactory from "./pieceFactory";
import w_knight2 from "../../images/w_knight2.png";
import b_knight2 from "../../images/b_knight2.png";

const knightFactory = color => {
  const piece = pieceFactory("knight", color);

  const img = color === "black" ? b_knight2 : w_knight2;
  return { ...piece, img };
};

export default knightFactory;
