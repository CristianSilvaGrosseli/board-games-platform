import GameState from "@/app/GameControllers/GameState/GameStateInterface";
import GameStateFactory from "@/app/GameControllers/GameState/GameStateFactory";

export default class KalahState extends GameState
{
  private mPlayerSideInitialIndex: number = -1;
  private mPlayerStoreIndex: number = -1;
  private mOpponentStoreIndex: number = -1;
  private mOpponentSideInitialIndex: number = -1;

  constructor(boardState: string[], playerId: string, playerSideInitialIndex: number, opponentPlayerId: string, opponentSideInitialIndex: number)
  {
    super(boardState, playerId, opponentPlayerId);
    this.mPlayerSideInitialIndex = playerSideInitialIndex;
    this.mOpponentSideInitialIndex = opponentSideInitialIndex;
    this.mPlayerStoreIndex = this.mPlayerSideInitialIndex === 1 ? 7 : 0;
    this.mOpponentStoreIndex = this.mPlayerStoreIndex === 7 ? 0 : 7;
  }

  public getBoardState(): string[]
  {
    return this.mBoardState.slice();
  }

  public getLegalPlay(play: any): GameState
  {
    if (typeof play !== "number")
    {
      throw "KalahState::getLegalPlay: invalid argument type";
    }

    const playIndex = Number(play);
    if (!this.isPlayerHouseIndex(playIndex))
    {
      throw `KalahState:getLegalPlay: ilegal play: invalid player house (${playIndex})`;
    }

    const playSeedsQuantity = Number(this.mBoardState[playIndex]);
    if (playSeedsQuantity === 0)
    {
      throw "KalahState:getLegalPlay: ilegal play: empty house";
    }

    const appliedBoard = this.applyPlay(playIndex);
    const hasAdditionalTurn = this.checkHasAdditionalTurn(playIndex, Number(playSeedsQuantity));
    const nextPlayer = hasAdditionalTurn ? this.mPlayerId : this.mOpponentPlayerId;
    const nextPlayerInitialIndex = hasAdditionalTurn ? this.mPlayerSideInitialIndex : this.mOpponentSideInitialIndex;
    const nextOpponent = nextPlayer === this.mPlayerId ? this.mOpponentPlayerId : this.mPlayerId;
    const nextOpponentInitialIndex = nextPlayer === this.mPlayerId ? this.mOpponentSideInitialIndex : this.mPlayerSideInitialIndex;
    return GameStateFactory.CreateKalahStateInstance(appliedBoard, nextPlayer, nextPlayerInitialIndex, nextOpponent, nextOpponentInitialIndex);
  }

  public getLegalPlays(): GameState[]
  {
    if (this.isTerminal())
    {
      return [];
    }

    return this.mBoardState.slice().reduce((ret: GameState[], s, i) => {
      try
      {
        ret.push(this.getLegalPlay(i));
      }
      catch{}
      return ret;
    }, []);
  }
  
  public hasCandidateToLegalPlay(): boolean
  {
    return this.mBoardState.some((seedsQuantity, i) => {
      if (this.isPlayerHouseIndex(i))
      {
        return Number(seedsQuantity) > 0;
      }
      return false;
    });
  }

  public isTerminal(): boolean
  {
    const hasWinner = this.getWinnerPlayerId().length > 0;
    return hasWinner || !this.hasCandidateToLegalPlay();
  }

  public getWinnerPlayerId(): string
  {
    const playerStoreSeedsQuantity = Number(this.mBoardState[this.mPlayerStoreIndex]);
    const opponentStoreSeedsQuantity = Number(this.mBoardState[this.mOpponentStoreIndex]);

    if (this.isPlayerHousesWithoutSeeds() || this.isOpponentHousesWithoutSeeds())
    {
      if (playerStoreSeedsQuantity > opponentStoreSeedsQuantity)
      {
        return this.mPlayerId;
      }
      if (opponentStoreSeedsQuantity > playerStoreSeedsQuantity)
      {
        return this.mOpponentPlayerId;
      }
      return "";
    }

    const allHouses = this.mBoardState.filter((s, i) => this.isHouseIndex(i));
    const totalSeedsInAllHouses = allHouses.reduce((t: number, s) =>  t + Number(s), 0);
    if (playerStoreSeedsQuantity > (opponentStoreSeedsQuantity + totalSeedsInAllHouses))
    {
      return this.mPlayerId;
    }
    if (opponentStoreSeedsQuantity > (playerStoreSeedsQuantity + totalSeedsInAllHouses))
    {
      return this.mOpponentPlayerId;
    }

    return "";
  }

  public getPlayerStoreSeedsQuantity(): number
  {
    return Number(this.mBoardState[this.mPlayerStoreIndex]);
  }

  public getOpponentStoreSeedsQuantity(): number
  {
    return Number(this.mBoardState[this.mOpponentStoreIndex]);
  }

