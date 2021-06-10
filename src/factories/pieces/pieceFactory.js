const pieceFactory = (type, color = "white") => {
  const hasMoved = false;

  return { type, color, hasMoved };
};

export default pieceFactory;
