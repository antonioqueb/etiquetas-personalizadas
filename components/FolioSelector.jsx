"use client";
import { useEffect, useState } from "react";
import { fetchFolios } from "@/utils/api";
import { Loader2 } from "lucide-react";

export default function FolioSelector({ onSelectFolio }) {
  const [folios, setFolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolios()
      .then((data) => setFolios(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">
        Selecciona un Folio
      </h2>
      {loading ? (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {folios.map((folio) => (
            <div key={folio} className="border border-gray-300 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition">
              <span className="text-lg font-medium text-gray-800">{folio}</span>
              <button
                onClick={() => onSelectFolio(folio)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
