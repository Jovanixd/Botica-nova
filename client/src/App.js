// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import FormProducto from './pages/FormProducto';
import NuevaVenta from './pages/NuevaVenta';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuario';
import Clientes from './pages/Clientes';
import Layout from './components/Layout';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

// Protege solo el acceso, no el layout
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con Layout + título */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout pageTitle="Inicio">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario"
          element={
            <ProtectedRoute>
              <Layout pageTitle="Inventario">
                <Inventario />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario/nuevo"
          element={
            <ProtectedRoute>
              <Layout pageTitle="Nuevo Producto">
                <FormProducto />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventario/editar/:id"
          element={
            <ProtectedRoute>
              <Layout pageTitle="Editar Producto">
                <FormProducto />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ventas/nueva"
          element={
            <ProtectedRoute>
              <Layout pageTitle="Nueva Venta">
                <NuevaVenta />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Layout pageTitle="Reportes">
                <Reportes />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <ProtectedAdminRoute>
                <Layout pageTitle="Usuarios">
                  <Usuarios />
                </Layout>
              </ProtectedAdminRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute>
              <ProtectedAdminRoute>
                <Layout pageTitle="Clientes">
                  <Clientes />
                </Layout>
              </ProtectedAdminRoute>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;