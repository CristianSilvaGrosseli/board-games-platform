export enum IANameEnum
{
  Minimax,
  MCTS,
}

export class IANameEnumMap
{
  private static mStringToEnumMap: Map<string, IANameEnum> = new Map([
    ["minimax", IANameEnum.Minimax],
    ["mcts", IANameEnum.MCTS]
  ]);

  public static stringToEnum(input: string): IANameEnum
  {
    const mappedEnum = this.mStringToEnumMap.get(input.toLowerCase());
    if (mappedEnum === undefined)
    {
      throw `IANameEnumMap:stringToEnum: model '${input}' not recognized`;
    }
    return mappedEnum;
  }
}