  private applyPlay(houseIndex: number): string[]
  {
    const boardCopy = this.mBoardState.slice();
    const houseSeedsQuantity = Number(boardCopy[houseIndex]);
    boardCopy[houseIndex] = "0";
    let nextHouseIndex = houseIndex;
    for (let i = 0; i < houseSeedsQuantity; i++)
    {
      nextHouseIndex = this.getNextValidIndexToSeed(nextHouseIndex);
      const isLastSeed = i === (houseSeedsQuantity - 1);
      if (isLastSeed && this.isPossibleCapture(nextHouseIndex))
      {
        const oppositeHouseIndex = boardCopy.length - nextHouseIndex;
        const oppositeHouseSeedsQuantity = Number(boardCopy[oppositeHouseIndex]);
        const newPlayerStoreSeedsQuantity = Number(boardCopy[this.mPlayerStoreIndex]) + oppositeHouseSeedsQuantity + 1;
        boardCopy[this.mPlayerStoreIndex] = String(newPlayerStoreSeedsQuantity);
        boardCopy[nextHouseIndex] = "0";
        boardCopy[oppositeHouseIndex] = "0";
      }
      else
      {
        const currentHouseSeedQuantity = Number(boardCopy[nextHouseIndex])
        boardCopy[nextHouseIndex] = String(currentHouseSeedQuantity + 1);
      }
    }

    if (this.isPlayerHousesWithoutSeeds(boardCopy))
    {
      const totalHousesSeeds = this.getOpponentHouses(boardCopy).reduce((t: number, s) =>  t + Number(s), 0);
      const newOpponentStoreSeedsQuantity = Number(boardCopy[this.mOpponentStoreIndex]) + totalHousesSeeds;
      boardCopy[this.mOpponentStoreIndex] = String(newOpponentStoreSeedsQuantity);
      boardCopy.forEach((h, i) => {if (this.isHouseIndex(i)) boardCopy[i]="0";});
    }
    else if (this.isOpponentHousesWithoutSeeds(boardCopy))
    {
      const totalHousesSeeds = this.getPlayerHouses(boardCopy).reduce((t: number, s) =>  t + Number(s), 0);
      const newPlayerStoreSeedsQuantity = Number(boardCopy[this.mPlayerStoreIndex]) + totalHousesSeeds;
      boardCopy[this.mPlayerStoreIndex] = String(newPlayerStoreSeedsQuantity);
      boardCopy.forEach((h, i) => {if (this.isHouseIndex(i)) boardCopy[i]="0";});
    }

    return boardCopy;
  }

  private isHouseIndex(index: number): boolean
  {
    return (
      (index >= this.mPlayerSideInitialIndex && index < this.mPlayerSideInitialIndex + 6) ||
      (index >= this.mOpponentSideInitialIndex && index < this.mOpponentSideInitialIndex + 6)
    );
  }

  private isPlayerHouseIndex(index: number): boolean
  {
    return index >= this.mPlayerSideInitialIndex && index < (this.mPlayerSideInitialIndex + 6);
  }

  private isValidIndexToSeed(index: number): boolean
  {
    return index < this.mBoardState.length && index !== this.mOpponentStoreIndex;
  }

  private isPlayerHousesWithoutSeeds(boardCopy?: string[]): boolean
  {
    return this.getPlayerHouses(boardCopy).every(s => Number(s) === 0);
  }

  private isOpponentHousesWithoutSeeds(boardCopy?: string[]): boolean
  {
    return this.getOpponentHouses(boardCopy).every(s => Number(s) === 0);
  }

  private getPlayerHouses(boardCopy?: string[]): string[]
  {
    const board = boardCopy || this.mBoardState;
    return board.filter((s, i) => this.isPlayerHouseIndex(i));
  }

  private getOpponentHouses(boardCopy?: string[]): string[]
  {
    const board = boardCopy || this.mBoardState;
    return board.filter((s, i) => !this.isPlayerHouseIndex(i) && i !== this.mPlayerStoreIndex && i !== this.mOpponentStoreIndex);
  }

  private getNextValidIndexToSeed(index: number): number
  {
    let nextIndex = index + 1;
    while (!this.isValidIndexToSeed(nextIndex))
    {
      const isIndexOutOfBoardRange = nextIndex >= this.mBoardState.length;
      if (isIndexOutOfBoardRange)
      {
        nextIndex = nextIndex - this.mBoardState.length;
        continue;
      }
      nextIndex++;
    }
    return nextIndex;
  }

  private isPossibleCapture(index: number): boolean
  {
    const isPlayerHouse = this.isPlayerHouseIndex(index);
    const isPlayerHouseEmpty = Number(this.mBoardState[index]) === 0;
    if (isPlayerHouse && isPlayerHouseEmpty)
    {
      const oppositeHouseIndex = this.mBoardState.length - index;
      const isOppositeHouseSown = Number(this.mBoardState[oppositeHouseIndex]) > 0;
      return isOppositeHouseSown;
    }
    return false;
  }

  private checkHasAdditionalTurn(playedHouseIndex: number, seedsQuantity: number): boolean
  {
    let lastSownHouseIndex = (playedHouseIndex + Number(seedsQuantity)) % this.mBoardState.length;
    if (seedsQuantity >= this.mBoardState.length)
    {
      const adjustTerm = Math.ceil(Number(seedsQuantity) / this.mBoardState.length);
      lastSownHouseIndex += adjustTerm;
    }
    return lastSownHouseIndex === this.mPlayerStoreIndex;
  }
}