import React from "react";
import styled from "styled-components";

import Piece from "../../Board/Square/Piece/Piece";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;

  * {
    display: flex;
    height: 24px;

    background-size: cover;

    cursor: auto;
    &:active {
      cursor: auto;
    }
  }

  * > * {
    width: 24px;
  }

  .pawn:not(:first-of-type) {
    margin-left: -15px;
  }

  .knight:not(:first-of-type) {
    margin-left: -10px;
  }

  .bishop:not(:first-of-type) {
    margin-left: -12px;
  }

  .rook:not(:first-of-type) {
    margin-left: -12px;
  }

  .queen:not(:first-of-type) {
    margin-left: -12px;
  }
`;

const Eats = ({ array }) => {
  const piecesArray = array.map((p, i) => (
    <Piece key={i} className={p.type} img={p.img} />
  ));
  const pawns = piecesArray.filter(p => p.props.className === "pawn");
  const knights = piecesArray.filter(p => p.props.className === "knight");
  const bishops = piecesArray.filter(p => p.props.className === "bishop");
  const rooks = piecesArray.filter(p => p.props.className === "rook");
  const queens = piecesArray.filter(p => p.props.className === "queen");

  return (
    <Wrapper>
      <div>{pawns}</div>
      <div>{knights}</div>
      <div>{bishops}</div>
      <div>{rooks}</div>
      <div>{queens}</div>
    </Wrapper>
  );
};

export default Eats;
