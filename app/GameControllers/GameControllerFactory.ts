import GameController from "@/app/GameControllers/GameControllerInterface";
import TicTacToeController from "@/app/GameControllers/TicTacToeController";
import KalahController from "@/app/GameControllers/KalahController";
import Player from "@/app/Player/Player";

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
}