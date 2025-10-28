import GameController from '@/app/GameControllers/GameControllerInterface';
import Square from '@/app/components/tic-tac-toe/square/component';
import './styles.css'

export default function TicTacToeBoard({
  gameController,
  onPlay
}: {
  gameController: GameController,
  onPlay: (play: any) => void
})
{
  const squares = gameController.getCurrentBoardState();
  return (
    <>
      <div className='board-row'>
        <Square value={squares[0]} onSquareClick={() => onPlay(0)} />
        <Square value={squares[1]} onSquareClick={() => onPlay(1)} />
        <Square value={squares[2]} onSquareClick={() => onPlay(2)} />
      </div>
      <div className='board-row'>
        <Square value={squares[3]} onSquareClick={() => onPlay(3)} />
        <Square value={squares[4]} onSquareClick={() => onPlay(4)} />
        <Square value={squares[5]} onSquareClick={() => onPlay(5)} />
      </div>
      <div className='board-row'>
        <Square value={squares[6]} onSquareClick={() => onPlay(6)} />
        <Square value={squares[7]} onSquareClick={() => onPlay(7)} />
        <Square value={squares[8]} onSquareClick={() => onPlay(8)} />
      </div>
    </>
  );
}