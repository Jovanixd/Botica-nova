// client/src/pages/FormProducto.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productoService from '../services/productoService';
import 'bootstrap/dist/css/bootstrap.min.css';

const FormProducto = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        stock_minimo: '5',
        codigo_barra: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); // Si es edición, tendrá id

    // Si es edición, cargar datos
    useEffect(() => {
        if (id) {
            const cargarProducto = async () => {
                try {
                    const res = await productoService.obtenerPorId(id);
                    setFormData(res.data);
                } catch (err) {
                    setError('Producto no encontrado');
                }
            };
            cargarProducto();
        }
    }, [id]);

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
            if (id) {
                await productoService.actualizar(id, formData);
            } else {
                await productoService.crear(formData);
            }
            navigate('/inventario');
        } catch (err) {
            setError('Error al guardar el producto');
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '600px' }}>
            <h2>{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre *</label>
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
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Precio (S/) *</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock *</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Stock Mínimo</label>
                    <input
                        type="number"
                        className="form-control"
                        name="stock_minimo"
                        value={formData.stock_minimo}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Código de Barra</label>
                    <input
                        type="text"
                        className="form-control"
                        name="codigo_barra"
                        value={formData.codigo_barra}
                        onChange={handleChange}
                    />
                </div>
                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/inventario')}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormProducto;