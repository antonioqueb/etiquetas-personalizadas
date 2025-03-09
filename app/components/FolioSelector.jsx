"use client";
import { useEffect, useState } from "react";
import { fetchFolios } from "@/utils/api";

export default function FolioSelector({ onSelectFolio }) {
  const [folios, setFolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFolios()
      .then((data) => setFolios(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando folios...</p>;

  return (
    <div>
      <h2>Selecciona un Folio</h2>
      <ul>
        {folios.map((folio) => (
          <li key={folio}>
            <button onClick={() => onSelectFolio(folio)}>{folio}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
