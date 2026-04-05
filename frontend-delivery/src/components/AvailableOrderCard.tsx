interface AvailableOrderCardProps {
  order: any;
  onAccept: () => void;
  onReject: () => void;
}

export function AvailableOrderCard({ order, onAccept, onReject }: AvailableOrderCardProps) {
  return (
    <div className="order-card available">
      <div className="order-header">
        <h3>Orden #{order.id.slice(0, 8)}</h3>
        <span className="status-pending">Pendiente</span>
      </div>
      <p><strong>Tienda:</strong> {order.stores?.name}</p>
      <p><strong>Productos:</strong> {order.order_items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0}</p>
      <div className="actions">
        <button onClick={onAccept} className="btn-accept">
          Aceptar
        </button>
        <button onClick={onReject} className="btn-reject">
          Rechazar
        </button>
      </div>
    </div>
  );
}
