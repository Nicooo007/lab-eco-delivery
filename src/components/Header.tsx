import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header">
      <h1>Rappi</h1>
      <div className="header-actions">
        <button
          onClick={() => navigate('/')}
          className={location.pathname === '/' ? 'active' : ''}
        >
          Tiendas
        </button>
        <button
          onClick={() => navigate('/orders')}
          className={location.pathname === '/orders' ? 'active' : ''}
        >
          Mis órdenes
        </button>
        <button onClick={() => { authService.logout(); window.location.href = '/login'; }}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

