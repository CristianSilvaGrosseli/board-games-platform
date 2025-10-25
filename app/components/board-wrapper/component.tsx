import { JSX, useRef } from "react";
import { GameNameEnum } from "@/app/enums/GameNameEnum";
import TicTacToeUi from "@/app/components/tic-tac-toe/component";
import GameController from "@/app/GameControllers/GameControllerInterface";
import GameControllerFactory from "@/app/GameControllers/GameControllerFactory";

export default function BoardWrapper({
  choosedGame
}:
{
  choosedGame: GameNameEnum
})
{
  const gameControllerRef = useRef<GameController>(null);

  const getGamerController = (controllerInitializer: () => GameController): GameController =>
  {
    if (gameControllerRef.current === null)
    {
      gameControllerRef.current = controllerInitializer();
    }
    if (gameControllerRef.current === null)
    {
      throw "BoardWrapper: it was not possible to instance a GameController object";
    }
    return gameControllerRef.current;
  }

  let boardComponent: JSX.Element;
  if (choosedGame === GameNameEnum.TicTacToe)
  {
    boardComponent = <TicTacToeUi gameController={getGamerController(GameControllerFactory.CreateTicTacToeControllerInstance)} />
  }
  else
  {
    throw `BoardWrapper component: invalid GameNameEnum: ${choosedGame}`;
  }
  return (
    <>
      {boardComponent}
    </>
  );
}