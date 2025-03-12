"use client";
import { useEffect, useState } from "react";
import { fetchProductDetails } from "@/utils/api";
import { Loader2, PlusCircle } from "lucide-react";
import PdfGenerator from "@/components/PdfGenerator";

export default function ProductTable({ folio, onResetFolio }) {
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState({});

  useEffect(() => {
    fetchProductDetails(folio).then((data) => {
      setProducts(data);

      // Generamos las filas iniciales por cada lote
      const initialRows = {};
      data.forEach((product) => {
        const filasPorLote = product.lotes.map((lote) => ({
          lotes: [lote.lote],
          kilos: lote.cantidad, // Rellenar kilos automáticamente
          tipo: "",
          gramaje: "",
          ancho: "",
          planta: "",
        }));
        initialRows[product.producto] = filasPorLote;
      });

      setRows(initialRows);
    });
  }, [folio]);

  // Agrega una nueva fila con un solo lote (o vacío)
  const addRow = (product, lote = "") => {
    setRows((prevRows) => ({
      ...prevRows,
      [product]: [
        ...prevRows[product],
        {
          lotes: [lote],
          kilos: "",
          tipo: "",
          gramaje: "",
          ancho: "",
          planta: "",
        },
      ],
    }));
  };

  // Actualiza valores en una fila específica
  const updateRow = (product, index, field, value) => {
    setRows((prevRows) => {
      const newRows = { ...prevRows };
      newRows[product][index][field] = value;
      return newRows;
    });
  };

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center py-6">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      {products.map((product) => (
        <div key={product.producto} className="mb-8">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
            Detalles del Producto
          </h2>
          <div className="border border-gray-300 rounded-lg p-4 mb-4 text-black">
            <p className="text-lg font-medium text-gray-800">
              <strong>Producto:</strong> {product.producto}
            </p>
            <p>
              <strong>Orden de Origen:</strong> {product.origin}
            </p>
            <p>
              <strong>Cantidad Demandada:</strong> {product.product_uom_qty}
            </p>
            <p>
              <strong>Cantidad Recibida:</strong> {product.quantity}
            </p>
            <p>
              <strong>Fecha de Recepción:</strong> {product.scheduled_date}
            </p>
          </div>

          <h3 className="text-xl font-semibold text-green-700 mb-2">
            Líneas del Producto
          </h3>
          <button
            onClick={() => addRow(product.producto)}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4 transition"
          >
            <PlusCircle className="mr-2" size={20} /> Agregar Línea
          </button>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 px-12">Lote</th>
                  <th className="p-2">Kilos</th>
                  <th className="p-2">Tipo</th>
                  <th className="p-2">Gramaje</th>
                  <th className="p-2">Ancho</th>
                  <th className="p-2">Planta</th>
                </tr>
              </thead>
              <tbody>
                {rows[product.producto]?.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300 hover:bg-gray-100"
                  >
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.lotes[0] || ""}
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.kilos}
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg bg-gray-200 text-gray-700 cursor-not-allowed"
                      />
                    </td>
                    {["tipo", "gramaje", "ancho", "planta"].map(
                      (field) => (
                        <td key={field} className="p-2">
                          <input
                            type="text"
                            value={row[field]}
                            onChange={(e) =>
                              updateRow(product.producto, index, field, e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Componente para generar PDF */}
      <PdfGenerator
        folio={folio}
        products={products.map((product) => ({
          ...product,
          lines: rows[product.producto] || [],
        }))}
      />
    </div>
  );
}
