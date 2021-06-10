import pieceFactory from "./pieceFactory";
import w_pawn2 from "../../images/w_pawn2.png";
import b_pawn2 from "../../images/b_pawn2.png";

const pawnFactory = color => {
  const piece = pieceFactory("pawn", color);
  const isEnPassantAble = false;

  const img = color === "black" ? b_pawn2 : w_pawn2;

  return { ...piece, img, isEnPassantAble };
};

export default pawnFactory;
