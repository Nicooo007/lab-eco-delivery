import { authService } from '../services/auth';

export function Header() {
  return (
    <header className="header">
      <h1>Rappi — Repartidor</h1>
      <button onClick={() => { authService.logout(); window.location.href = '/login'; }}>
        Cerrar sesión
      </button>
    </header>
  );
}
