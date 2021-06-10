import pieceFactory from "./pieceFactory";
import w_queen2 from "../../images/w_queen2.png";
import b_queen2 from "../../images/b_queen2.png";

const queenFactory = color => {
  const piece = pieceFactory("queen", color);

  const img = color === "black" ? b_queen2 : w_queen2;
  return { ...piece, img };
};

export default queenFactory;
