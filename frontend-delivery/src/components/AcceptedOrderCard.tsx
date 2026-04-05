interface AcceptedOrderCardProps {
  order: any;
}

export function AcceptedOrderCard({ order }: AcceptedOrderCardProps) {
  return (
    <div className="order-card accepted">
      <div className="order-header">
        <h3>Orden #{order.id.slice(0, 8)}</h3>
        <span className="status-accepted">Aceptada</span>
      </div>
      <p><strong>Tienda:</strong> {order.stores?.name}</p>
      <p><strong>Productos:</strong> {order.items?.length || 0}</p>
      <p><strong>Cliente:</strong> Usuario {order.user_id?.slice(0, 8)}</p>
      <p><strong>Fecha:</strong> {new Date(order.created_at).toLocaleString()}</p>
    </div>
  );
}
