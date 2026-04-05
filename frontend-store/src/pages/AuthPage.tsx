import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import '../styles/auth.css';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await authService.login(email, password);
        navigate('/');
      } else {
        if (!storeName) {
          setError('Nombre de tienda es requerido');
          return;
        }
        await authService.register(email, password, storeName);
        await authService.login(email, password);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error en autenticación');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Rappi Admin</h1>
        <h3>Expande tu negocio con nosotros</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Nombre de Tienda</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
          )}

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-primary">
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Regístrate' : 'Ingresa'}
          </button>
        </p>
      </div>
    </div>
  );
}
