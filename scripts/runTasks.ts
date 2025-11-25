import fs from "fs";
import path from "path";
import { IAvsIA } from "@/app/tasks/IAvsIA";
import { TasksConfigurations } from "@/app/interfaces/TaskInterface";

async function main()
{
  const configPath = path.resolve("tasksConfig.json");
  const config: TasksConfigurations = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  IAvsIA.run(config);
  process.exit(0);
}


main().catch((err) => {
  console.error("Erro ao executar tarefas:", err);
  process.exit(1);
});
