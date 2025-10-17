import { useState, useRef } from "react";
import Board from './board/component';
import GameController from "@/app/GameControllers/GameControllerInterface";
import GameControllerFactory from "@/app/GameControllers/GameControllerFactory";
import './styles.css'

export default function Game()
{
  const gameController = useRef<GameController>(null);
  if (!gameController.current)
  {
    gameController.current = GameControllerFactory.CreateTicTacToeControllerInstance();
  }
  const [history, setHistory] = useState([gameController.current.getCurrentBoardState()]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = (nextSquares: string[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove: number) => {
    gameController.current?.setCurrentGameState(nextMove);
    setCurrentMove(nextMove);
  };

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0)
    {
      description = "Go to move #" + move;
    }
    else
    {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move) }>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} gameController={gameController.current} onPlay={handlePlay} />
        </div>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </>
  );
}