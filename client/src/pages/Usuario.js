// src/pages/Usuarios.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usuarioService from '../services/usuarioService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'vendedor'
    });

    const navigate = useNavigate();

    const cargarUsuarios = async () => {
        try {
            const res = await usuarioService.obtenerTodos();
            setUsuarios(res.data);
        } catch (err) {
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const handleOpenModal = (usuario = null) => {
        if (usuario) {
            setUsuarioActual(usuario);
            setFormData({
                nombre: usuario.nombre,
                email: usuario.email,
                password: '',
                rol: usuario.rol
            });
        } else {
            setUsuarioActual(null);
            setFormData({
                nombre: '',
                email: '',
                password: '',
                rol: 'vendedor'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUsuarioActual(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (usuarioActual) {
                await usuarioService.actualizar(usuarioActual.id, formData);
                const result = await Swal.fire('¡Actualizado!', 'Usuario actualizado correctamente.', 'success');
                if (result.isConfirmed) cargarUsuarios();
            } else {
                await usuarioService.crear(formData);
                const result = await Swal.fire('¡Creado!', 'Usuario creado correctamente.', 'success');
                if (result.isConfirmed) cargarUsuarios();
            }
            handleCloseModal();
        } catch (err) {
            Swal.fire('Error', err.response?.data?.msg || 'Error al guardar usuario.', 'error');
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await usuarioService.eliminar(id);
                Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
                cargarUsuarios(); // Recargar lista
            } catch (err) {
                Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
            }
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando usuarios...</div>;
    if (error) return <div className="alert alert-danger text-center">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="bi bi-people me-2"> Gestión de Usuarios</h2>
                <button className="btn btn-success" onClick={() => handleOpenModal()}>
                    + Nuevo Usuario
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id}>
                                <td>{u.nombre}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`badge bg-${u.rol === 'admin' ? 'danger' : 'info'}`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleOpenModal(u)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleEliminar(u.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className={`modal fade ${showModal ? 'show d-block' : 'd-none'}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {usuarioActual ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {!usuarioActual && (
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label">Rol</label>
                                    <select
                                        className="form-select"
                                        name="rol"
                                        value={formData.rol}
                                        onChange={handleChange}
                                    >
                                        <option value="vendedor">Vendedor</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {usuarioActual ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Usuarios;