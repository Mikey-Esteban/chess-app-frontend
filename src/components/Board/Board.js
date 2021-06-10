import React, { useState } from "react";
import styled from "styled-components";

import Square from "./Square/Square";
// helpers
import turnIdToPosition from "../helpers/turnIdToPosition";

const MARGIN_TOP = 100;
const BOX_SIZE = 60;

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
    currentPlayer,
    gameboard,
    errorSquare,
    setMessage,
    gameOver,
    game,
    pause
  } = props;

  const squares = [];
  const [activePieceTile, setActivePieceTile] = useState(null);
  const [activeStartSquare, setActiveStartSquare] = useState(null);
  const [activeLandSquare, setActiveLandSquare] = useState(null);
  const [activeCanLandOn, setActiveCanLandOn] = useState(null);

  const grabChessPiece = e => {
    if (e.target.classList.contains("chessPiece") && !pause) {
      const id = e.target.parentNode.id;
      const position = turnIdToPosition(id);
      const goodMoves = game.getGoodPieceMoves(position);
      setActiveCanLandOn(goodMoves);
      const piece = gameboard.getPiece(position);
      const pieceColor = piece.color;
      if (pieceColor === currentPlayer) {
        setActivePieceTile(e.target);
        setActiveStartSquare(e.target.parentNode.id);
      } else {
        setMessage("You can only select your own piece!");
      }
    }
  };

  const centerPiece = (pieceTile, position) => {
    if (activePieceTile) {
      const square_id = `[${position[0]}][${position[1]}]`;
      const square = document.getElementById(square_id);

      pieceTile.style.top = `${square.offsetTop}px`;
      pieceTile.style.left = `${square.offsetLeft}px`;
    }
  };

  const grabCurrentSquare = e => {
    let flag = true;
    // grab board div
    let node = e.target;
    while (flag) {
      node.classList.contains("board")
        ? (flag = false)
        : (node = node.parentNode);
    }
    // find board position on page
    const domRect = node.getBoundingClientRect();
    const rectTop = domRect.top;
    const rectLeft = domRect.left;

    const x = e.clientX;
    const y = e.clientY;

    const row = Math.trunc((y - rectTop) / BOX_SIZE);
    const col = Math.trunc((x - rectLeft) / BOX_SIZE);
    return [row, col];
  };

  const grabPreviousSquare = e => {
    const id = e.target.parentNode.id;
    const row = Number(id[1]);
    const col = Number(id[4]);
    return [row, col];
  };

  const releaseChessPiece = e => {
    if (activePieceTile) {
      const pieceTile = activePieceTile;
      setActivePieceTile(null);
      setActiveCanLandOn([]);
      const landSquare = grabCurrentSquare(e);
      setActiveLandSquare(`[${landSquare[0]}][${landSquare[1]}]`);

      const oldSquare = grabPreviousSquare(e);
      const newSquare = grabCurrentSquare(e);

      const flag = props.checkIfLegalMove(oldSquare, newSquare);
      if (flag === false) {
        centerPiece(pieceTile, oldSquare);
        setActiveLandSquare(`[${oldSquare[0]}][${oldSquare[1]}]`);
      }
    }
  };

  const moveChessPiece = e => {
    if (activePieceTile) {
      const element = activePieceTile;
      const x = e.clientX;
      const y = e.clientY;
      element.style.position = "absolute";
      element.style.left = `${x - BOX_SIZE / 2}px`;
      element.style.top = `${y - BOX_SIZE / 2}px`;
    }
  };

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
