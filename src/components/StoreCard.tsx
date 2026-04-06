interface StoreCardProps {
  store: any;
  isSelected: boolean;
  onClick: () => void;
}

export function StoreCard({ store, isSelected, onClick }: StoreCardProps) {
  return (
    <div
      className={`store-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <h3>{store.name}</h3>
      <p>{store.is_open ? 'Abierto' : 'Cerrado'}</p>
    </div>
  );
}
