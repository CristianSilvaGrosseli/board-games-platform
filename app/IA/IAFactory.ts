import { IANameEnum } from "@/app/enums/IANameEnum";
import GameController from "@/app/GameControllers/GameControllerInterface";
import IAInterface from "@/app/IA/IAInterface";
import { MCTS } from "@/app/IA/MCTS/MCTS";
import Minimax from "@/app/IA/Minimax/Minimax";

export default class IAFactory
{
  static CreateInstance(iaNameEnum: IANameEnum, gameController: GameController): IAInterface
  {
    if (iaNameEnum === IANameEnum.Minimax)
    {
      return new Minimax(gameController);
    }
    if (iaNameEnum === IANameEnum.MCTS)
    {
      return new MCTS(gameController);
    }
    throw `invalid IANameEnum: ${iaNameEnum}`;
  }
}