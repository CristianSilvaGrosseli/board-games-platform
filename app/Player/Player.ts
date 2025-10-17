import generateUUID from "@/app/utils/UUIDGenerator";

export default class Player
{
  private mId = "";
  private mName = "";

  constructor(name: string)
  {
    this.mId = generateUUID();
    this.mName = name;
  }

  public getId(): string
  {
    return this.mId;
  }

  public getName(): string
  {
    return this.mName;
  }
}