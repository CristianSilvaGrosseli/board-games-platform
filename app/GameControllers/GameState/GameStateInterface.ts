export default abstract class GameState
{
    protected mPlayerId: string = "";
    protected mOpponentPlayerId: string = "";
    protected mBoardState: string[] = [];

    constructor(boardState: string[], playerId: string, opponentPlayerId: string)
    {
        if (boardState.length === 0)
        {
            throw "invalid game board state";
        }
        this.mBoardState = boardState.slice();
        this.mPlayerId = playerId;
        this.mOpponentPlayerId = opponentPlayerId;
        //console.log(`game state playerid: ${this.mPlayerId}`);
    }

    getPlayerId(): string
    {
        return this.mPlayerId;
    }

    getBoardState(): string[]
    {
        return this.mBoardState.slice();
    }

    public getLegalPlay(play: any): GameState
    {
        throw "must implement overload method";
    }

    getLegalPlays(): GameState[]
    {
        throw "must implement overload method";
    }

    hasCandidateToLegalPlay(): boolean
    {
        throw "must implement overload method";
    }

    isTerminal(): boolean
    {
        throw "must implement overload method";
    }

    getWinnerPlayerId(): string
    {
        throw "must implement overload method";
    }
}