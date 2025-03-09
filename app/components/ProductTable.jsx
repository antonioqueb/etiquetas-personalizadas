"use client";
import { useEffect, useState } from "react";
import { fetchProductDetails } from "@/utils/api";
import PdfGenerator from "@/components/PdfGenerator";

export default function ProductTable({ folio }) {
  const [product, setProduct] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchProductDetails(folio).then((data) => setProduct(data[0]));
  }, [folio]);

  const addRow = () => {
    setRows([...rows, { gramaje: "", ancho: "", peso: "", planta: "", kilos: "" }]);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  if (!product) return <p>Cargando producto...</p>;

  return (
    <div>
      <h2>Detalles del Producto</h2>
      <p><strong>Producto:</strong> {product.producto}</p>
      <p><strong>Cantidad Demandada:</strong> {product.product_uom_qty}</p>
      <p><strong>Cantidad Recibida:</strong> {product.quantity}</p>
      <p><strong>Fecha de Recepción:</strong> {product.scheduled_date}</p>

      <h3>Líneas del Producto</h3>
      <button onClick={addRow}>Agregar Línea</button>
      <table>
        <thead>
          <tr>
            <th>Gramaje</th>
            <th>Ancho</th>
            <th>Peso</th>
            <th>Planta</th>
            <th>Kilos</th>
            <th>PDF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.gramaje}
                  onChange={(e) => updateRow(index, "gramaje", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.ancho}
                  onChange={(e) => updateRow(index, "ancho", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.peso}
                  onChange={(e) => updateRow(index, "peso", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.planta}
                  onChange={(e) => updateRow(index, "planta", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.kilos}
                  onChange={(e) => updateRow(index, "kilos", e.target.value)}
                />
              </td>
              <td>
                <PdfGenerator data={row} product={product} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
