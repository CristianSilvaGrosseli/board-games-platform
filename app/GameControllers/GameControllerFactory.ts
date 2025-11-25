import GameController from "@/app/GameControllers/GameControllerInterface";
import TicTacToeController from "@/app/GameControllers/TicTacToeController";
import KalahController from "@/app/GameControllers/KalahController";
import Player from "@/app/Player/Player";
import { GameNameEnum } from "@/app/enums/GameNameEnum";

export default class GameControllerFactory
{
  static CreateTicTacToeControllerInstance(player1: Player, player2: Player): GameController
  {
    return new TicTacToeController(player1, player2);
  }

  static CreateKalahControllerInstance(player1: Player, player2: Player): GameController
  {
    return new KalahController(player1, player2);
  }

  static CreateInstance(gameNameEnum: GameNameEnum, player1: Player, player2: Player): GameController
  {
    if (gameNameEnum === GameNameEnum.TicTacToe)
    {
      return new TicTacToeController(player1, player2);
    }
    if (gameNameEnum === GameNameEnum.Kalah)
    {
      return new KalahController(player1, player2);
    }
    throw `GameControllerFactory: invalid GameNameEnum: ${gameNameEnum}`;
  }
}