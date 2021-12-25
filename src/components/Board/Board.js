import React from "react";
import styled from "styled-components";

import Square from "./Square/Square";

const Wrapper = styled.div`
  height: 480px;
  width: 480px;

  background: #efefef;

  display: flex;
  flex-wrap: wrap;
`;

const Board = props => {
  let {
    board,
    gameOver,
    errorSquare,
    activeStartSquare,
    activeLandSquare,
    activeCanLandOn,
    grabChessPiece,
    releaseChessPiece,
    moveChessPiece
  } = props;

  const squares = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
        squares.push(
          <Square
            primary
            piece={board[i][j]}
            key={`board[${i}][${j}]`}
            id={`[${i}][${j}]`}
            activeStartSquare={activeStartSquare}
            activeLandSquare={activeLandSquare}
            errorSquare={`[${errorSquare[0]}][${errorSquare[1]}]`}
            activeCanLandOn={activeCanLandOn}
          />
        );
      } else {
        squares.push(
          <Square
            piece={board[i][j]}
            key={`board[${i}][${j}]`}
            id={`[${i}][${j}]`}
            activeStartSquare={activeStartSquare}
            activeLandSquare={activeLandSquare}
            errorSquare={`[${errorSquare[0]}][${errorSquare[1]}]`}
            activeCanLandOn={activeCanLandOn}
          />
        );
      }
    }
  }

  return !gameOver ? (
    <Wrapper
      onMouseMove={moveChessPiece}
      onMouseDown={grabChessPiece}
      onMouseUp={releaseChessPiece}
      className="board"
    >
      {squares}
    </Wrapper>
  ) : (
    <Wrapper className="board">{squares}</Wrapper>
  );
};

export default Board;
