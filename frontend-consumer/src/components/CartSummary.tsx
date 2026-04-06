interface CartSummaryProps {
  itemCount: number;
  onCreateOrder: () => void;
}

export function CartSummary({ itemCount, onCreateOrder }: CartSummaryProps) {
  return (
    <div className="cart-summary">
      <h3>Carrito ({itemCount} productos)</h3>
      <button onClick={onCreateOrder} className="btn-primary">
        Crear orden
      </button>
    </div>
  );
}
