"use client";
import { jsPDF } from "jspdf";

export default function PdfGenerator({ data, product }) {
  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Producto", 10, 10);
    doc.text(`Producto: ${product.producto}`, 10, 20);
    doc.text(`Cantidad Demandada: ${product.product_uom_qty}`, 10, 30);
    doc.text(`Cantidad Recibida: ${product.quantity}`, 10, 40);
    doc.text(`Fecha de Recepción: ${product.scheduled_date}`, 10, 50);
    doc.text(`Gramaje: ${data.gramaje}`, 10, 60);
    doc.text(`Ancho: ${data.ancho}`, 10, 70);
    doc.text(`Peso: ${data.peso}`, 10, 80);
    doc.text(`Planta: ${data.planta}`, 10, 90);
    doc.text(`Kilos: ${data.kilos}`, 10, 100);
    doc.save(`reporte_${product.producto}.pdf`);
  };

  return <button onClick={generatePdf}>Generar PDF</button>;
}
