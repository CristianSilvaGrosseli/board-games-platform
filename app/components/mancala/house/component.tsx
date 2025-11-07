//import Seed from '@app/components/mancala/seed/component';
import './styles.css'


export default function House({
  index,
  seedsQuantity,
  onClick
}: {
  index: number,
  seedsQuantity: number,
  onClick: (houseIndex: number) => void
})
{

  return (
    <button
      className="house"
      onClick={() => onClick(index)}
    >
      {seedsQuantity}
    </button>
  );
}