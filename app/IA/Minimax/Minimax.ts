import IAInterface from "@/app/IA/IAInterface";
import GameController from "@/app/GameControllers/GameControllerInterface";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import { HeuristicEnum } from "@/app/enums/HeuristicEnum";
import HeuristicMap from "@/app/Heuristics/HeuristicMap";

export default class Minimax extends IAInterface
{
  private mMaximizingPlayerId: string = "";

  constructor(game: GameController)
  {
    super(game);
  }

  public getBestAction(heuristic?: HeuristicEnum): GameState
  {
    this.reset(heuristic);
    const gameState = this.mGame.getCurrentGameState();
    const legalMovements = gameState.getLegalPlays();
    const depth = 7;

    let bestScore: number = -Infinity;
    let bestMove: GameState | null = null;
    const alpha = -Infinity;
    const beta = Infinity;
    for (let legalMovement of legalMovements)
    {
      const { score } = this.minimax(legalMovement, depth, alpha, beta);
      if (score > bestScore)
      {
        bestScore = score;
        bestMove = legalMovement;
      }
    }
    if (!bestMove)
    {
      throw "Minimax:getBestAction: best move not found";
    }
    return bestMove;
  }

  private reset(heuristic?: HeuristicEnum): void
  {
    this.mHeuristic = heuristic ? heuristic : HeuristicEnum.NoHeuristic;
    this.mMaximizingPlayerId = this.mGame.getCurrentTurnPlayer().getId();
  }

  private minimax(gameState: GameState, depth: number, alpha: number, beta: number): { score: number, move: GameState | null }
  {
    if (depth === 0 || gameState.isTerminal())
    {
      return {
        score: this.mHeuristic !== HeuristicEnum.NoHeuristic ? HeuristicMap.getHeuristicScore(this.mHeuristic, gameState) : this.getLeafScore(gameState),
        move: null
      };
    }

    const legalMovements = gameState.getLegalPlays();
    const isMaximizing = this.mMaximizingPlayerId === gameState.getPlayerId();
    if (isMaximizing)
    {
      let bestScore: number = -Infinity;
      let bestMove: GameState | null = null;
      for (let legalMovement of legalMovements)
      {
        const { score } = this.minimax(legalMovement, depth - 1, alpha, beta);
        if (score > bestScore)
        {
          bestScore = score;
          bestMove = legalMovement;
        }
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }
      return { score: bestScore, move: bestMove };
    }
    else
    {
      let bestScore: number = Infinity;
      let bestMove: GameState | null = null;
      for (let legalMovement of legalMovements)
      {
        const { score } = this.minimax(legalMovement, depth - 1, alpha, beta);
        if (score < bestScore)
        {
          bestScore = score;
          bestMove = legalMovement;
        }
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break;
      }
      return { score: bestScore, move: bestMove };
    }
  }

  private getLeafScore(gameState: GameState): number
  {
    const winnerId = gameState.getWinnerPlayerId();
    if (winnerId === this.mMaximizingPlayerId)
    {
      return 1;
    }
    if (winnerId.length > 0)
    {
      return -1;
    }
    return 0;
  }
}