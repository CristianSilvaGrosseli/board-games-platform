import GameController from "@/app/GameControllers/GameControllerInterface";
import GameStateFactory from "@/app/GameControllers/GameState/GameStateFactory";
import Player from "@/app/Player/Player";

export default class TicTacToeController extends GameController
{
  constructor(player1: Player, player2: Player)
  {
    super(player1, player2);
    this.setInitialState();
  }

  protected setInitialState(): void
  {
    const initialBoard: string[] = Array(9).fill("");
    const { startingPlayerId, opponentPlayerId } = this.getInitialPlayersArrangement();
    const initialState = GameStateFactory.CreateTicTacToeStateInstance(initialBoard, startingPlayerId, "X", opponentPlayerId);
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
}