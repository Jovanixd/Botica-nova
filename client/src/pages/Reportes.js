// src/pages/Reportes.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { descargarReporteVentasConFiltro, descargarReporteInventario } from '../services/reporteService';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Reportes = () => {
    const [resumen, setResumen] = useState({
        totalVentas: 0,
        totalProductos: 0,
        stockBajo: 0
    });
    const [loading, setLoading] = useState(true);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const navigate = useNavigate();

    // ✅ Formatear fecha a YYYY-MM-DD en zona local
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ✅ Establecer "hoy" al cargar
    useEffect(() => {
        const hoy = new Date();
        const fechaHoy = formatDate(hoy);
        setFechaInicio(fechaHoy);
        setFechaFin(fechaHoy);
    }, []);

    // ✅ Cargar resumen con filtro
    const cargarResumen = async (inicio, fin) => {
        try {
            let url = '/ventas';
            if (inicio || fin) {
                const params = new URLSearchParams();
                if (inicio) params.append('fechaInicio', inicio);
                if (fin) params.append('fechaFin', fin);
                url += `?${params.toString()}`;
            }

            const ventasRes = await api.get(url);
            let totalVentas = 0;
            if (Array.isArray(ventasRes.data)) {
                totalVentas = ventasRes.data.reduce((sum, v) => {
                    const total = typeof v.total === 'string' ? parseFloat(v.total) : v.total;
                    return isNaN(total) ? sum : sum + total;
                }, 0);
            }

            const invRes = await api.get('/productos');
            const productos = Array.isArray(invRes.data) ? invRes.data : [];
            const stockBajo = productos.filter(p => p.stock_bajo).length;

            setResumen({ totalVentas, totalProductos: productos.length, stockBajo });
        } catch (err) {
            console.error('Error al cargar resumen:', err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Recargar cuando cambien las fechas
    useEffect(() => {
        if (fechaInicio && fechaFin) {
            setLoading(true);
            cargarResumen(fechaInicio, fechaFin);
        }
    }, [fechaInicio, fechaFin]);

    // ✅ Manejar filtros predefinidos
    const handleFiltro = (tipo) => {
        const hoy = new Date();

        let inicio, fin;

        switch (tipo) {
            case 'hoy':
                inicio = formatDate(hoy);
                fin = formatDate(hoy);
                break;
            case 'semana':
                const diaSemana = hoy.getDay(); // 0 = domingo
                const diasDesdeLunes = diaSemana === 0 ? 6 : diaSemana - 1;
                const lunes = new Date(hoy);
                lunes.setDate(hoy.getDate() - diasDesdeLunes);
                inicio = formatDate(lunes);
                fin = formatDate(hoy);
                break;
            case 'mes':
                inicio = formatDate(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
                fin = formatDate(new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0));
                break;
            default:
                return;
        }

        setFechaInicio(inicio);
        setFechaFin(fin);
    };

    // ✅ Descargar ventas con filtro
    const handleDescargarVentas = async () => {
        try {
            await descargarReporteVentasConFiltro(fechaInicio, fechaFin);
        } catch (err) {
            console.error('Error al descargar reporte:', err);
            // Opcional: Swal.fire('Error', 'No se pudo descargar el reporte.', 'error');
        }
    };

    return (
        <div className="py-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="bi bi-file-earmark-text me-2"> Reportes</h2>

            </div>

            {/* Filtros */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h5 className="mb-3">Filtrar por fecha</h5>
                    <div className="row g-2">
                        <div className="col-md-3">
                            <input
                                type="date"
                                className="form-control"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="date"
                                className="form-control"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 d-flex gap-2">
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleFiltro('hoy')}>
                                Hoy
                            </button>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleFiltro('semana')}>
                                Esta semana
                            </button>
                            <button className="btn btn-outline-primary btn-sm" onClick={() => handleFiltro('mes')}>
                                Este mes
                            </button>
                        </div>
                    </div>
                    <div className="mt-2">
                        <small className="text-muted">
                            Mostrando datos desde <strong>{fechaInicio}</strong> hasta <strong>{fechaFin}</strong>
                        </small>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Cargando resumen...</div>
            ) : (
                <>
                    {/* Resumen */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="text-muted">Ventas Totales</h6>
                                            <h4 className="mb-0 text-primary">S/ {Number(resumen.totalVentas).toFixed(2)}</h4>
                                        </div>
                                        <div className="bg-primary bg-opacity-10 p-2 rounded">
                                            <i className="bi bi-cash fs-4 text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="text-muted">Productos</h6>
                                            <h4 className="mb-0 text-success">{resumen.totalProductos}</h4>
                                        </div>
                                        <div className="bg-success bg-opacity-10 p-2 rounded">
                                            <i className="bi bi-box fs-4 text-success"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="text-muted">Stock Bajo</h6>
                                            <h4 className="mb-0 text-warning">{resumen.stockBajo}</h4>
                                        </div>
                                        <div className="bg-warning bg-opacity-10 p-2 rounded">
                                            <i className="bi bi-exclamation-triangle fs-4 text-warning"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-white border-0 pb-0">
                                    <h5 className="bi bi-bar-chart"> Reporte de Ventas</h5>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <p className="text-muted mb-3">Descarga un Excel con las ventas en el rango seleccionado.</p>
                                    <button
                                        type="button"
                                        className="btn btn-primary mt-auto"
                                        onClick={handleDescargarVentas}
                                    >
                                        <i className="bi bi-file-earmark-excel me-2"></i> Descargar Ventas
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-header bg-white border-0 pb-0">
                                    <h5 className="bi bi-box"> Reporte de Inventario</h5>
                                </div>
                                <div className="card-body d-flex flex-column">
                                    <p className="text-muted mb-3">Descarga todo el inventario actual.</p>
                                    <button
                                        className="btn btn-success mt-auto"
                                        onClick={descargarReporteInventario}
                                    >
                                        <i className="bi bi-file-earmark-excel me-2"></i> Descargar Inventario
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reportes;