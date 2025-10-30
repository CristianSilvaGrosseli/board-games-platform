import { HeuristicEnum } from "@/app/enums/HeuristicEnum";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import KalahHeuristic1 from "@/app/Heuristics/Kalah/KalahHeuristic1";
import MinimaxHeuristic1 from "@/app/Heuristics/Minimax/MinimaxHeuristic1";

export default class HeuristicMap
{
  private static heuristicMap: Map<HeuristicEnum, (gameState: GameState) => number> = new Map([
    [HeuristicEnum.MinimaxHeuristic1, MinimaxHeuristic1],
    [HeuristicEnum.KalahState, KalahHeuristic1],
  ]);

  static getHeuristicScore(heuristicEnum: HeuristicEnum, gameState: GameState): number
  {
    const heuristicRoutine = this.heuristicMap.get(heuristicEnum);
    if (heuristicRoutine === undefined)
    {
      throw `HeuristicMap:getHeuristicScore: heuristic ${heuristicEnum} not implemented`;
    }
    return heuristicRoutine(gameState);    
  }
}