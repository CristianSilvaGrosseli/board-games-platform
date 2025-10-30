import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import TicTacToeState from "@/app/GameControllers/GameState/TicTacToeState";

export default function MinimaxHeuristic1(gameState: GameState)
{
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const squares = gameState.getBoardState();
  if ((gameState instanceof TicTacToeState) === false)
  {
    throw "MinimaxHeuristic1: gameState is not a TicTacToeState";
  }
  const ticTacToeState: TicTacToeState = (gameState as TicTacToeState);
  const playerSymbol = ticTacToeState.getPlayerSymbol();
  const opponentSymbol = ticTacToeState.getOpponentSymbol();  let heuristic = 0;
  for (let i = 0; i < lines.length; i++)
  {
    const [m, n, o] = lines[i];
    const triple = [squares[m], squares[n], squares[o]];

    const hasOpponentSymbol = triple.some(s => s === opponentSymbol);
    if (!hasOpponentSymbol)
    {
      heuristic += Math.pow(triple.reduce((r, s) => s === playerSymbol ? ++r : r, 0), 2);
    }
    const hasPlayerSymbol = triple.some(s => s === playerSymbol);
    if (!hasPlayerSymbol)
    {
      heuristic -= Math.pow(triple.reduce((r, s) => s === opponentSymbol ? ++r : r, 0), 2);
    }
  }

  return heuristic;
}