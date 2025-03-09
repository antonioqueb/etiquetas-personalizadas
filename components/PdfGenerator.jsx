"use client";
import { jsPDF } from "jspdf";
import { FileText } from "lucide-react";

export default function PdfGenerator({ products, folio }) {
  const generateAllPdfs = () => {
    const doc = new jsPDF();

    products.forEach((product, prodIndex) => {
      product.lines.forEach((data, index) => {
        // Si no es la primera etiqueta, agregamos una página nueva
        if (prodIndex > 0 || index > 0) {
          doc.addPage();
        }

        /***********************
         *    SECCIÓN SUPERIOR
         ***********************/
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);

        // Documento (folio) en la parte superior
        doc.text(`Documento: ${folio}`, 10, 30);

        // Ajustamos la fuente para los datos del producto
        doc.setFontSize(22);
        // Manejo del salto de línea en el nombre del producto
        const productText = doc.splitTextToSize(product.producto, 180);
        doc.text(productText, 10, 45);
        
        // Calculamos cuántas líneas usó el nombre del producto
        const linesUsed = productText.length;
        let yOffsetProduct = 45 + (linesUsed * 8) + 10;

        // Fecha y PC
        doc.text(`${product.scheduled_date}`, 10, yOffsetProduct);
        doc.text(`PC: ${product.origin}`, 10, yOffsetProduct + 15);

        // Lotes (y dejamos un margen extra por debajo)
        const lotesText = data.lotes.length > 0 ? data.lotes.join(", ") : "N/A";
        const loteY = yOffsetProduct + 30;
        doc.text(`LOTE: ${lotesText}`, 10, loteY);

        // Definimos un margen de 10 puntos debajo del LOTE
        let yOffset = loteY + 10;

        // Ahora imprimimos TIPO, GRAMAJE, etc., en tamaño grande
        doc.setFontSize(35);
        yOffset += 10; // Ajuste adicional para separar más la primera línea
        doc.text(`TIPO:  ${data.tipo}`, 10, yOffset);
        doc.text(`GRAMAJE:  ${data.gramaje}`, 10, yOffset + 15);
        doc.text(`ANCHO:  ${data.ancho}`, 10, yOffset + 30);
        doc.text(`PLANTA:  ${data.planta}`, 10, yOffset + 45);
        doc.text(`KILOS:  ${data.kilos}`, 10, yOffset + 60);

        // Bajamos un poco más para trazar una línea divisoria
        const linePos = yOffset + 70;
        doc.setLineWidth(1);
        doc.line(10, linePos, 200, linePos);

        /************************
         *   SECCIÓN INFERIOR
         * (Repetimos datos para
         *  el troquel/desprendible)
         ************************/
        let lowerBlockOffset = linePos + 15;
        doc.setFontSize(18); // Texto más pequeño

        doc.text(`Documento: ${folio}`, 10, lowerBlockOffset);
        lowerBlockOffset += 10;
        
        // Aplicar splitTextToSize al nombre del producto en la parte inferior
        const lowerProductText = doc.splitTextToSize(product.producto, 180);
        doc.text(lowerProductText, 10, lowerBlockOffset);
        
        // Calcular espacio usado por el nombre del producto
        const lowerLinesUsed = lowerProductText.length;
        lowerBlockOffset += lowerLinesUsed * 8 + 5; // Ajustamos con margen extra
        
        doc.text(`Fecha: ${product.scheduled_date}`, 10, lowerBlockOffset);
        lowerBlockOffset += 10;
        doc.text(`PC: ${product.origin}`, 10, lowerBlockOffset);
        lowerBlockOffset += 10;
        doc.text(`Lote: ${lotesText}`, 10, lowerBlockOffset);
        lowerBlockOffset += 15; // Un poco más de espacio antes de TIPO
      });
    });

    doc.save(`etiquetas-${folio}.pdf`);
  };

  return (
    <button
      onClick={generateAllPdfs}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition mt-6"
    >
      <FileText className="mr-2" size={22} /> GENERAR ETIQUETAS
    </button>
  );
}
