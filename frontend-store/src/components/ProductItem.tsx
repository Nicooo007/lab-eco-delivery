interface ProductItemProps {
  product: any;
}

export function ProductItem({ product }: ProductItemProps) {
  return (
    <div className="product-item">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
