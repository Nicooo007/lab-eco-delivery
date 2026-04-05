interface OrderItemProps {
  order: any;
}

export function OrderItem({ order }: OrderItemProps) {
  return (
    <div className="order-item">
      <div>
        <strong>Orden #{order.id.slice(0, 8)}</strong>
        <p>Estado: {order.status}</p>
        <p>Productos: {order.order_items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0}</p>
      </div>
    </div>
  );
}
