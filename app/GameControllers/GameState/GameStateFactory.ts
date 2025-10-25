import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import TicTacToeState from "@/app/GameControllers/GameState/TicTacToeState";
import KalahState from "@/app/GameControllers/GameState/KalahState";

export default class GameStateFactory
{
  static CreateTicTacToeStateInstance(boardState: string[], playerId: string, symbol: string, opponentPlayerId: string): GameState
  {
    return new TicTacToeState(boardState, playerId, symbol, opponentPlayerId);
  }

  static CreateKalahStateInstance(boardState: string[], playerId: string, playerSideInitialIndex: number, opponentPlayerId: string, opponentSideInitialIndex: number)
  {
    return new KalahState(boardState, playerId, playerSideInitialIndex, opponentPlayerId, opponentSideInitialIndex);
  }
}