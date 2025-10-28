import GameController from "@/app/GameControllers/GameControllerInterface";
import GameStateFactory from "./GameState/GameStateFactory";
import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import Player from "@/app/Player/Player";

export default class KalahController extends GameController
{
  private mPlayerInitialIndexMap:Map<string, number> = new Map();
  constructor(player1: Player, player2: Player)
  {
    super(player1, player2);
    this.setPlayersInitialIndex();
    this.setInitialState();
  }

  public addPlay(play: any): void
  {
    if (this.isGameOver())
    {
      throw "KalahController:addPlay: game already finished";
    }
    if (play instanceof GameState)
    {
      this.addPlayByGameState(play);
      return;
    }
    if (typeof play !== "number")
    {
      throw "KalahController:addPlay: invalid argument type";
    }
    const newPlay = this.getCurrentGameState().getLegalPlay(play);
    this.addPlayByGameState(newPlay);
  }

  protected setInitialState(): void
  {
    const initialState = Array(14);
    initialState.fill(4, 1, 7); // initial seeds of player1
    initialState.fill(4, 8, 14); // initial seeds of player2
    initialState[0] = 0;  // player1 store
    initialState[7] = 0; // player2 store

    const { startingPlayerId, opponentPlayerId } = this.getInitialPlayersArrangement();
    const startingPlayerInitialIndex = this.getPlayerInitialIndex(startingPlayerId);
    const oppnentPlayerInitialIndex = this.getPlayerInitialIndex(opponentPlayerId);
    const initialGameState = GameStateFactory.CreateKalahStateInstance(initialState, startingPlayerId, startingPlayerInitialIndex, opponentPlayerId, oppnentPlayerInitialIndex);
    this.mStatesHistory.push(initialGameState);
  }

  private getPlayerInitialIndex(playerId: string): number
  {
    const initialIndex = this.mPlayerInitialIndexMap.get(playerId);
    if (initialIndex === undefined)
    {
      throw "KalahController:getPlayerInitialIndex: unknown playerId";
    }
    return initialIndex;
  }

  private setPlayersInitialIndex(): void
  {
    this.mPlayerInitialIndexMap.set(this.mPlayers[0].getId(), 1);
    this.mPlayerInitialIndexMap.set(this.mPlayers[1].getId(), 8);
  }
}