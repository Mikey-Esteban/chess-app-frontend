const playerFactory = type => {
  const color = type;
  let points = 0;
  let hasEaten = [];

  const scoreChart = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };

  const getColor = () => {
    return color;
  };

  const getPoints = pieces => {
    const reducer = (accumulator, currentValue) =>
      accumulator + scoreChart[currentValue.type];

    points = pieces.reduce(reducer, 0);

    return points;
  };

  const getHasEaten = () => {
    return hasEaten;
  };

  const addPoints = piece => {
    points += scoreChart[piece];
  };

  const addEaten = piece => {
    hasEaten.push(piece);
  };

  return { getColor, getPoints, getHasEaten, addPoints, addEaten };
};

export default playerFactory;
