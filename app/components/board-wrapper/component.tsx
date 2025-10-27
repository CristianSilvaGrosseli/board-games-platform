import { JSX, useRef } from "react";
import { GameNameEnum } from "@/app/enums/GameNameEnum";
import TicTacToeUi from "@/app/components/tic-tac-toe/component";
import KalahBoard from "@/app/components/mancala/kalah-board/component";
import GameController from "@/app/GameControllers/GameControllerInterface";
import GameControllerFactory from "@/app/GameControllers/GameControllerFactory";
import Player from "@/app/Player/Player";
import { PlayerTypeEnum } from "@/app/enums/PlayerTypeEnum";

export default function BoardWrapper({
  choosedGame
}:
{
  choosedGame: GameNameEnum
})
{
  const gameControllerRef = useRef<GameController>(null);

  const getGamerController = (controllerInitializer: (arg1: Player, arg2: Player) => GameController): GameController =>
  {
    if (gameControllerRef.current === null)
    {
      const player1 = new Player(PlayerTypeEnum.Human, "Cristian", true);
      const player2 = new Player(PlayerTypeEnum.IA, "Beth Harmon", false);
      gameControllerRef.current = controllerInitializer(player1, player2);
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
  else if (choosedGame === GameNameEnum.Kalah)
  {
    boardComponent = <KalahBoard gameController={getGamerController(GameControllerFactory.CreateKalahControllerInstance)} />
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