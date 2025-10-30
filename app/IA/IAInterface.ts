import GameController from "@/app/GameControllers/GameControllerInterface";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import { HeuristicEnum } from "../enums/HeuristicEnum";

export default abstract class IAInterface
{
  protected mGame: GameController;
  protected mHeuristic: HeuristicEnum = HeuristicEnum.NoHeuristic;

  constructor(game: GameController)
  {
    this.mGame = game;
  }

  public getBestAction(heuristic?: HeuristicEnum): GameState
  {
    throw "IAInterface:getBestAction: must implement overload method";
  }
}