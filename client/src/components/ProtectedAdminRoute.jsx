// src/components/ProtectedAdminRoute.jsx
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  if (usuario?.rol !== 'admin') {
    // Redirige a dashboard si no es admin
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;