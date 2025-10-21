// client/src/pages/NuevaVenta.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productoService from '../services/productoService';
import ventaService from '../services/ventaService';
import clienteService from '../services/clienteService';
import Boleta from '../components/Boleta';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const NuevaVenta = () => {
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState('');
    const [boleta, setBoleta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showClienteModal, setShowClienteModal] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        documento: '',
        telefono: '',
        email: '',
        direccion: ''
    });

    const navigate = useNavigate();

    // 🟢 Cargar productos y clientes
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resProductos, resClientes] = await Promise.all([
                    productoService.obtenerTodos(),
                    clienteService.obtenerTodos()
                ]);
                setProductos(resProductos.data);
                setClientes(resClientes.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    navigate('/login');
                } else {
                    setError('Error al cargar productos o clientes');
                }
            } finally {
                setLoading(false);
            }
        };
        cargarDatos();
    }, [navigate]);

    // 🛒 Agregar al carrito
    const agregarAlCarrito = (producto) => {
        if (producto.stock <= 0) return alert('Producto sin stock disponible');

        const existe = carrito.find(item => item.id === producto.id);
        if (existe) {
            if (existe.cantidad < producto.stock) {
                setCarrito(carrito.map(item =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                ));
            } else {
                alert('Stock máximo alcanzado');
            }
        } else {
            setCarrito([...carrito, { ...producto, cantidad: 1 }]);
        }
    };

    // 🔢 Cambiar cantidad
    const cambiarCantidad = (id, nuevaCantidad) => {
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        if (nuevaCantidad < 1) return;
        if (nuevaCantidad > producto.stock) {
            alert('No hay suficiente stock');
            return;
        }

        setCarrito(carrito.map(item =>
            item.id === id ? { ...item, cantidad: nuevaCantidad } : item
        ));
    };

    // ❌ Eliminar del carrito
    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id !== id));
    };

    // 💰 Calcular total
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // 💾 Registrar venta
    const handleVenta = async () => {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const productosVenta = carrito.map(item => ({
            producto_id: item.id,
            cantidad: item.cantidad
        }));

        const datosVenta = {
            productos: productosVenta,
            cliente_id: clienteSeleccionado || null
        };

        try {
            const response = await ventaService.crear(datosVenta);
            setBoleta(response.data);
            setCarrito([]);
            setClienteSeleccionado('');
            // ✅ No navegamos, solo mostramos boleta
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.msg || 'No se pudo registrar la venta.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    // 👤 Crear cliente rápido
    const handleCrearClienteRapido = async (e) => {
        e.preventDefault();
        try {
            const res = await clienteService.crear(nuevoCliente);
            setClientes([...clientes, res.data]);
            setClienteSeleccionado(res.data.id);
            setShowClienteModal(false);
            setNuevoCliente({
                nombre: '',
                documento: '',
                telefono: '',
                email: '',
                direccion: ''
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.msg || 'No se pudo crear el cliente.',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    // 🕐 Estados de carga y error
    if (loading) return <div className="text-center mt-5">Cargando productos...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;
    if (boleta) return <Boleta venta={boleta} onNuevaVenta={() => setBoleta(null)} />;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">🛍️ Nueva Venta</h2>

            {/* Cliente */}
            <div className="mb-4">
                <label className="form-label fw-bold">Cliente (opcional)</label>
                <div className="input-group">
                    <select
                        className="form-select"
                        value={clienteSeleccionado}
                        onChange={(e) => setClienteSeleccionado(e.target.value)}
                    >
                        <option value="">-- Seleccionar cliente --</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.nombre} - {c.documento}
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={() => setShowClienteModal(true)}
                    >
                        ➕
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Productos */}
                <div className="col-md-7">
                    <h5 className="bi bi-box me-2"> Productos disponibles</h5>
                    <div className="list-group overflow-auto" style={{ maxHeight: '65vh' }}>
                        {productos.map(p => (
                            <button
                                key={p.id}
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => agregarAlCarrito(p)}
                                disabled={p.stock <= 0}
                            >
                                <div>
                                    <strong>{p.nombre}</strong> — S/ {parseFloat(p.precio).toFixed(2)}
                                    {p.stock <= 3 && (
                                        <span className="badge bg-warning text-dark ms-2">Stock bajo</span>
                                    )}
                                </div>
                                <span className={`badge ${p.stock > 0 ? 'bg-secondary' : 'bg-danger'}`}>
                                    Stock: {p.stock}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Carrito */}
                <div className="col-md-5">
                    <h5 className="bi bi-cart me-2"> Carrito ({carrito.length})</h5>
                    {carrito.length === 0 ? (
                        <p className="text-muted text-center">Agrega productos para la venta</p>
                    ) : (
                        <div className="card shadow-sm">
                            <ul className="list-group list-group-flush">
                                {carrito.map(item => (
                                    <li key={item.id} className="list-group-item">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>{item.nombre}</strong>
                                                <br />
                                                <small>S/ {parseFloat(item.precio).toFixed(2)} × {item.cantidad}</small>
                                            </div>
                                            <div>
                                                <span className="fw-bold me-2">
                                                    S/ {(item.precio * item.cantidad).toFixed(2)}
                                                </span>
                                                <div className="d-flex align-items-center">
                                                    <button className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>
                                                        -
                                                    </button>
                                                    <span className="mx-2">{item.cantidad}</span>
                                                    <button className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>
                                                        +
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger ms-2"
                                                        onClick={() => eliminarDelCarrito(item.id)}>
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="card-footer d-flex justify-content-between">
                                <strong>Total:</strong>
                                <strong>S/ {total.toFixed(2)}</strong>
                            </div>
                            <div className="card-body">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleVenta}
                                >
                                    Registrar Venta
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Crear Cliente */}
            {showClienteModal && (
                <>
                    <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Nuevo Cliente</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowClienteModal(false)}
                                    ></button>
                                </div>
                                <form onSubmit={handleCrearClienteRapido}>
                                    <div className="modal-body">
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Nombre completo *"
                                            value={nuevoCliente.nombre}
                                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Documento (DNI/RUC) *"
                                            value={nuevoCliente.documento}
                                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, documento: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Teléfono"
                                            value={nuevoCliente.telefono}
                                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                                        />
                                        <input
                                            type="email"
                                            className="form-control mb-2"
                                            placeholder="Email"
                                            value={nuevoCliente.email}
                                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                                        />
                                        <textarea
                                            className="form-control"
                                            placeholder="Dirección"
                                            rows="2"
                                            value={nuevoCliente.direccion}
                                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                                        ></textarea>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowClienteModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Crear Cliente
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </div>
    );
};

export default NuevaVenta;
