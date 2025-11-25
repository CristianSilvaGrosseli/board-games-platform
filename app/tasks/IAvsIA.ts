import { IANameEnumMap } from "@/app/enums/IANameEnum";
import { PlayerTypeEnum } from "@/app/enums/PlayerTypeEnum";
import GameControllerFactory from "@/app/GameControllers/GameControllerFactory";
import IAFactory from "@/app/IA/IAFactory";
import Player from "@/app/Player/Player";
import { MCTSConfiguration, MinimaxConfiguration, TasksConfigurations, TaskResume, TaskResult } from "@/app/interfaces/TaskInterface";
import HeuristicMap from "@/app/Heuristics/HeuristicMap";
import { Logger, ILogObj } from "tslog";
import { appendFileSync } from "fs";
import { GameNameEnum, GameNameEnumMap } from "../enums/GameNameEnum";

export class IAvsIA
{
  public static run(config: TasksConfigurations): void
  {
    const log: Logger<ILogObj> = new Logger();
    const date = new Date();
    const logFileName = `IAvsIA_result_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getTime()}.txt`;
    log.attachTransport((logObj) => {
      appendFileSync(logFileName, JSON.stringify(logObj) + "\n");
    });
    const allTasksResume: TaskResume[] = [];

    config.tasks.forEach(task => {
      let executionRound: number = task.task_execution_number;
      const taskResults: TaskResult[] = [];
      while (executionRound > 0)
      {
        const southPlayer = new Player(PlayerTypeEnum.IA, "southPlayer", task.starting_player === "southPlayer");
        const northPlayer = new Player(PlayerTypeEnum.IA, "northPlayer", task.starting_player === "northPlayer");

        const choosedGame: GameNameEnum = GameNameEnumMap.stringToEnum(task.game);
        const gameController = GameControllerFactory.CreateInstance(choosedGame, southPlayer, northPlayer);

        while (!gameController.isGameOver())
        {
          let taskPlayer = task.southPlayer;
          if (gameController.getCurrentTurnPlayer().getId() === northPlayer.getId())
          {
            taskPlayer = task.northPlayer;
          }

          const iaNameEnum = IANameEnumMap.stringToEnum(taskPlayer.ia_model_configuration.name);
          const ia = IAFactory.CreateInstance(iaNameEnum, gameController);

          let heuristic;
          if (taskPlayer.ia_model_configuration.name === "minimax")
          {
            const heuristic_name = this.getMinimaxConfig(config, task.southPlayer.ia_model_configuration.id).heuristic;
            heuristic = HeuristicMap.stringToEnum(heuristic_name);
          }

          const bestPlay = ia.getBestAction(heuristic);
          gameController.addPlay(bestPlay);
        }
        const winnerName = gameController.getWinnerName();
        
        taskResults.push({
          executionNumber: task.task_execution_number - executionRound + 1,
          winner: winnerName || "draw",
          turnsTaken: gameController.getTurnsTaken()
        });

        console.log(`winner player: ${winnerName}`);
        executionRound--;
      }
      allTasksResume.push({
        input: {
          configuration: task,
          parameters: {
            south: IAvsIA.getIAConfig(config, task.southPlayer.ia_model_configuration.id),
            north: IAvsIA.getIAConfig(config, task.northPlayer.ia_model_configuration.id)
          }
        },
        result: taskResults
      });
    });
    log.info(allTasksResume);
  }

  private static getIAConfig(configs: TasksConfigurations, model_id: string): MinimaxConfiguration | MCTSConfiguration
  {
    const config = configs.models_configurations.minimax.find(model => model.id === model_id);
    if (config === undefined)
    {
      throw "";
    }
    return config;
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