const canSlide = (piece, square, board, _isLandOnSquareLegal, slider) => {
  let result = [];
  let directions = [];

  slider === "diagonal"
    ? (directions = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1]
      ])
    : (directions = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1]
      ]);

  directions.forEach(direction => {
    let nextSquare = [square[0] + direction[0], square[1] + direction[1]];
    // check to see if square is empty
    while (board.isSquareInbounds(nextSquare) && board.isEmpty(nextSquare)) {
      if (_isLandOnSquareLegal(nextSquare, board, piece.color)) {
        result.push(nextSquare);
      }
      nextSquare = [nextSquare[0] + direction[0], nextSquare[1] + direction[1]];
    }

    if (
      board.isSquareInbounds(nextSquare) &&
      !board.isEmpty(nextSquare) &&
      board.getPiece(nextSquare).color !== piece.color
    ) {
      result.push(nextSquare);
    }
  });

  return result;
};

export default canSlide;
