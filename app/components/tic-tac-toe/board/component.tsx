import Square from '../square/component';
import './styles.css'

export default function Board({
  xIsNext,
  squares,
  onPlay
}: {
  xIsNext: boolean,
  squares: string[],
  onPlay: (square: string[]) => void
})
{
  const winner = calculateWinner(squares);
  const status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O");

  const onClickHandler = (index: number) => {
    if (squares[index] || calculateWinner(squares))
    {
      return;
    }

    const newSquares = squares.slice();
    newSquares[index] = xIsNext ? "X" : "O";
    onPlay(newSquares)
  };

  return (
    <>
      <div className='status'>{status}</div>
      <div className='board-row'>
        <Square value={squares[0]} onSquareClick={() => onClickHandler(0)} />
        <Square value={squares[1]} onSquareClick={() => onClickHandler(1)} />
        <Square value={squares[2]} onSquareClick={() => onClickHandler(2)} />
      </div>
      <div className='board-row'>
        <Square value={squares[3]} onSquareClick={() => onClickHandler(3)} />
        <Square value={squares[4]} onSquareClick={() => onClickHandler(4)} />
        <Square value={squares[5]} onSquareClick={() => onClickHandler(5)} />
      </div>
      <div className='board-row'>
        <Square value={squares[6]} onSquareClick={() => onClickHandler(6)} />
        <Square value={squares[7]} onSquareClick={() => onClickHandler(7)} />
        <Square value={squares[8]} onSquareClick={() => onClickHandler(8)} />
      </div>
    </>
  );
}

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}