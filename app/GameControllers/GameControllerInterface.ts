import Player from "@/app/Player/Player";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";

export default abstract class GameController
{
  protected mStatesHistory: GameState[] = [];
  protected mPlayers: Player[] = [];

  constructor()
  {
    this.mPlayers.push(new Player("Cristian"));
    this.mPlayers.push(new Player("Beth Harmon"));
  }

  public getCurrentGameState(): GameState
  {
    return this.mStatesHistory[this.mStatesHistory.length - 1];
  }

  public getCurrentTurnPlayer(): string
  {
    return this.getCurrentGameState().getPlayerId();
  }

  public addPlay(boardState: string[]): void
  {
    throw "must implement overload method";
  }

  public getCurrentBoardState(): string[]
  {
    return this.getCurrentGameState().getBoardState();
  }

  public setCurrentGameState(gameStateIndex: number): void
  {
    this.mStatesHistory = this.mStatesHistory.slice(0, gameStateIndex + 1);
  }

  public hasWinner(): boolean
  {
    return this.getCurrentGameState().getWinnerPlayerId().length > 0;
  }

  public getWinnerName(): string
  {
    const winnerId = this.getCurrentGameState().getWinnerPlayerId();
    if (!winnerId)
    {
      return "";
    }
    return this.mPlayers[0].getId() === winnerId ? this.mPlayers[0].getName() : this.mPlayers[1].getName();
  }
}