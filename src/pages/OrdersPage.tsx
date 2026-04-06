import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { authService } from '../services/auth';
import { Header } from '../components/Header';
import { OrderCard } from '../components/OrderCard';
import '../styles/orders.css';

export function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      alert('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  if (!authService.isAuthenticated()) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="orders-container">
      <Header />

      <div className="content">
        {loading ? (
          <p>Cargando...</p>
        ) : orders.length === 0 ? (
          <p>No tienes órdenes aún</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
