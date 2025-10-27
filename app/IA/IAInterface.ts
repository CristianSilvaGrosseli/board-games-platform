import GameController from "@/app/GameControllers/GameControllerInterface";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";

export default abstract class IAInterface
{
  protected mGame: GameController;

  constructor(game: GameController)
  {
    this.mGame = game;
  }

  public getBestAction(): GameState
  {
    throw "IAInterface:getBestAction: must implement overload method";
  }
}