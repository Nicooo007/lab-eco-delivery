import { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { authService } from '../services/auth';
import { Header } from '../components/Header';
import { AvailableOrderCard } from '../components/AvailableOrderCard';
import { AcceptedOrderCard } from '../components/AcceptedOrderCard';

export function DashboardPage() {
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [tab, setTab] = useState<'available' | 'accepted'>('available');
  const [loading, setLoading] = useState(false);

  console.log(availableOrders)

  useEffect(() => {
    loadOrders();
  }, [tab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      if (tab === 'available') {
        const response = await apiClient.getAvailableOrders();
        setAvailableOrders(response.data);
      } else {
        const response = await apiClient.getMyDeliveries();
        setMyOrders(response.data);
      }
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      alert('Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setLoading(true);
      await apiClient.acceptOrder(orderId);
      alert('Orden aceptada');
      await loadOrders();
    } catch (error: any) {
      alert('Error: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      setLoading(true);
      await apiClient.rejectOrder(orderId);
      alert('Orden rechazada');
      await loadOrders();
    } catch (error: any) {
      alert('Error: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authService.isAuthenticated()) {
    return <div>No autorizado</div>;
  }

  return (
    <div className="dashboard-container">
      <Header />

      <div className="tabs">
        <button
          className={`tab ${tab === 'available' ? 'active' : ''}`}
          onClick={() => setTab('available')}
        >
          Órdenes disponibles ({availableOrders.length})
        </button>
        <button
          className={`tab ${tab === 'accepted' ? 'active' : ''}`}
          onClick={() => setTab('accepted')}
        >
          Mis entregas ({myOrders.length})
        </button>
      </div>

      <div className="content">
        {loading ? (
          <p>Cargando...</p>
        ) : tab === 'available' ? (
          <div className="orders-grid">
            {availableOrders.length === 0 ? (
              <p>No hay órdenes disponibles</p>
            ) : (
              availableOrders.map((order) => (
                <AvailableOrderCard
                  key={order.id}
                  order={order}
                  onAccept={() => handleAcceptOrder(order.id)}
                  onReject={() => handleRejectOrder(order.id)}
                />
              ))
            )}
          </div>
        ) : (
          <div className="orders-grid">
            {myOrders.length === 0 ? (
              <p>No tienes entregas aceptadas</p>
            ) : (
              myOrders.map((order) => (
                <AcceptedOrderCard key={order.id} order={order} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
