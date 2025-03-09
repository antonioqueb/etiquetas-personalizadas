import FolioSelector from "@/components/FolioSelector";
import ProductTable from "@/components/ProductTable";
import { useState } from "react";

export default function Home() {
  const [selectedFolio, setSelectedFolio] = useState(null);

  return (
    <main>
      <h1>Gestión de Recepciones</h1>
      <FolioSelector onSelectFolio={setSelectedFolio} />
      {selectedFolio && <ProductTable folio={selectedFolio} />}
    </main>
  );
}
