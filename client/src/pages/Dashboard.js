// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { descargarReporteVentas, descargarReporteInventario } from '../services/reporteService'; import {
  Bar,
  Line
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [resumen, setResumen] = useState({
    totalVentas: 0,
    totalProductos: 0,
    stockBajo: 0,
    ultimasVentas: [],
    productosBajo: [],
    productosRecientes: [] // ← nuevo

  });
  const [loading, setLoading] = useState(true);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  useEffect(() => {
    // En Dashboard.jsx, dentro del useEffect
    const cargarDashboard = async () => {
      try {
        // 1. Resumen diario
        const resumenRes = await api.get('/dashboard/resumen-diario');
        const { totalVentas, totalProductos, stockBajo, productosRecientes } = resumenRes.data;

        // 2. Últimas ventas (para tabla y gráficos)
        const ventasRes = await api.get('/ventas');
        const ultimasVentas = ventasRes.data.slice(0, 5);

        // 3. Productos con stock bajo (para tabla)
        const invRes = await api.get('/productos');
        const productosBajo = invRes.data
          .filter(p => p.stock_bajo)
          .slice(0, 5);

        setResumen({
          totalVentas,
          totalProductos,
          stockBajo,
          ultimasVentas,
          productosBajo,
          productosRecientes
        });
      } catch (err) {
        console.error('Error al cargar dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarDashboard();
    
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Datos para gráficos
  const labels = resumen.ultimasVentas.map(v => new Date(v.fecha).toLocaleDateString('es-PE'));
  const dataVentas = resumen.ultimasVentas.map(v => parseFloat(v.total));

  const barData = {
    labels,
    datasets: [{
      label: 'Ventas',
      data: dataVentas,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `S/ ${ctx.raw.toFixed(2)}`
        }
      }
    },
    scales: { y: { beginAtZero: true } }
  };

  const lineData = {
    labels,
    datasets: [{
      label: 'Tendencia',
      data: dataVentas,
      fill: false,
      borderColor: '#4CAF50',
      tension: 0.3
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="py-3">
      {/* Encabezado */}
      <div className="mb-4">
        <h2 className="mb-0">Panel de Control</h2>
        <p className="text-muted">Resumen de actividades recientes</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="row g-4 mb-5">
        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-1">Ventas Totales</h6>
                  <h4 className="mb-0 text-primary">S/ {resumen.totalVentas.toFixed(2)}</h4>
                </div>
                <div className="bg-primary bg-opacity-10 p-2 rounded">
                  <i className="bi bi-cash fs-4 text-primary"></i>
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-primary mt-3"
                onClick={descargarReporteVentas}
              >
                <i className="bi bi-download me-1"></i> Descargar
              </button>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-1">Productos</h6>
                  <h4 className="mb-0 text-success">{resumen.totalProductos}</h4>
                </div>
                <div className="bg-success bg-opacity-10 p-2 rounded">
                  <i className="bi bi-box fs-4 text-success"></i>
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-success mt-3"
                onClick={descargarReporteInventario}
              >
                <i className="bi bi-download me-1"></i> Descargar
              </button>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-1">Stock Bajo</h6>
                  <h4 className="mb-0 text-warning">{resumen.stockBajo}</h4>
                </div>
                <div className="bg-warning bg-opacity-10 p-2 rounded">
                  <i className="bi bi-exclamation-triangle fs-4 text-warning"></i>
                </div>
              </div>
              <Link to="/inventario" className="btn btn-sm btn-outline-warning mt-3">
                <i className="bi bi-eye me-1"></i> Ver detalles
              </Link>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-1">Últimas Ventas</h6>
                  <h4 className="mb-0 text-danger">{resumen.ultimasVentas.length}</h4>
                </div>
                <div className="bg-danger bg-opacity-10 p-2 rounded">
                  <i className="bi bi-receipt fs-4 text-danger"></i>
                </div>
              </div>
              <Link to="/ventas/nueva" className="btn btn-sm btn-outline-danger mt-3">
                <i className="bi bi-cart me-1"></i> Nueva venta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row g-4 mb-5">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pb-0">
              <h5 className="mb-0">Ventas Recientes</h5>
            </div>
            <div className="card-body pt-0">
              <Bar data={barData} options={barOptions} height={100} />
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pb-0">
              <h5 className="mb-0">Tendencia</h5>
            </div>
            <div className="card-body pt-0">
              <Line data={lineData} options={lineOptions} height={100} />
            </div>
          </div>
        </div>
      </div>

      {/* Tablas */}
      <div className="row g-4">
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">⚠️ Productos con Stock Bajo</h5>
            </div>
            <div className="card-body p-0">
              {resumen.productosBajo.length === 0 ? (
                <div className="p-3 text-center text-success">
                  ¡Todos los productos tienen stock suficiente!
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th className="text-center">Stock</th>
                        <th className="text-center">Mínimo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumen.productosBajo.map(p => (
                        <tr key={p.id}>
                          <td>{p.nombre}</td>
                          <td className="text-center text-danger fw-bold">{p.stock}</td>
                          <td className="text-center">{p.stock_minimo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      <div className="col-xl-6">
  <div className="card border-0 shadow-sm">
    <div className="card-header bg-white border-0">
      <h5 className="mb-0">📦 Productos Recientes</h5>
    </div>
    <div className="card-body">
      {resumen.productosRecientes.length === 0 ? (
        <p className="text-muted text-center mb-0">
          No se han agregado productos en los últimos 7 días.
        </p>
      ) : (
        <ul className="list-group list-group-flush">
          {resumen.productosRecientes.map(p => (
            <li key={p.id} className="list-group-item d-flex justify-content-between">
              <span>{p.nombre}</span>
              <small className="text-muted">
                {new Date(p.created_at).toLocaleDateString('es-PE')}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Dashboard;