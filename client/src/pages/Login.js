import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', formData);
      const { token, usuario } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="login-overlay"></div>
        <div className="login-text">
          <h1 className="brand-title">GISA</h1>
          <h2>Tu sistema de ventas inteligente</h2>
          <p>Administra tus productos, clientes y ventas de tu botica con facilidad y rapidez.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card animate__animated animate__fadeInUp">
          {/* Logo agregado aquí */}
          <div className="text-center mb-4">
            <img
              src="/images/logo.png"
              alt="Logo GISA"
              className="login-logo"
            />
          </div>

          <h3 className="text-center mb-3">Iniciar Sesión</h3>
          <p className="text-center text-muted mb-4">Bienvenido al sistema de gestión GISA</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                required
              />
            </div>
            <div className="form-group mb-4">
              <label>Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-login w-100"
              disabled={loading}
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default Login;
