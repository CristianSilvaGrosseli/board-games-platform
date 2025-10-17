import GameController from "@/app/GameControllers/GameControllerInterface";
import TicTacToeController from "@/app/GameControllers/TicTacToeController";

export default class GameControllerFactory
{
  static CreateTicTacToeControllerInstance(): GameController
  {
    return new TicTacToeController();
  }
}