// src/pages/Clientes.jsx
import React, { useState, useEffect } from 'react';
import clienteService from '../services/clienteService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [clienteActual, setClienteActual] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        documento: '',
        telefono: '',
        email: '',
        direccion: ''
    });

    const cargarClientes = async () => {
        const res = await clienteService.obtenerTodos();
        setClientes(res.data);
        setLoading(false);
    };

    useEffect(() => { cargarClientes(); }, []);

    const handleOpen = (cliente = null) => {
        if (cliente) {
            setClienteActual(cliente);
            setFormData(cliente);
        } else {
            setClienteActual(null);
            setFormData({ nombre: '', documento: '', telefono: '', email: '', direccion: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (clienteActual) {
                await clienteService.actualizar(clienteActual.id, formData);
                const result = await Swal.fire('¡Actualizado!', 'Cliente actualizado correctamente.', 'success');
                if (result.isConfirmed) cargarClientes();
            } else {
                await clienteService.crear(formData);
                const result = await Swal.fire('¡Creado!', 'Cliente creado correctamente.', 'success');
                if (result.isConfirmed) cargarClientes();
            }
            setShowModal(false);
        } catch (err) {
            Swal.fire('Error', err.response?.data?.msg || 'Error al guardar cliente.', 'error');
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar cliente?',
            text: "Se perderán todos los datos del cliente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await clienteService.eliminar(id);
                Swal.fire('¡Eliminado!', 'Cliente eliminado correctamente.', 'success');
                cargarClientes();
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error');
            }
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2 className="bi bi-person me-2"> Clientes</h2>
                <button className="btn btn-success" onClick={() => handleOpen()}>+ Nuevo Cliente</button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(c => (
                            <tr key={c.id}>
                                <td>{c.nombre}</td>
                                <td>{c.documento}</td>
                                <td>{c.telefono || '—'}</td>
                                <td>{c.email || '—'}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleOpen(c)}>Editar</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(c.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal simple (puedes mejorarlo con Bootstrap si quieres) */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{clienteActual ? 'Editar Cliente' : 'Nuevo Cliente'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Nombre"
                                        value={formData.nombre}
                                        onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Documento (DNI)"
                                        value={formData.documento}
                                        onChange={e => setFormData({ ...formData, documento: e.target.value })}
                                    />
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Teléfono"
                                        value={formData.telefono}
                                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                    />
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <textarea
                                        className="form-control mb-2"
                                        placeholder="Dirección"
                                        value={formData.direccion}
                                        onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop show"></div>}
        </div>
    );
};

export default Clientes;
