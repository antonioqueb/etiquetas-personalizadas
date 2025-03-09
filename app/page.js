"use client";
import FolioSelector from "@/components/FolioSelector";
import ProductTable from "@/components/ProductTable";
import { useState } from "react";

export default function Home() {
  const [selectedFolio, setSelectedFolio] = useState(null);

  return (
    <main className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        Gestión de Recepciones
      </h1>

      {!selectedFolio ? (
        <div className="mb-6">
          <FolioSelector onSelectFolio={setSelectedFolio} />
        </div>
      ) : (
        <div className="mt-6">
           <ProductTable folio={selectedFolio} />
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
