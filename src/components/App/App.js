import React, { useState } from "react";
import styled from "styled-components";

import "./App.css";

// sounds
import chessPieceLanding from "../../assets/sounds/chessPieceLanding.wav";
import chessPieceEat from "../../assets/sounds/chessPieceEat.ogg";
import isCheck from "../../assets/sounds/isCheck.wav";
import isCheckError from "../../assets/sounds/isCheckError.wav";
// helpers
import toTitleCase from "../helpers/toTitleCase";
// components
import Board from "../Board/Board";
import Promotion from "../Board/Promotion/Promotion";
import Eats from "./Eats/Eats";
import Notation from "../Notation/Notation";
// factories
import gameFactory from "../../factories/gameFactory";

const game = gameFactory();
const chessPieceLandAudio = new Audio(chessPieceLanding);
const chessPieceEatAudio = new Audio(chessPieceEat);
const isCheckAudio = new Audio(isCheck);
const isCheckErrorAudio = new Audio(isCheckError);

const MARGIN_TOP = "100px";

const Wrapper = styled.div`
  margin-top: ${MARGIN_TOP};
  margin-left: 100px;
`;

const WhitePlayerBoardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  color: #6c757d;
  font-size: 13px;
  font-weight: 500;
`;

const BlackPlayerBoardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  color: #6c757d;
  font-size: 13px;
  font-weight: 500;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;

  min-width: 1000px;
`;

const App = () => {
  // game states
  const [currentPlayer, setCurrentPlayer] = useState(game.getCurrentPlayer());
  const [isChecked, setIsChecked] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [board, setBoard] = useState(game.getBoard());
  const [pause, setPause] = useState(false);

  // promote pawn states
  const [promotePawn, setPromotePawn] = useState({});
  const [showPromotionBoard, setShowPromotionBoard] = useState(false);

  // game messages
  const [message, setMessage] = useState("White's turn to play");
  const [errorSquare, setErrorSquare] = useState([]);

  // pieces & score UI
  const [whitePlayerEats, setWhitePlayerEats] = useState([]);
  const [blackPlayerEats, setBlackPlayerEats] = useState([]);

  const handlePawnPromotion = (piece, color) => event => {
    setPromotePawn(null);
    game.promotePawnTo(promotePawn, piece, color);
    setShowPromotionBoard(false);
  };

  const handleNotationClick = e => {
    let li = e.target.parentNode;
    let moveCount = li.querySelector(".moveCount").textContent;

    // grab number on class
    let moveClasses = e.target.classList[1];
    let boardNumber = moveClasses.slice(-1);
    let subtract;
    boardNumber === "0" ? (subtract = 2) : (subtract = 1);

    let index = Number(moveCount) * 2 - subtract;

    const oldBoard = game.getMemory()[index];
    setBoard(oldBoard);
    setPause(true);
    setMessage("click on most recent move to unpause game.");

    if (index === game.getMemory().length - 1) {
      console.log("hi");
      setPause(false);
      setMessage("Continue playing!");
    }
  };

  const resetTurn = (piece, start, end, message) => {
    game.getGameboard().resetPiece(piece, start, start);
    setMessage(message);
  };

  const checkIfLegalMove = (start, end) => {
    const piece = game.getGameboard().getPiece(start);
    const [flag, message] = game.canMoveWithMessage(piece, start, end);
    let showErrorSquare = false;

    if (flag) {
      playTurn(piece, start, end, message);
    } else {
      if (message === "that move leads to check!!") {
        isCheckErrorAudio.play();
        showErrorSquare = true;
      }
      resetTurn(piece, start, end, message);

      if (showErrorSquare) {
        const kingSquare = game.getGameboard().findKingSquare(currentPlayer);
        setErrorSquare(kingSquare);
      }
    }

    return flag;
  };

  const playTurn = (piece, start, end, message) => {
    // reset en passants
    game.clearEnPassantables(currentPlayer);
    // reset errorSquare
    setErrorSquare([]);

    let opponent;
    currentPlayer === "white" ? (opponent = "black") : (opponent = "white");

    // play legal move
    let [newBoard, isEat, stalemate] = game.playMove(piece, start, end);

    // play audio
    if (isEat) {
      chessPieceEatAudio.play();
      setWhitePlayerEats(game.getWhitePlayer().getHasEaten());
      setBlackPlayerEats(game.getBlackPlayer().getHasEaten());
    } else {
      chessPieceLandAudio.play();
    }
    //check for pawn to promote
    const promotePawnArray = game.getPawnToPromote(currentPlayer);
    if (promotePawnArray.length > 0) {
      setPromotePawn(promotePawnArray[0]);
      setShowPromotionBoard(true);
    }
    // update board
    setBoard(newBoard);

    // change turn
    game.changePlayerTurn();
    setCurrentPlayer(game.getCurrentPlayer());
    // look for check
    let checkedStatus = game.isChecked(game.getCurrentPlayer());
    // check if stalemate by no moves
    let noMoves = !game.anyMovesLeft(game.getCurrentPlayer());
    // message UI
    setMessage(message);
    if (stalemate || (!checkedStatus && noMoves)) {
      setMessage("STALEMATE");
      setIsGameOver(true);
    }

    // if check, look for gameover
    if (checkedStatus) {
      isCheckAudio.play();
      let result = game.anyMovesLeft(opponent);
      if (!result) {
        setMessage(`CONGRATS, PLAYER ${currentPlayer} WINS`);
        setIsGameOver(true);
      }
    }
  };

  return (
    <Wrapper>
      <div id="currentPlayer">
        {toTitleCase(`${currentPlayer} turn to move`)}
      </div>
      <div id="moveMessage">{message}</div>
      <BlackPlayerBoardWrapper>
        <Eats id="blackEats" array={blackPlayerEats} />
        <div id="blackScore">{game.getIsUpBy("black")}</div>
      </BlackPlayerBoardWrapper>
      {showPromotionBoard && (
        <Promotion
          pawn={promotePawn}
          handlePawnPromotion={handlePawnPromotion}
        />
      )}
      <MainWrapper id="main">
        <Board
          errorSquare={errorSquare}
          gameboard={game.getGameboard()}
          setMessage={setMessage}
          board={board}
          checkIfLegalMove={checkIfLegalMove}
          currentPlayer={currentPlayer}
          gameOver={isGameOver}
          game={game}
          pause={pause}
        />
        <Notation
          data={game.getNotation().getMoves()}
          handleNotationClick={handleNotationClick}
        />
      </MainWrapper>
      <WhitePlayerBoardWrapper id="whitePlayerBoard">
        <Eats id="whiteEats" array={whitePlayerEats} />
        <div id="whiteScore">{game.getIsUpBy("white")}</div>
      </WhitePlayerBoardWrapper>
      <div id="isChecked">{isChecked && "YOU CHECKED"}</div>
    </Wrapper>
  );
};

export default App;
