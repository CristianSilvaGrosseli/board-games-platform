import { HeuristicEnum } from "@/app/enums/HeuristicEnum";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import KalahHeuristic1 from "@/app/Heuristics/Kalah/KalahHeuristic1";
import TicTacToeHeuristic1 from "@/app/Heuristics/TicTacToe/TicTacToeHeuristic1";

export default class HeuristicMap
{
  private static mHeuristicMap: Map<HeuristicEnum, (gameState: GameState) => number> = new Map([
    [HeuristicEnum.TicTacToeHeuristic1, TicTacToeHeuristic1],
    [HeuristicEnum.KalahHeuristic1, KalahHeuristic1],
  ]);

  private static mStringToEnumMap: Map<string, HeuristicEnum> = new Map([
    ["tictactoeheuristic1", HeuristicEnum.TicTacToeHeuristic1],
    ["kalahheuristic1", HeuristicEnum.KalahHeuristic1]
  ]);

  public static getHeuristicScore(heuristicEnum: HeuristicEnum, gameState: GameState): number
  {
    const heuristicRoutine = this.mHeuristicMap.get(heuristicEnum);
    if (heuristicRoutine === undefined)
    {
      throw `HeuristicMap:getHeuristicScore: heuristic ${heuristicEnum} not implemented`;
    }
    return heuristicRoutine(gameState);
  }

  public static stringToEnum(input: string): HeuristicEnum
  {
    const mappedEnum = this.mStringToEnumMap.get(input.toLowerCase());
    if (mappedEnum === undefined)
    {
      throw `HeuristicMap:stringToEnum: heuristic '${input}' not recognized`;
    }
    return mappedEnum;
  }
}