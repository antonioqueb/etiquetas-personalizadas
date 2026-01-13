"use client";
import { jsPDF } from "jspdf";
import JsBarcode from "jsbarcode";
import { FileText } from "lucide-react";

/* ─── Carga de imágenes ─── */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

/* ─── Conversión mm → px a 300 dpi ─── */
const DPI = 300;
const mmToPx = (mm) => Math.round((mm / 25.4) * DPI);

/* ─── Fecha fallback (CDMX) ─── */
const formatDateMXFallback = () => {
  try {
    return new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date());
  } catch {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = String(d.getFullYear());
    return `${dd}/${mm}/${yyyy}`;
  }
};

export default function PdfGenerator({ products, folio, labelDate }) {
  /* Dimensiones etiqueta */
  const PAGE_W = 200; // mm
  const PAGE_H = 100; // mm
  const MARGIN = 8;   // mm

  /* Código de barras */
  const BC_W_MM = 60;
  const BC_H_MM = 18;

  /* Segunda columna */
  const COL2_X = MARGIN + 90;

  /* ─── Utilidad: barcode en PNG ─── */
  const barcodeDataURL = (text, mmWidth, mmHeight) => {
    const canvas = document.createElement("canvas");
    canvas.width = mmToPx(mmWidth);
    canvas.height = mmToPx(mmHeight);

    JsBarcode(canvas, text, {
      format: "CODE128",
      displayValue: false,
      margin: 0,
      height: canvas.height,
      width: mmToPx(0.35),
      background: "#ffffff",
      lineColor: "#000000",
    });
    return canvas.toDataURL("image/png");
  };

  /* ─── Generar PDF ─── */
  const generateAllPdfs = async () => {
    const doc = new jsPDF({
      unit: "mm",
      format: [PAGE_W, PAGE_H],
      orientation: "landscape",
    });

    /* Logo */
    const logo = await loadImage("/hm.png");
    const logoW = 25;
    const logoH = logo.height * (logoW / logo.width);

    const bcX = PAGE_W - MARGIN - BC_W_MM;
    const bcY = PAGE_H - MARGIN - BC_H_MM;

    // Fecha efectiva a imprimir
    const printDate = (labelDate || "").trim() || formatDateMXFallback();

    products.forEach((product, pIdx) => {
      (product.lines || []).forEach((data, lIdx) => {
        if (pIdx > 0 || lIdx > 0) doc.addPage();

        /* Datos */
        const loteEtiqueta = (data.lotes?.[0] || "").toUpperCase();
        const secuencia = (data.secuencia || "").toUpperCase();
        const gramaje = (data.gramaje || "").toString().toUpperCase();
        const ancho = (data.ancho || "").toString().toUpperCase();
        const kilos = (data.kilos || "").toString().toUpperCase();
        const planta = (data.planta || "").toString().toUpperCase();
        const tipoLetter = (data.tipo || " ").trim().charAt(0).toUpperCase();

        /* Logo (esquina superior derecha) */
        doc.addImage(logo, "PNG", PAGE_W - MARGIN - logoW, MARGIN, logoW, logoH);

        doc.setFont("helvetica", "bold");

        /* ---- Línea 1: Secuencia/Lote ---- */
        const line1Y = MARGIN + logoH + 6;
        doc.setFontSize(70);
        doc.text(secuencia || loteEtiqueta, MARGIN, line1Y);

        /* ---- Línea 2: Gramaje y Ancho ---- */
        const line2Y = line1Y + 24;

        // Gramaje
        doc.setFontSize(72);
        const gramajeStr = `${tipoLetter}${gramaje}`;
        const gramajeWidth = doc.getTextWidth(gramajeStr);
        doc.text(gramajeStr, MARGIN, line2Y);

        doc.setFontSize(24);
        doc.text("GRS", MARGIN + gramajeWidth + 2, line2Y);

        // Ancho
        doc.setFontSize(72);
        const anchoWidth = doc.getTextWidth(ancho);
        doc.text(ancho, COL2_X, line2Y);

        doc.setFontSize(20);
        doc.text("CM", COL2_X + anchoWidth + 2, line2Y);

        /* ---- Línea 3: Kilos y Planta ---- */
        const line3Y = line2Y + 24;

        doc.setFontSize(72);
        const kilosWidth = doc.getTextWidth(kilos);
        doc.text(kilos, MARGIN, line3Y);

        doc.setFontSize(20);
        doc.text("KG", MARGIN + kilosWidth + 2, line3Y);

        doc.setFontSize(72);
        doc.text(`P${planta}`, COL2_X, line3Y);

        /* ---- Línea 4: Fecha (sin prefijo, letra grande) ---- */
        const line4Y = line3Y + 20;
        doc.setFontSize(36);
        doc.text(printDate, MARGIN, line4Y);

        /* ---- Código de barras ---- */
        const bcData = barcodeDataURL(loteEtiqueta, BC_W_MM, BC_H_MM);
        doc.addImage(bcData, "PNG", bcX, bcY, BC_W_MM, BC_H_MM);
      });
    });

    doc.save(`etiquetas-${folio}.pdf`);
  };

  /* ---- Botón UI ---- */
  return (
    <button
      onClick={generateAllPdfs}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition mt-6"
    >
      <FileText className="mr-2" size={22} />
      GENERAR ETIQUETAS
    </button>
  );
}