import GameController from "@/app/GameControllers/GameControllerInterface";
import TicTacToeController from "@/app/GameControllers/TicTacToeController";
import KalahController from "@/app/GameControllers/KalahController";

export default class GameControllerFactory
{
  static CreateTicTacToeControllerInstance(): GameController
  {
    return new TicTacToeController();
  }

  static CreateKalahControllerInstance(): GameController
  {
    return new KalahController();
  }
}