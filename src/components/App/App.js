import React, { useState } from "react";
import styled from "styled-components";
import axios from 'axios'

import { Button } from '../../components'
import "./App.css";

// sounds
import chessPieceLanding from "../../assets/sounds/chessPieceLanding.wav";
import chessPieceEat from "../../assets/sounds/chessPieceEat.ogg";
import isCheck from "../../assets/sounds/isCheck.wav";
import isCheckError from "../../assets/sounds/isCheckError.wav";
// helpers
import toTitleCase from "../helpers/toTitleCase";
import turnIdToPosition from "../helpers/turnIdToPosition";
// components
import Board from "../Board/Board";
import Promotion from "../Board/Promotion/Promotion";
import Eats from "./Eats/Eats";
import Notation from "../Notation/Notation";
// factories
import gameFactory from "../../factories/gameFactory";

let pythonUrl = 'http://127.0.0.1:5000/fen/'

let game = gameFactory();
const chessPieceLandAudio = new Audio(chessPieceLanding);
const chessPieceEatAudio = new Audio(chessPieceEat);
const isCheckAudio = new Audio(isCheck);
const isCheckErrorAudio = new Audio(isCheckError);

const BOX_SIZE = 60;

const Wrapper = styled.div`
  margin-left: 3rem;

  #moveMessage {
    margin: 1rem;
    font-size: .7rem;
  }

  .buttonsWrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding-top: 1rem;
  }
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

  // board UI states
  const [activePieceTile, setActivePieceTile] = useState(null);
  const [activeStartSquare, setActiveStartSquare] = useState(null);
  const [activeLandSquare, setActiveLandSquare] = useState(null);
  const [activeCanLandOn, setActiveCanLandOn] = useState(null);

  // promote pawn states
  const [promotePawn, setPromotePawn] = useState({});
  const [showPromotionBoard, setShowPromotionBoard] = useState(false);

  // game messages
  const [message, setMessage] = useState("White's turn to play");
  const [errorSquare, setErrorSquare] = useState([]);

  // pieces & score UI
  const [whitePlayerEats, setWhitePlayerEats] = useState([]);
  const [blackPlayerEats, setBlackPlayerEats] = useState([]);

  ////////////////////////
  ////// BOARD UI FUNCTIONS
  ///////////////////

  const grabChessPiece = e => {
    if (e.target.classList.contains("chessPiece") && !pause) {
      const id = e.target.parentNode.id;
      const position = turnIdToPosition(id);
      const goodMoves = game.getGoodPieceMoves(position);
      setActiveCanLandOn(goodMoves);
      const piece = game.getGameboard().getPiece(position);
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

      const flag = checkIfLegalMove(oldSquare, newSquare);
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

  /////////////////////
  //// NEW GAME BUTTON UI
  ////////////////

  const handleNewGameClick = () => {
    game = gameFactory();
    setCurrentPlayer(game.getCurrentPlayer());
    setIsChecked(false);
    setIsGameOver(false);
    setBoard(game.getBoard());
    setPause(false);
    setPromotePawn({});
    setShowPromotionBoard(false);
    setMessage("White's turn to play");
    setErrorSquare([]);
    setWhitePlayerEats([]);
    setBlackPlayerEats([]);
    setActivePieceTile(null);
    setActiveStartSquare(null);
    setActiveLandSquare(null);
    setActiveCanLandOn(null);

    console.log("game is now", game);
  };

  //////////////////////
  ///// NOTATION UI
  ///////////////////

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

  /////////////////////
  //// GAME FUNCTIONS
  ////////////////

  const handlePawnPromotion = (piece, color) => event => {
    setPromotePawn(null);
    game.promotePawnTo(promotePawn, piece, color);
    setShowPromotionBoard(false);
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
        const kingSquare = game.getGameboard().getKingSquare(currentPlayer);
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
        setMessage(`CONGRATS, PLAYER ${currentPlayer.toUpperCase()} WINS`);
        setIsGameOver(true);
      }
    }

    console.log("MOVE PLAYED, fens", game.getLastFen());
  };


  // replace fen with periods to send to python script
  const fenWithPeriods = () =>  game.getLastFen().replace(/\//g, '.')

  const checkPythonMove = () => {
    axios.get(`http://127.0.0.1:5000/fen/${fenWithPeriods()}`)
      .then(resp => {
        // api result of best move
        const bestMove = resp.data.best_move
        // deconstruct notation
        let [ startNote, endNote ] = game.getStartAndEndFromMove(bestMove)
        // grab board position of notations
        let startPos = game.getBoardPosFromNotation(startNote)
        let endPos = game.getBoardPosFromNotation(endNote)
        // grab piece
        const piece = game.getGameboard().getPiece(startPos)
        console.log('PIECE', piece)
        console.log('GAMEBOARD START END', startPos, endPos)
        const strStartPos = game.getGameboard().getStrRepresentation(startPos)
        const strEndPos = game.getGameboard().getStrRepresentation(endPos)

        // play turn
        playTurn(piece, startPos, endPos, `computer played move ${bestMove}`)
        // update active square UI
        setActiveStartSquare(strStartPos)
        setActiveLandSquare(strEndPos)
      })
      .catch(error => console.log(error))
    // window.open(`http://127.0.0.1:5000/fen/${fenWithPeriods()}`)
  }


  return (
    <Wrapper>
      <div id="currentPlayer" className="buttonsWrapper">
        <Button handleClick={handleNewGameClick} text={'New Game'} />
        <Button primary={true} handleClick={checkPythonMove} text={'play best move'} />
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
          activePieceTile={activePieceTile}
          activeStartSquare={activeStartSquare}
          activeLandSquare={activeLandSquare}
          activeCanLandOn={activeCanLandOn}
          grabChessPiece={grabChessPiece}
          releaseChessPiece={releaseChessPiece}
          moveChessPiece={moveChessPiece}
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
