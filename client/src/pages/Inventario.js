// src/pages/Inventario.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productoService from '../services/productoService';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../App.css';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estado para filtro y ordenamiento
  const [filtro, setFiltro] = useState('');
  const [orden, setOrden] = useState('asc');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    stock_minimo: '5',
    codigo_barra: ''
  });

  // Cargar productos al inicio
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const res = await productoService.obtenerTodos();
        setProductos(res.data);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  // Evitar scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  // Filtrar y ordenar productos
  const productosFiltrados = productos
    .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => (orden === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)));

  // Abrir modal
  const handleOpenModal = (producto = null) => {
    if (producto) {
      setProductoActual(producto);
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        stock: producto.stock,
        stock_minimo: producto.stock_minimo,
        codigo_barra: producto.codigo_barra || ''
      });
    } else {
      setProductoActual(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        stock_minimo: '5',
        codigo_barra: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductoActual(null);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Convertir a número antes de enviar
      const datosEnviar = {
        ...formData,
        precio: formData.precio === '' ? 0 : Number(formData.precio),
        stock: formData.stock === '' ? 0 : Number(formData.stock),
        stock_minimo: formData.stock_minimo === '' ? 5 : Number(formData.stock_minimo)
      };

      if (productoActual) {
        await productoService.actualizar(productoActual.id, datosEnviar);
        await Swal.fire('¡Actualizado!', 'El producto se actualizó correctamente.', 'success');
      } else {
        await productoService.crear(datosEnviar);
        await Swal.fire('¡Creado!', 'El producto se creó correctamente.', 'success');
      }

      // ✅ Recargar productos y cerrar modal
      const res = await productoService.obtenerTodos();
      setProductos(res.data);
      handleCloseModal();

    } catch (err) {
      Swal.fire('Error', err.response?.data?.msg || 'Error al guardar producto.', 'error');
    }
  };

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
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
        await productoService.eliminar(id);
        setProductos(productos.filter(p => p.id !== id));
        Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando inventario...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div className="main-content">
      {/* Barra de búsqueda y botón nuevo */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            style={{ width: '250px' }}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setOrden(orden === 'asc' ? 'desc' : 'asc')}
          >
            {orden === 'asc' ? '↑ Nombre' : '↓ Nombre'}
          </button>
        </div>
        <button className="btn btn-success" onClick={() => handleOpenModal()}>
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      {productosFiltrados.length === 0 ? (
        <div className="alert alert-info">No hay productos que coincidan con tu búsqueda.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Stock Mínimo</th>
                <th>Código de Barra</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.descripcion || '—'}</td>
                  <td>S/ {parseFloat(p.precio).toFixed(2)}</td>
                  <td>
                    {p.stock}
                    {p.stock_bajo && <span className="badge bg-danger ms-2">¡Bajo!</span>}
                  </td>
                  <td>{p.stock_minimo}</td>
                  <td>{p.codigo_barra || '—'}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-primary" onClick={() => handleOpenModal(p)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(p.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal centrado y con fondo oscuro */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: 'block',
            backgroundColor: 'rgba(12, 12, 12, 0.5)', // fondo oscuro
          }}
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {productoActual ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
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
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio *</label>
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
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {productoActual ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;
