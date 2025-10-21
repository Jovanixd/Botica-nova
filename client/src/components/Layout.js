// src/components/Layout.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = ({ children, pageTitle = "Panel" }) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    return (
        <div className="d-flex">
            {/* Sidebar fijo */}
            <div
                className="bg-dark text-white"
                style={{
                    width: '250px',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    overflowY: 'auto',
                    zIndex: 1000,
                }}
            >
                {/* Perfil */}
                <div className="p-4 text-center bg-dark text-white">
                    {/* Imagen de perfil redonda */}
                    <div className="d-flex justify-content-center mb-3">
                        <img
                            src={usuario?.foto || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            alt="Perfil"
                            className="rounded-circle"
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                border: '2px solid #3578c0',
                                boxShadow: '0 0 10px rgba(53,120,192,0.3)',
                            }}
                        />
                    </div>

                    {/* Información del usuario */}
                    <div>
                        <h6 className="fw-bold m-0" style={{ color: '#ffffff' }}>
                            {usuario?.nombre || 'Administrador'}
                        </h6>
                        <small style={{ fontSize: '0.85rem', color: '#9ecbff' }}>
                            {usuario?.email || 'admin@gmail.com'}
                        </small>
                    </div>
                </div>


                {/* Menú */}
                <ul className="nav flex-column p-3" style={{ flex: 1 }}>
                    <li className="nav-item mb-2">
                        <Link to="/dashboard" className="nav-link text-white">
                            <i className="bi bi-house me-2"></i> Inicio
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/inventario" className="nav-link text-white">
                            <i className="bi bi-box me-2"></i> Inventario
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/ventas/nueva" className="nav-link text-white">
                            <i className="bi bi-cart me-2"></i> Ventas
                        </Link>
                    </li>
                    <li className="nav-item mb-2">
                        <Link to="/reportes" className="nav-link text-white">
                            <i className="bi bi-file-earmark-text me-2"></i> Reportes
                        </Link>
                    </li>
                    {usuario?.rol === 'admin' && (
                        <>
                            <li className="nav-item mb-2">
                                <Link to="/usuarios" className="nav-link text-white">
                                    <i className="bi bi-people me-2"></i> Usuarios
                                </Link>
                            </li>
                            <li className="nav-item mb-2">
                                <Link to="/clientes" className="nav-link text-white">
                                    <i className="bi bi-person me-2"></i> Clientes
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Cerrar sesión */}
                <div className="p-3 mt-auto">
                    <button
                        className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
                        onClick={handleLogout}
                        style={{ fontSize: '0.9rem' }}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Contenido principal */}
            <div
                className="flex-grow-1"
                style={{
                    marginLeft: '250px',
                    height: '100vh',
                    overflowY: 'auto',
                }}
            >
                {/* Header moderno */}
                <div
                    className="bg-white shadow-sm d-flex justify-content-between align-items-center px-4 py-3"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: '250px',
                        right: 0,
                        zIndex: 1000,
                        borderRadius: '0 0 12px 12px',
                    }}
                >
                    <div className="d-flex align-items-center">
                        <span className="me-3" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                            {pageTitle}
                        </span>
                    </div>

                    {/* Búsqueda (opcional) */}
                    <div className="d-flex align-items-center">
                        <div className="input-group me-3" style={{ maxWidth: '400px' }}>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Buscar..."
                                style={{ borderRadius: '20px 0 0 20px' }}
                            />
                            <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: '0 20px 20px 0' }}>
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                        {/* Notificación (opcional) */}
                        <div className="position-relative me-3">
                            <i className="bi bi-bell fs-4 text-muted"></i>
                            <span className="badge bg-danger rounded-pill position-absolute" style={{ top: '-8px', right: '-8px' }}>
                                3
                            </span>
                        </div>

                        
                       
                    </div>
                </div>

                {/* Contenido dinámico */}
                <div
                    className="container-fluid p-4"
                    style={{ paddingTop: '70px' }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;