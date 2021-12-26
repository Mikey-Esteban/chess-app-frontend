import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-left: 2rem;
`;

const ULWrapper = styled.ul`
  list-style-type: none;
  width: 250px;
  max-height: 250px; /*The important part*/
  overflow-y: auto; /*Also...*/
  overflow-x: hidden; /*And the end of the important part*/

  font-size: .6rem;
  li:nth-child(odd) {
    background: #efefef;
  }
`;

const LIWrapper = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .move {
    width: 60px;
    cursor: pointer;
    padding: 5px;
  }

  .move:hover {
    background: rgb(255,223,93);
  }
`;

const Notation = ({ data, handleNotationClick }) => {
  let moves = [];

  for (const property in data) {
    const thing = (
      <LIWrapper key={property}>
        <div className="moveCount">{property}</div>
        <div className="move move0" onClick={handleNotationClick}>
          {data[property][0]}
        </div>
        <div className="move move1" onClick={handleNotationClick}>
          {data[property][1]}
        </div>
      </LIWrapper>
    );
    moves.push(thing);
  }

  return (
    <Wrapper>
      {moves.length > 0 && <p>Moves</p>}
      <ULWrapper>{moves}</ULWrapper>
    </Wrapper>
  );
};

export default Notation;
