"use client";

import FolioSelector from "@/components/FolioSelector";
import ProductTable from "@/components/ProductTable";
import { useMemo, useState } from "react";
import { formatDateMX } from "@/utils/date";

export default function Home() {
  const [selectedFolio, setSelectedFolio] = useState(null);

  // Fecha fija (CDMX) para el "lote" actual de impresión/etiquetado
  const labelDate = useMemo(() => formatDateMX(new Date()), []);

  return (
    <main className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
        Gestión de Recepciones
      </h1>

      <p className="text-sm text-gray-600 text-center mb-6">
        Fecha de etiqueta: <span className="font-semibold">{labelDate}</span>
      </p>

      {!selectedFolio ? (
        <div className="mb-6">
          <FolioSelector onSelectFolio={setSelectedFolio} />
        </div>
      ) : (
        <div className="mt-6">
          {/* Se pasa la fecha para que la uses dentro de la etiqueta */}
          <ProductTable folio={selectedFolio} labelDate={labelDate} />

          <button
            onClick={() => setSelectedFolio(null)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 my-12 mb-24 rounded-lg transition mb-4"
          >
            Volver a seleccionar folio
          </button>
        </div>
      )}
    </main>
  );
}
