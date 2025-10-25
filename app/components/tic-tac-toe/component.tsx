import { useState, useEffect, useRef } from "react";
import Board from './board/component';
import GameController from "@/app/GameControllers/GameControllerInterface";
import GameControllerFactory from "@/app/GameControllers/GameControllerFactory";
import { MCTS } from "@/app/IA/MCTS/MCTS";
import './styles.css'
import Minimax from "@/app/IA/Minimax/Minimax";

export default function TicTacToeUi({
  gameController
}:
{
  gameController: GameController
})
{
  const [history, setHistory] = useState([gameController.getCurrentBoardState()]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;

  const handlePlay = (nextSquares: string[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  useEffect(() => {
    const xIsNext = currentMove % 2 === 0;
    if (!xIsNext && !gameController.getCurrentGameState().isTerminal())
    {
      //const ia = new MCTS(gameController.current);
      const ia = new Minimax(gameController);
      const bestAction = ia.getBestAction();
      gameController.addPlayByGameState(bestAction);
      handlePlay(bestAction.getBoardState());
    }
  }, [currentMove]);

  const jumpTo = (nextMove: number) => {
    gameController.setCurrentGameState(nextMove);
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
          <Board xIsNext={xIsNext} gameController={gameController} onPlay={handlePlay} />
        </div>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </>
  );
}