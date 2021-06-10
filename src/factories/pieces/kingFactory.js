import pieceFactory from "./pieceFactory";
import w_king2 from "../../images/w_king2.png";
import b_king2 from "../../images/b_king2.png";

const kingFactory = color => {
  const piece = pieceFactory("king", color);

  const img = color === "black" ? b_king2 : w_king2;

  return { ...piece, img };
};

export default kingFactory;
