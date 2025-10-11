import GameController from "@/app/GameControllers/GameControllerInterface";
import TicTacToeState from "@/app/GameControllers/GameState/TicTacToeState";

export default class TicTacToeController extends GameController
{
  constructor()
  {
    super();
    this.setInitialState();
  }

  private setInitialState(): void
  {
    const initialBoard = Array(9).fill(null);
    const initialState = new TicTacToeState(initialBoard, this.mPlayers[0].getId(), "X", this.mPlayers[1].getId());
    this.mStatesHistory.push(initialState);
  }

  public addPlay(boardState: string[]): void
  {
    const currentTurnPlayerId = this.getCurrentTurnPlayerId();
    const playerSymbol = this.getSymbolFromPlayerId(currentTurnPlayerId);
    const opponentPlayerId = currentTurnPlayerId === this.mPlayers[0].getId() ? this.mPlayers[1].getId() : this.mPlayers[0].getId();
    const newGameState = new TicTacToeState(boardState.slice(), opponentPlayerId, playerSymbol, currentTurnPlayerId);
    this.mStatesHistory.push(newGameState);
  }

  private getCurrentTurnPlayerId(): string
  {
    return this.getCurrentGameState().getPlayerId();
  }

  private getSymbolFromPlayerId(playerId: string): string
  {
    if (this.mPlayers[0].getId() === playerId)
    {
      return "X";
    }
    if (this.mPlayers[1].getId() === playerId)
    {
      return "O";
    }
    throw "unknown player id";
  }
}