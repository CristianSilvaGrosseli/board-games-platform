import GameController from "@/app/GameControllers/GameControllerInterface";
import GameStateFactory from "@/app/GameControllers/GameState/GameStateFactory";

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
    const initialState = GameStateFactory.CreateTicTacToeStateInstance(initialBoard, this.mPlayers[0].getId(), "X", this.mPlayers[1].getId());
    this.mStatesHistory.push(initialState);
  }

  public addPlay(play: any): void
  {
    if (typeof play !== "number")
    {
      throw "TicTacToeController::addPlay: invalid argument type";
    }
    const newPlay = this.getCurrentGameState().getLegalPlay(play);
    this.addPlayByGameState(newPlay);
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