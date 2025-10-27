import IAInterface from "@/app/IA/IAInterface";
import GameController from "@/app/GameControllers/GameControllerInterface";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";

export default class Minimax extends IAInterface
{
  private mMaximizingPlayerId: string = "";

  constructor(game: GameController)
  {
    super(game);
  }

  public getBestAction(): GameState
  {
    this.reset();
    const gameState = this.mGame.getCurrentGameState();
    const legalMovements = gameState.getLegalPlays();

    let bestScore: number = -Infinity;
    let bestMove: GameState | null = null;
    for (let legalMovement of legalMovements)
    {
      const { score } = this.minimax(legalMovement);
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

  private reset(): void
  {
    this.mMaximizingPlayerId = this.mGame.getCurrentTurnPlayer();
  }

  private minimax(gameState: GameState): { score: number, move: GameState | null }
  {
    if (gameState.isTerminal())
    {
      return { score: this.getLeafScore(gameState), move: null };
    }

    const legalMovements = gameState.getLegalPlays();
    const isMaximizing = this.mMaximizingPlayerId === gameState.getPlayerId();
    if (isMaximizing)
    {
      let bestScore: number = -Infinity;
      let bestMove: GameState | null = null;
      for (let legalMovement of legalMovements)
      {
        const { score } = this.minimax(legalMovement);
        if (score > bestScore)
        {
          bestScore = score;
          bestMove = legalMovement;
        }
      }
      return { score: bestScore, move: bestMove };
    }
    else
    {
      let bestScore: number = Infinity;
      let bestMove: GameState | null = null;
      for (let legalMovement of legalMovements)
      {
        const { score } = this.minimax(legalMovement);
        if (score < bestScore)
        {
          bestScore = score;
          bestMove = legalMovement;
        }
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