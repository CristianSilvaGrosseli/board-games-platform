import Player from "@/app/Player/Player";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";

export default abstract class GameController
{
  protected mStatesHistory: GameState[] = [];
  protected mPlayers: Player[] = [];
  protected mStartingPlayerId: string = "";

  constructor(player1: Player, player2: Player)
  {
    this.mPlayers.push(player1);
    this.mPlayers.push(player2);
    this.mStartingPlayerId = this.mPlayers[0].getId();
  }

  public getCurrentGameState(): GameState
  {
    return this.mStatesHistory[this.mStatesHistory.length - 1];
  }

  public getCurrentTurnPlayer(): string
  {
    return this.getCurrentGameState().getPlayerId();
  }

  public addPlayByGameState(gameState: GameState): void
  {
    this.mStatesHistory.push(gameState);
  }

  public addPlay(play: any): void
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
  
  protected getInitialPlayersArrangement():
  {
    startingPlayerId: string,
    opponentPlayerId: string
  }
  {
    const startingPlayer = this.mPlayers.find((player: Player) => player.isStartingPlayer());
    if (startingPlayer === undefined)
    {
      throw "GameController:getInitialPlayersArrangement: starting player not defined";
    }
    const opponentPlayer = this.mPlayers.find((player: Player) => !player.isStartingPlayer());
    if (opponentPlayer === undefined)
    {
      throw "GameController:getInitialPlayersArrangement: opponent player not defined";
    }
    return { startingPlayerId: startingPlayer.getId(), opponentPlayerId: opponentPlayer.getId() };
  }

  protected setInitialState(): void
  {
    throw "GameController:setInitialState: must implement overload method";
  }
}