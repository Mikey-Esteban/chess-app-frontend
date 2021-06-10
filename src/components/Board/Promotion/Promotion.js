import React from "react";
import styled from "styled-components";

import Piece from "../Square/Piece/Piece";
import queenFactory from "../../../factories/pieces/queenFactory";
import rookFactory from "../../../factories/pieces/rookFactory";
import knightFactory from "../../../factories/pieces/knightFactory";
import bishopFactory from "../../../factories/pieces/bishopFactory";

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 162px;

  border: 1px solid #efefef;

  position: absolute;
  top: 210px;
  left: 170px;

  z-index: 10;
`;

const Wrapper = styled.div`
  width: 80px;
  height: 80px;

  background: white;

  display: flex;
  justify-content: center;
  align-items: center;

  * {
    cursor: pointer;
  }

  &:hover {
    background: rgb(255, 223, 93);
  }
`;

const Promotion = props => {
  const color = props.pawn.color;
  const queen = queenFactory(color);
  const rook = rookFactory(color);
  const knight = knightFactory(color);
  const bishop = bishopFactory(color);
  return (
    <Main>
      <Wrapper onClick={props.handlePawnPromotion(queen, color)}>
        <Piece img={queen.img} />
      </Wrapper>
      <Wrapper onClick={props.handlePawnPromotion(rook, color)}>
        <Piece img={rook.img} />
      </Wrapper>
      <Wrapper onClick={props.handlePawnPromotion(knight, color)}>
        <Piece img={knight.img} />
      </Wrapper>
      <Wrapper onClick={props.handlePawnPromotion(bishop, color)}>
        <Piece img={bishop.img} />
      </Wrapper>
    </Main>
  );
};

export default Promotion;
