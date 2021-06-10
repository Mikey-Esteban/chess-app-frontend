import React from "react";
import styled from "styled-components";

const ULWrapper = styled.ul`
  list-style-type: none;
  width: 300px;
  max-height: 450px; /*The important part*/
  overflow-y: auto; /*Also...*/
  overflow-x: hidden; /*And the end of the important part*/

  font-size: 12px;
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
    background: yellow;
  }
`;

const Notation = ({ data, handleNotationClick }) => {
  let moves = [];

  // const handleClick = e => {
  //   let li = e.target.parentNode;
  //   let moveCount = li.querySelector(".moveCount").textContent;
  //   // grab number on class
  //   let moveClasses = e.target.classList[1];
  //   let boardNumber = moveClasses.slice(-1);
  //   console.log("BOARD NUMBER", boardNumber);
  //
  //   console.log(`ok: ${moveCount} ${boardNumber}`);
  // };

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

  return <ULWrapper>{moves}</ULWrapper>;
};

export default Notation;
