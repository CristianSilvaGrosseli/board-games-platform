export enum GameNameEnum
{
  TicTacToe,
  Kalah,
}

export class GameNameEnumMap
{
  private static mStringToEnumMap: Map<string, GameNameEnum> = new Map([
    ["tictactoe", GameNameEnum.TicTacToe],
    ["kalah", GameNameEnum.Kalah]
  ]);

  public static stringToEnum(input: string): GameNameEnum
  {
    const mappedEnum = this.mStringToEnumMap.get(input.toLowerCase());
    if (mappedEnum === undefined)
    {
      throw `GameNameEnumMap:stringToEnum: game '${input}' not recognized`;
    }
    return mappedEnum;
  }
}