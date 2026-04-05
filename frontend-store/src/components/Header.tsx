import { authService } from '../services/auth';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="header-actions">
        <button onClick={() => { authService.logout(); window.location.href = '/login'; }}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
