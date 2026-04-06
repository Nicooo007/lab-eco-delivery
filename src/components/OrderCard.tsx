interface OrderCardProps {
  order: any;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Orden #{order.id.slice(0, 8)}</h3>
        <span className={`status ${order.status}`}>{order.status}</span>
      </div>
      <p>Tienda: {order.stores?.name || 'Tienda'}</p>
      <p>Productos: {order.order_items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0}</p>
      <p>Fecha: {new Date(order.created_at).toLocaleString()}</p>
    </div>
  );
}
