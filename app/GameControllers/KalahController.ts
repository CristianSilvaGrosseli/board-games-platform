import GameController from "@/app/GameControllers/GameControllerInterface";
import GameStateFactory from "./GameState/GameStateFactory";

export default class KalahController extends GameController
{
  private mPlayerInitialIndexMap:Map<string, number> = new Map();
  constructor()
  {
    super();
    this.setPlayersInitialIndex();
    this.setInitialState();
  }

  public addPlay(play: any)
  {
    if (typeof play !== "number")
    {
      throw "KalahController::addPlay: invalid argument type";
    }
    const newPlay = this.getCurrentGameState().getLegalPlay(play);
    this.addPlayByGameState(newPlay);
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

  private setInitialState(): void
  {
    const initialState = Array(14);
    initialState.fill(4, 1, 7); // initial seeds of player1
    initialState.fill(4, 8, 14); // initial seeds of player2
    initialState[0] = 0;  // player1 store
    initialState[7] = 0; // player2 store

    const opponentId = this.mStartingPlayerId === this.mPlayers[0].getId() ? this.mPlayers[1].getId() : this.mPlayers[0].getId();
    const oppnentInitialIndex = this.getPlayerInitialIndex(opponentId);
    const initialGameState = GameStateFactory.CreateKalahStateInstance(initialState, this.mStartingPlayerId, this.getPlayerInitialIndex(this.mStartingPlayerId), opponentId, oppnentInitialIndex);
    this.mStatesHistory.push(initialGameState);
  }
}