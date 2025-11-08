import { IANameEnumMap } from "@/app/enums/IANameEnum";
import { PlayerTypeEnum } from "@/app/enums/PlayerTypeEnum";
import GameControllerFactory from "@/app/GameControllers/GameControllerFactory";
import IAFactory from "@/app/IA/IAFactory";
import Player from "@/app/Player/Player";
import TasksConfigurations, { MCTSConfiguration, MinimaxConfiguration } from "@/app/interfaces/TaskInterface";
import HeuristicMap from "@/app/Heuristics/HeuristicMap";

export class IAvsIA
{
  public static run(config: TasksConfigurations): void
  {
    config.tasks.forEach(task => {
      let executionRound: number = task.task_execution_number;
      while (executionRound > 0)
      {
        const player1_name = task.player1.name || task.player1.ia_model_configuration.name;
        const player2_name = task.player2.name || task.player2.ia_model_configuration.name;
        const player1 = new Player(PlayerTypeEnum.IA, player1_name, task.starting_player === "player1");
        const player2 = new Player(PlayerTypeEnum.IA, player2_name, task.starting_player === "player2");

        let gameController;
        const choosedGame: string = task.game;
        if (choosedGame.toLocaleLowerCase() === "tictactoe")
        {
          gameController = GameControllerFactory.CreateTicTacToeControllerInstance(player1, player2);
        }
        else
        {
          gameController = GameControllerFactory.CreateKalahControllerInstance(player1, player2);
        }

        while (!gameController.isGameOver())
        {
          let taskPlayer = task.player1;
          if (gameController.getCurrentTurnPlayer().getId() === player2.getId())
          {
            taskPlayer = task.player2;
          }

          const iaNameEnum = IANameEnumMap.stringToEnum(taskPlayer.ia_model_configuration.name);
          const ia = IAFactory.CreateInstance(iaNameEnum, gameController);

          let heuristic;
          if (taskPlayer.ia_model_configuration.name === "minimax")
          {
            const heuristic_name = this.getMinimaxConfig(config, task.player1.ia_model_configuration.id).heuristic;
            heuristic = HeuristicMap.stringToEnum(heuristic_name);
          }

          const bestPlay = ia.getBestAction(heuristic);
          gameController.addPlay(bestPlay);
        }
        const winnerName = gameController.getWinnerName();
        console.log(`winner player: ${winnerName}`);
        executionRound--;
      }
    });
  }

  private static getMinimaxConfig(configs: TasksConfigurations, model_id: string): MinimaxConfiguration
  {
    const minimax = configs.models_configurations.minimax.find(model => model.id === model_id);
    if (minimax === undefined)
    {
      throw "";
    }
    return minimax;
  }

  private static getMCTSConfig(configs: TasksConfigurations, model_id: string): MCTSConfiguration
  {
    const mcts = configs.models_configurations.mcts.find(model => model.id === model_id);
    if (mcts === undefined)
    {
      throw "";
    }
    return mcts;
  }
}