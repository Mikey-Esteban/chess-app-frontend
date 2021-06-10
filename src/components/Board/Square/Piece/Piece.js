import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 60px;
  width: 60px;

  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Piece = props => {
  return (
    <Wrapper
      className={props.className || "chessPiece"}
      style={{ backgroundImage: `url(${props.img})` }}
    ></Wrapper>
  );
};

export default Piece;
