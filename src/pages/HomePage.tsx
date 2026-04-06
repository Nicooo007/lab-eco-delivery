import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { authService } from '../services/auth';
import { Header } from '../components/Header';
import { StoreCard } from '../components/StoreCard';
import { ProductCard } from '../components/ProductCard';
import { CartSummary } from '../components/CartSummary';
import '../styles/home.css';

export function HomePage() {
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);

  console.log()

  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    if (selectedStore) {
      loadProducts(selectedStore.id);
    }
  }, [selectedStore]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getStores();
      setStores(response.data);
    } catch (error) {
      console.error('Error cargando tiendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (storeId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.getProductsByStore(storeId);
      setProducts(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (productId: string) => {
    const newCart = new Map(cart);
    newCart.set(productId, (newCart.get(productId) || 0) + 1);
    setCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = new Map(cart);
    const qty = newCart.get(productId) || 0;
    if (qty <= 1) {
      newCart.delete(productId);
    } else {
      newCart.set(productId, qty - 1);
    }
    setCart(newCart);
  };

  const createOrder = async () => {
    if (!selectedStore || cart.size === 0) return;

    try {
      const items = Array.from(cart.entries()).map(([productId, quantity]) => ({
        product_id: productId,
        quantity,
      }));

      const response = await apiClient.createOrder(selectedStore.id, items);
      alert('Orden creada exitosamente: ' + response.data.order.id);
      setCart(new Map());
      setSelectedStore(null);
    } catch (error: any) {
      alert('Error al crear orden: ' + error.response?.data?.message);
    }
  };

  if (!authService.isAuthenticated()) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="home-container">
      <Header />

      <div className="content">
        <div className="stores-list">
          <h2>Hola, {authService.getUser()?.user_metadata.name} ¿Que vamos a comer hoy?</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="stores-grid">
              {stores.filter((store) => store.is_open).map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  isSelected={selectedStore?.id === store.id}
                  onClick={() => setSelectedStore(store)}
                />
              ))}
            </div>
          )}
        </div>

        {selectedStore && (
          <div className="products-section">
            <h2>Productos de {selectedStore.name}</h2>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart.get(product.id) || 0}
                  onAdd={() => addToCart(product.id)}
                  onRemove={() => removeFromCart(product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {cart.size > 0 && (
          <CartSummary
            itemCount={cart.size}
            onCreateOrder={createOrder}
          />
        )}
      </div>
    </div>
  );
}
