"use client"

import BoardWrapper from "@/app/components/board-wrapper/component";
import { GameNameEnum } from "./enums/GameNameEnum";

export default function Home()
{
  return (
    <BoardWrapper choosedGame={GameNameEnum.TicTacToe} />
  );
}
