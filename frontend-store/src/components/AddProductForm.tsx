interface AddProductFormProps {
  productName: string;
  productPrice: string;
  onNameChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AddProductForm({
  productName,
  productPrice,
  onNameChange,
  onPriceChange,
  onSubmit,
  onCancel,
}: AddProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="add-product-form">
      <input
        type="text"
        placeholder="Nombre del producto"
        value={productName}
        onChange={(e) => onNameChange(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio"
        value={productPrice}
        onChange={(e) => onPriceChange(e.target.value)}
        step="0.01"
        required
      />
      <button type="submit">Crear</button>
      <button type="button" onClick={onCancel}>
        Cancelar
      </button>
    </form>
  );
}
