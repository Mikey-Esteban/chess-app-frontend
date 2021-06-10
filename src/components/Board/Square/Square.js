import React from "react";
import styled from "styled-components";

import Piece from "./Piece/Piece";
// helpers
import turnIdToPosition from "../../helpers/turnIdToPosition";

const Wrapper = styled.div`
  width: 60px;
  height: 60px;

  background: ${props =>
    props.selected
      ? props.primary
        ? "rgb(255,223,93)"
        : "rgb(227,195,65)"
      : props.primary
      ? "rgb(255,255,255)"
      : "rgb(178,178,178)"};

  background: ${props =>
    props.canLandOn
      ? props.primary
        ? "rgb(234,237,240)"
        : "rgb(134,136,139)"
      : "hi"};

  background: ${props => props.error && "#ef8354"};

  display: inline-block;
  vertical-align: top;
  justify-content: center;
  align-items: center;
`;

const RowLabelWrapper = styled.div`
  position: absolute;
  margin-left: 1px;
  color: ${props => (props.primary ? "rgb(144,144,144)" : "white")};
  font-size: 12px;
`;

const ColLabelWrapper = styled.div`
  position: absolute;
  margin-top: 44px;
  margin-left: 50px;
  color: ${props => (props.primary ? "rgb(144,144,144)" : "white")};
  font-size: 12px;

  z-index: 10;
`;

const Square = props => {
  const {
    id,
    piece,
    primary,
    errorSquare,
    activeStartSquare,
    activeLandSquare,
    activeCanLandOn
  } = props;

  // set dot
  let canLandOn = false;
  if (activeCanLandOn) {
    activeCanLandOn.forEach(square => {
      const position = turnIdToPosition(id);
      if (square[0] === position[0] && square[1] === position[1]) {
        canLandOn = true;
      }
    });
  }

  // yellow highlights
  let selected = false;
  if (id === activeStartSquare || id === activeLandSquare) {
    selected = true;
  }
  // red border on king square
  let error = false;
  if (id === errorSquare) {
    error = true;
  }

  const rowLabels = {
    "[0][0]": "8",
    "[1][0]": "7",
    "[2][0]": "6",
    "[3][0]": "5",
    "[4][0]": "4",
    "[5][0]": "3",
    "[6][0]": "2",
    "[7][0]": "1"
  };

  const colLabels = {
    "[7][0]": "a",
    "[7][1]": "b",
    "[7][2]": "c",
    "[7][3]": "d",
    "[7][4]": "e",
    "[7][5]": "f",
    "[7][6]": "g",
    "[7][7]": "h"
  };

  return (
    <Wrapper
      id={id}
      primary={primary}
      selected={selected}
      error={error}
      canLandOn={canLandOn}
      className="square"
    >
      <RowLabelWrapper primary={primary}>{rowLabels[id]}</RowLabelWrapper>
      <ColLabelWrapper primary={primary}>{colLabels[id]}</ColLabelWrapper>
      {piece && <Piece img={piece.img} seleceted={selected} />}
    </Wrapper>
  );
};

export default Square;
