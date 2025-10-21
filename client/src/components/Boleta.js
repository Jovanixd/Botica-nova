// src/components/BoletaTicket.jsx
import React from 'react';
import './Boleta.css';

const BoletaTicket = ({ venta, onNuevaVenta }) => {
  if (!venta) return <div>Cargando boleta...</div>;

  return (
    <div className="ticket-container">
      {/* Encabezado */}
      <div className="ticket-header">
        <img src="/images/logo.png" alt="Logo Botica GISA" className="ticket-logo" />
        <h3>Botica GISA</h3>
        <p>RUC: 20608952314</p>
        <p>Av. Los Olivos 345 - Trujillo</p>
        <p>Tel: (01) 456-7890</p>
        <hr />
        <h4>BOLETA DE VENTA</h4>
      </div>

      {/* Datos */}
      <div className="ticket-datos">
        <p><strong>N° Venta:</strong> {venta.id}</p>
        <p><strong>Fecha:</strong> {venta.fecha ? new Date(venta.fecha).toLocaleString('es-PE') : '—'}</p>
        {venta.cliente && (
          <>
            <p><strong>Cliente:</strong> {venta.cliente.nombre}</p>
            <p><strong>Documento:</strong> {venta.cliente.documento}</p>
          </>
        )}
        <p><strong>Vendedor:</strong> {venta.vendedor || '—'}</p>
        <hr />
      </div>

      {/* Detalle */}
      <table className="ticket-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>P.U.</th>
            <th>Subt.</th>
          </tr>
        </thead>
        <tbody>
          {venta.detalles?.map((item, i) => (
            <tr key={i}>
              <td>{item.nombre}</td>
              <td>{item.cantidad}</td>
              <td>{Number(item.precio_unitario).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
              <td>{Number(item.subtotal).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <div className="ticket-total">
        <strong>Total: S/ {Number(venta.total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong>
      </div>

      <div className="ticket-footer">
        <p>¡Gracias por su compra! 💊</p>
        <p>Botica GISA</p>
      </div>

      <div className="ticket-botones">
        <button onClick={onNuevaVenta} className="btn btn-primary">Nueva Venta</button>
        <button onClick={() => window.print()} className="btn btn-secondary ms-2">Imprimir</button>
      </div>
    </div>
  );
};

export default BoletaTicket;
