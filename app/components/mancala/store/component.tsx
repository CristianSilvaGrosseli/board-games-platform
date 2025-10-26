import './styles.css'

export default function Store({
  index,
  seedsQuantity
}: {
  index: number,
  seedsQuantity: number
})
{
  return (
    <div
      key={`store-${index}`}
      className="store"
    >
      {seedsQuantity}
    </div>
  );
}