import { JSX, useState, useEffect, useRef } from "react";
import GameControllerFactory from "@/app/GameControllers/GameControllerFactory";
import GameController from "@/app/GameControllers/GameControllerInterface";
import Player from "@/app/Player/Player";
import IAFactory from "@/app/IA/IAFactory";
import { GameNameEnum } from "@/app/enums/GameNameEnum";
import { PlayerTypeEnum } from "@/app/enums/PlayerTypeEnum";
import { IANameEnum } from "@/app/enums/IANameEnum";
import TicTacToeBoard from "@/app/components/tic-tac-toe/board/component";
import KalahBoard from "@/app/components/mancala/kalah-board/component";

export default function BoardWrapper({
  choosedGame
}:
{
  choosedGame: GameNameEnum
})
{
  const gameControllerRef = useRef<GameController>(null);
  const player1 = new Player(PlayerTypeEnum.Human, "Cristian", true);
  const player2 = new Player(PlayerTypeEnum.IA, "Beth Harmon", false);
  const choosedIA = IANameEnum.MCTS;

  const getGamerController = (controllerInitializer: (arg1: Player, arg2: Player) => GameController): GameController =>
  {
    if (gameControllerRef.current === null)
    {
      gameControllerRef.current = controllerInitializer(player1, player2);
    }
    if (gameControllerRef.current === null)
    {
      throw "BoardWrapper: it was not possible to instance a GameController object";
    }
    return gameControllerRef.current;
  }

  let handlePlay: (play: any) => void;
  const onPlay: (play: any) => void = (play: any) => handlePlay(play);

  let boardComponent: JSX.Element;
  if (choosedGame === GameNameEnum.TicTacToe)
  {
    boardComponent = <TicTacToeBoard gameController={getGamerController(GameControllerFactory.CreateTicTacToeControllerInstance)} onPlay={onPlay} />
  }
  else if (choosedGame === GameNameEnum.Kalah)
  {
    boardComponent = <KalahBoard gameController={getGamerController(GameControllerFactory.CreateKalahControllerInstance)} onPlay={onPlay} />
  }
  else
  {
    throw `BoardWrapper component: invalid GameNameEnum: ${choosedGame}`;
  }

  const gameController = gameControllerRef.current;
  if (gameController === null)
  {
    throw "BoardWrapper: error to initialize a GameController instance";
  }

  const [history, setHistory] = useState([gameController.getCurrentGameState()]);
  const [currentMove, setCurrentMove] = useState(0);

  handlePlay = (play: any) => {
    gameController.addPlay(play);
    const newState = gameController.getCurrentGameState();
    const nextHistory = [...history.slice(0, currentMove + 1), newState];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  useEffect(() => {
    const currentTurnPlayer: Player = gameController.getCurrentTurnPlayer();
    if (currentTurnPlayer.getType() === PlayerTypeEnum.IA &&
        !gameController.isGameOver()
    )
    {
      const ia = IAFactory.CreateInstance(choosedIA, gameController);
      const bestPlay = ia.getBestAction();
      handlePlay(bestPlay);
    }
  }, [history]);

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

  const isGameOver = gameController.isGameOver();
  let status: string = "";
  if (isGameOver)
  {
    status = gameController.hasWinner() ? `Winner: ${gameController.getWinnerName()}` : "Draw";
  }
  else
  {
    status = "Next player: " + gameController.getCurrentTurnPlayer().getName();
  }

  return (
    <>
      <div className='status'>{status}</div>
      {boardComponent}
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </>
  );
}