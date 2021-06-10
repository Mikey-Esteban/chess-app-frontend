import pieceFactory from "./pieceFactory";
import w_rook2 from "../../images/w_rook2.png";
import b_rook2 from "../../images/b_rook2.png";

const rookFactory = color => {
  const piece = pieceFactory("rook", color);

  const img = color === "black" ? b_rook2 : w_rook2;

  return { ...piece, img };
};

export default rookFactory;
