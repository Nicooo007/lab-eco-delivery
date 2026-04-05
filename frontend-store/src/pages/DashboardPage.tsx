import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { authService } from '../services/auth';
import { Header } from '../components/Header';
import { ProductItem } from '../components/ProductItem';
import { OrderItem } from '../components/OrderItem';
import { AddProductForm } from '../components/AddProductForm';
import '../styles/dashboard.css';

export function DashboardPage() {
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const storeResponse = await apiClient.getMyStore();
      const store = storeResponse.data;
      setStore(store);

      const [productsResponse, ordersResponse] = await Promise.all([
        apiClient.getMyProducts(store.id),
        apiClient.getStoreOrders(store.id),
      ]);

      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const toggleStoreStatus = async () => {
    if (!store) return;
    try {
      setLoading(true);
      const response = await apiClient.updateStoreStatus(store.id, !store.is_open);
      setStore(response.data);
    } catch (error: any) {
      alert('Error al actualizar estado: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    try {
      setLoading(true);
      const price = parseFloat(productPrice);
      if (isNaN(price)) {
        alert('Precio inválido');
        return;
      }

      await apiClient.createProduct(store.id, productName, price);
      setProductName('');
      setProductPrice('');
      setShowAddProduct(false);
      await loadData();
    } catch (error: any) {
      alert('Error al crear producto: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authService.isAuthenticated()) {
    return <div>No autorizado</div>;
  }

  if (loading && !store) {
    return <div>Cargando...</div>;
  }

  if (!store) {
    return <div>Error cargando tienda</div>;
  }

  return (
    <div className="dashboard-container">
      <Header title={store.name} />


      <div className="content">
        <div className="sidebar">
          <button
          onClick={toggleStoreStatus}
          className={`status-btn ${store.is_open ? 'open' : 'closed'}`}
        >
          {store.is_open ? 'Abierto' : 'Cerrado'}
        </button>
          <div className="nav-item">Productos ({products.length})</div>
          <div className="nav-item">Órdenes ({orders.length})</div>
        </div>

        <div className="main">
          <section className="section">
            <div className="section-header">
              <h2>Productos</h2>
              <button onClick={() => setShowAddProduct(!showAddProduct)} className="btn-primary">
                + Agregar producto
              </button>
            </div>

            {showAddProduct && (
              <AddProductForm
                productName={productName}
                productPrice={productPrice}
                onNameChange={setProductName}
                onPriceChange={setProductPrice}
                onSubmit={handleAddProduct}
                onCancel={() => setShowAddProduct(false)}
              />
            )}

            {products.length === 0 ? (
              <p>No hay productos</p>
            ) : (
              <div className="products-list">
                {products.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Órdenes */}
          <section className="section">
            <h2>Órdenes de tu tienda</h2>
            {orders.length === 0 ? (
              <p>No hay órdenes</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
