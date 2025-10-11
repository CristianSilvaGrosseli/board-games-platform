import GameState from "@/app/BoardGameControllers/GameState/GameStateInterface";

export default class TicTacToeState extends GameState
{
  private mSymbol = "";
  private mOpponentPlayerId = "";

  constructor(boardState: string[], playerId: string, symbol: string, opponentplayerId: string)
  {
    super(boardState, playerId)
    this.mSymbol = symbol;
    this.mOpponentPlayerId = opponentplayerId;
  }

  public getLegalPlays(): GameState[]
  {
    //console.log(`GameState: ${this.mBoardState.toString()}: getLegalPlays`);
    if (this.isTerminal())
    {
      //console.log(`GameState: ${this.mBoardState.toString()}: getLegalPlays: isTerminal`);
      return [];
    }
    
    const r = this.mBoardState.reduce((ret: GameState[], c, i) => {
      if (!c)
      {
        const appliedBoard = this.mBoardState.slice();
        appliedBoard[i] = this.mSymbol;
        const legalState: GameState = new TicTacToeState(appliedBoard, this.mOpponentPlayerId, this.mSymbol === "X" ? "O" : "X", this.mPlayerId);
        ret.push(legalState);
      }
      return ret;
    }, []);
    //console.log(`GameState: ${this.mBoardState.toString()}: getLegalPlays: size: ${r.length}`);
    return r;
  }

  public hasCandidateToLegalPlay(): boolean
  {
    //console.log(`GameState: hasCandidateToLegalPlay: ${this.mBoardState.some(c => !c)}`);
    return this.mBoardState.some(c => !c);
  }

  public isTerminal()
  {
    const hasWinner = this.getWinnerPlayerId() !== null;
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