import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import KalahState from "@/app/GameControllers/GameState/KalahState";

export default function KalahHeuristic1(gameState: GameState): number
{
  if ((gameState instanceof KalahState) === false)
  {
    throw "KalahHeuristic1: gameState is not a KalahState";
  }
  const kalahState: KalahState = (gameState as KalahState);
  return kalahState.getPlayerStoreSeedsQuantity() - kalahState.getOpponentStoreSeedsQuantity();
}