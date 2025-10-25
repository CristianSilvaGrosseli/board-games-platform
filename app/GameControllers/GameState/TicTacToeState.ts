import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import GameStateFactory from "@/app/GameControllers/GameState/GameStateFactory";

export default class TicTacToeState extends GameState
{
  private mSymbol = "";

  constructor(boardState: string[], playerId: string, symbol: string, opponentplayerId: string)
  {
    super(boardState, playerId, opponentplayerId);
    this.mSymbol = symbol;
  }

  public getLegalPlay(play: any): GameState
  {
    if (typeof play !== "number")
    {
      throw "TicTacToe::getLegalPlay: invalid argument type";
    }
    const playIndex = Number(play);
    const isLegalPlay = this.mBoardState[playIndex] === "";
    if (!isLegalPlay)
    {
      throw "TicTacToe::getLegalPlay: ilegal move: move already played";
    }
    const appliedBoard = this.mBoardState.slice();
    appliedBoard[playIndex] = this.mSymbol;
    return GameStateFactory.CreateTicTacToeStateInstance(appliedBoard, this.mOpponentPlayerId, this.mSymbol === "X" ? "O" : "X", this.mPlayerId);
  }

  public getLegalPlays(): GameState[]
  {
    if (this.isTerminal())
    {
      return [];
    }

    return this.mBoardState.reduce((ret: GameState[], c, i) => {
      try
      {
        ret.push(this.getLegalPlay(i));
      } catch{}
      return ret;
    }, []);
  }

  public hasCandidateToLegalPlay(): boolean
  {
    //console.log(`GameState: hasCandidateToLegalPlay: ${this.mBoardState.some(c => !c)}`);
    return this.mBoardState.some(c => !c);
  }

  public isTerminal(): boolean
  {
    const hasWinner = this.getWinnerPlayerId().length > 0;
    return hasWinner || !this.hasCandidateToLegalPlay();
  }

  private getPlayerIdFromSymbol(symbol: string): string
  {
    return symbol === this.mSymbol ? this.mPlayerId : this.mOpponentPlayerId;
  }

  public getWinnerPlayerId(): string
  {
    const boardState = this.mBoardState.slice();
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++)
    {
      const [a, b, c] = lines[i];
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c])
      {
        return this.getPlayerIdFromSymbol(boardState[a]);
      }
    }
    return "";
  }
}