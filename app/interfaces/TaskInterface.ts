export default interface TasksConfigurations
{
  models_configurations: ModelsConfigurations
  tasks: TaskConfiguration[]
}

interface ModelsConfigurations
{
  minimax: MinimaxConfiguration[],
  mcts: MCTSConfiguration[]
}

export interface MinimaxConfiguration
{
  id: string,
  max_depth:
  {
    enable: boolean,
    depth: number
  },
  enable_alpha_beta_prunning: boolean,
  heuristic: string
}

export interface MCTSConfiguration
{
  id: string,
  max_duration_milliseconds: number
}

interface TaskPlayer
{
  name?: string,
  ia_model_configuration:
  {
    name: string,
    id: string
  }
}

interface TaskConfiguration
{
  game: string,
  player1: TaskPlayer,
  player2: TaskPlayer,
  starting_player: string,
  task_execution_number: number
}