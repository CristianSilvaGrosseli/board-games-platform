import './styles.css';
import GameController from '@/app/GameControllers/GameControllerInterface';
import Store from "@/app/components/mancala/store/component";
import House from "@/app/components/mancala/house/component";

export default function KalahBoard({
  gameController,
  onPlay
}:
{
  gameController: GameController,
  onPlay: (play: any) => void
})
{
  const board = gameController.getCurrentBoardState().map(s => Number(s));

  return (
    <>
      <div className="kalah-board">
        <div className="store-wrapper">
          <Store index={0} seedsQuantity={board[0]} key={`house-${0}`} />
        </div>
        <div className="houses-wrapper">
          <div className="side-houses-wrapper top-side">
            <House index={8} seedsQuantity={board[8]} onClick={onPlay} key={`house-${8}`} />
            <House index={9} seedsQuantity={board[9]} onClick={onPlay} key={`house-${9}`} />
            <House index={10} seedsQuantity={board[10]} onClick={onPlay} key={`house-${10}`} />
            <House index={11} seedsQuantity={board[11]} onClick={onPlay} key={`house-${11}`} />
            <House index={12} seedsQuantity={board[12]} onClick={onPlay} key={`house-${12}`} />
            <House index={13} seedsQuantity={board[13]} onClick={onPlay} key={`house-${13}`} />
          </div>
          <div className="side-houses-wrapper">
            <House index={1} seedsQuantity={board[1]} onClick={onPlay} key={`house-${1}`} />
            <House index={2} seedsQuantity={board[2]} onClick={onPlay} key={`house-${2}`} />
            <House index={3} seedsQuantity={board[3]} onClick={onPlay} key={`house-${3}`} />
            <House index={4} seedsQuantity={board[4]} onClick={onPlay} key={`house-${4}`} />
            <House index={5} seedsQuantity={board[5]} onClick={onPlay} key={`house-${5}`} />
            <House index={6} seedsQuantity={board[6]} onClick={onPlay} key={`house-${6}`} />
          </div>
        </div>
        <div className="store-wrapper">
          <Store index={7} seedsQuantity={board[7]} key={`house-${13}`} />
        </div>
      </div>
    </>
  );
}