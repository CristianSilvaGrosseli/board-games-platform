export interface TasksConfigurations
{
  models_configurations: ModelsConfigurations
  tasks: TaskConfiguration[]
}

export interface TaskResume
{
  input: {
    configuration: TaskConfiguration
    parameters: {
      south: MinimaxConfiguration | MCTSConfiguration
      north: MinimaxConfiguration | MCTSConfiguration
    }
  },
  result: TaskResult[]
}

export interface TaskResult {
  executionNumber: number,
  winner: string,
  turnsTaken: number
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
  ia_model_configuration:
  {
    name: string,
    id: string
  }
}

interface TaskConfiguration
{
  game: string,
  southPlayer: TaskPlayer,
  northPlayer: TaskPlayer,
  starting_player: string,
  task_execution_number: number
}