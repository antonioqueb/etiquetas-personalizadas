"use client";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { FileText } from "lucide-react";

/* ─── Utilidad para cargar imágenes desde /public ─── */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

/* ─── Conversión mm → px a 300 dpi ─── */
const DPI = 300;                          // resolución destino
const mmToPx = (mm) => Math.round((mm / 25.4) * DPI);

export default function PdfGenerator({ products, folio }) {
  /* ─── Configuración global ─── */
  const LABEL_W = 100;  // mm (≈ 4")
  const LABEL_H = 200;  // mm (≈ 8")
  const MARGIN  = 6;    // mm borde
  const BAR_W_MM = 0.3; // mm de una barra (≈ 0.012") — ajusta si quieres barras más gruesas

  /* ─── Genera barcode PNG en alta resolución ─── */
  const barcodeDataURL = (text, mmWidth, mmHeight) => {
    const canvas  = document.createElement("canvas");
    canvas.width  = mmToPx(mmWidth);
    canvas.height = mmToPx(mmHeight);

    JsBarcode(canvas, text, {
      format: "CODE128",
      displayValue: false,
      margin: 0,
      height: canvas.height,
      width: mmToPx(BAR_W_MM), // anchura mínima de barra a 300 dpi
      background: "#ffffff",
      lineColor: "#000000",
    });
    return canvas.toDataURL("image/png");
  };

  /* ─── Generación de PDFs ─── */
  const generateAllPdfs = async () => {
    /* Logo en escala de grises (en /public/hm.png) */
    const logo  = await loadImage("/hm.png");
    const logoW = 36;
    const logoH = 36 * (logo.height / logo.width);

    const doc = new jsPDF({
      unit: "mm",
      format: [LABEL_W, LABEL_H],
      orientation: "portrait",
    });

    products.forEach((product, pIdx) => {
      product.lines.forEach((data, lIdx) => {
        if (pIdx > 0 || lIdx > 0) doc.addPage();

        /* ─── Datos origen ─── */
        const loteEtiqueta = (data.lotes?.[0]     || "N/A").toUpperCase();
        const loteProv     = (data.lote_proveedor || "N/A").toUpperCase();
        const ordenOC      = (product.origin      || "N/A").toUpperCase();
        const docCompra    = folio.toString().toUpperCase();
        const fechaHora    = (product.scheduled_date || "N/A").toUpperCase();
        const tipo         = (data.tipo     || "—").toUpperCase();
        const gramaje      = (data.gramaje  || "—").toUpperCase();
        const ancho        = (data.ancho    || "—").toUpperCase();
        const planta       = (data.planta   || "—").toUpperCase();
        const kilos        = (data.kilos    || "—").toString().toUpperCase();

        /* ─── Encabezado con barcode Hi-DPI ─── */
        const bcWidthMm = LABEL_W - 2 * MARGIN;
        const bcHeightMm = 18;
        doc.addImage(
          barcodeDataURL(loteEtiqueta, bcWidthMm, bcHeightMm),
          "PNG",
          MARGIN,
          8,
          bcWidthMm,
          bcHeightMm
        );
        doc.setFont("helvetica", "bold").setFontSize(12);
        doc.text(loteEtiqueta, LABEL_W / 2, 30, { align: "center" });

        /* ─── Tabla de detalle (5 filas) ─── */
        const startY = 38;
        const rowH   = 14;
        const rows   = 5;
        const tableW = LABEL_W - 2 * MARGIN;

        doc.setLineWidth(0.25).rect(MARGIN, startY, tableW, rowH * rows);
        for (let i = 1; i < rows; i++) {
          doc.line(MARGIN, startY + rowH * i, MARGIN + tableW, startY + rowH * i);
        }
        doc.line(LABEL_W / 2, startY, LABEL_W / 2, startY + rowH * 4); // corte en fila 4

        const col1X = MARGIN + 1;
        const col2X = LABEL_W / 2 + 2;
        const drawCell = (label, value, x, y) => {
          doc.setFont("helvetica", "bold").setFontSize(8);
          doc.text(label, x, y + 4);
          doc.setFont("helvetica", "normal");
          doc.text(value, x, y + 10);
        };
        const drawFullRow = (label, value, y) => {
          doc.setFont("helvetica", "bold").setFontSize(8);
          doc.text(label, LABEL_W / 2, y + 4, { align: "center" });
          doc.setFont("helvetica", "normal");
          doc.text(value, LABEL_W / 2, y + 10, { align: "center" });
        };

        drawCell("DOC. ORIGEN", docCompra, col1X, startY);
        drawCell("PED. COMPRA",    ordenOC,   col2X, startY);

        drawCell("FECHA/HORA",  fechaHora, col1X, startY + rowH);
        drawCell("TIPO",        tipo,      col2X, startY + rowH);

        drawCell("GRAMAJE",     gramaje,   col1X, startY + rowH * 2);
        drawCell("ANCHO",       ancho,     col2X, startY + rowH * 2);

        drawCell("PLANTA",      planta,    col1X, startY + rowH * 3);
        drawCell("KILOS",       kilos,     col2X, startY + rowH * 3);

        drawFullRow("LOTE PROVEEDOR", loteProv, startY + rowH * 4);

        /* ─── Logo centrado ─── */
        const logoY = LABEL_H - MARGIN - logoH;
        doc.addImage(
          logo,
          "PNG",
          (LABEL_W - logoW) / 2,
          logoY,
          logoW,
          logoH
        );
      });
    });

    doc.save(`etiquetas-${folio}.pdf`);
  };

  /* ─── Botón UI ─── */
  return (
    <button
      onClick={generateAllPdfs}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition mt-6"
    >
      <FileText className="mr-2" size={22} /> GENERAR ETIQUETAS
    </button>
  );
}
