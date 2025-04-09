"use client";
import { jsPDF } from "jspdf";
import { FileText } from "lucide-react";

export default function PdfGenerator({ products, folio }) {
  const generateAllPdfs = () => {
    const doc = new jsPDF();

    products.forEach((product, prodIndex) => {
      product.lines.forEach((data, index) => {
        if (prodIndex > 0 || index > 0) {
          doc.addPage();
        }

        /***********************
         *    SECCIÓN SUPERIOR
         ***********************/
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text(`Documento: ${folio}`, 10, 30);

        doc.setFontSize(22);
        const productText = doc.splitTextToSize(product.producto, 180);
        doc.text(productText, 10, 45);

        const linesUsed = productText.length;
        let yOffsetProduct = 45 + (linesUsed * 8) + 10;

        doc.text(`${product.scheduled_date}`, 10, yOffsetProduct);
        doc.text(`PC: ${product.origin}`, 10, yOffsetProduct + 15);

        const loteUnico = data.lotes.length > 0 ? data.lotes[0] : "N/A";
        const secuencia = data.secuencia || "N/A";
        const loteY = yOffsetProduct + 30;
        doc.text(`LOTE: ${loteUnico}`, 10, loteY);
        doc.text(`SECUENCIA: ${secuencia}`, 10, loteY + 10);

        /***************
         * Campos grandes
         ***************/
        let yOffset = loteY + 25;
        doc.setFontSize(35);
        doc.text(`TIPO:  ${data.tipo}`, 10, yOffset);
        doc.text(`GRAMAJE:  ${data.gramaje}`, 10, yOffset + 15);
        doc.text(`ANCHO:  ${data.ancho}`, 10, yOffset + 30);
        doc.text(`PLANTA:  ${data.planta}`, 10, yOffset + 45);
        doc.text(`KILOS:  ${data.kilos}`, 10, yOffset + 60);

        const linePos = yOffset + 70;
        doc.setLineWidth(1);
        doc.line(10, linePos, 200, linePos);

        /************************
         *   SECCIÓN INFERIOR
         ************************/
        let lowerBlockOffset = linePos + 15;
        doc.setFontSize(18);

        doc.text(`Documento: ${folio}`, 10, lowerBlockOffset);
        lowerBlockOffset += 10;

        const lowerProductText = doc.splitTextToSize(product.producto, 180);
        doc.text(lowerProductText, 10, lowerBlockOffset);

        const lowerLinesUsed = lowerProductText.length;
        lowerBlockOffset += lowerLinesUsed * 8 + 5;

        doc.text(`Fecha: ${product.scheduled_date}`, 10, lowerBlockOffset);
        lowerBlockOffset += 10;
        doc.text(`PC: ${product.origin}`, 10, lowerBlockOffset);
        lowerBlockOffset += 10;
        doc.text(`Lote: ${loteUnico}`, 10, lowerBlockOffset);
        lowerBlockOffset += 10;
        doc.text(`Secuencia: ${secuencia}`, 10, lowerBlockOffset);
        lowerBlockOffset += 15;
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
