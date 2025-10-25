//import Seed from '@app/components/mancala/seed/component';
import './styles.css'
import Seed from '../seed/component';


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
  let seeds = [];
  for (let i = 0; i < seedsQuantity; i++)
  {
    seeds.push(<Seed key={`seed-${index}-${i}`} />);
  }
  return (
    <button
      className="house"
      onClick={() => onClick(index)}
    >
      {seedsQuantity}
    </button>
  );
}