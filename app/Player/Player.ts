import generateUUID from "@/app/utils/UUIDGenerator";
import { PlayerTypeEnum } from "@/app/enums/PlayerTypeEnum";

export default class Player
{
  private mId = "";
  private mName = "";
  private mPlayerType: PlayerTypeEnum;
  private mIsStartingPlayer: boolean = false;

  constructor(playerType: PlayerTypeEnum, name: string, isStartingPlayer: boolean)
  {
    this.mId = generateUUID();
    this.mPlayerType = playerType;
    this.mName = name;
    this.mIsStartingPlayer = isStartingPlayer;
  }

  public getId(): string
  {
    return this.mId;
  }

  public getName(): string
  {
    return this.mName;
  }

  public getType(): PlayerTypeEnum
  {
    return this.mPlayerType;
  }

  public isStartingPlayer(): boolean
  {
    return this.mIsStartingPlayer;
  }
}