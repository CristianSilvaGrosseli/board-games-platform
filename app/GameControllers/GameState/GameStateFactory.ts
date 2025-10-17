import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import TicTacToeState from "@/app/GameControllers/GameState/TicTacToeState";

export default class GameStateFactory
{
  static CreateTicTacToeStateInstance(boardState: string[], playerId: string, symbol: string, opponentPlayerId: string): GameState
  {
    return new TicTacToeState(boardState, playerId, symbol, opponentPlayerId);
  }
}