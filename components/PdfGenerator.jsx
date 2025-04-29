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
const DPI = 300;
const mmToPx = (mm) => Math.round((mm / 25.4) * DPI);

export default function PdfGenerator({ products, folio }) {
  /* ─── Configuración global ─── */
  const PAGE_W = 200; // mm (ancho etiqueta – apaisada)
  const PAGE_H = 100; // mm (alto etiqueta)
  const MARGIN  = 4;  // mm (margen interior)

  const BC_W_MM = 60; // mm (ancho código de barras)
  const BC_H_MM = 18; // mm (alto código de barras)

  /* Anchuras de columnas para evitar que el texto se meta bajo el código */
  const COL2_X = MARGIN + 90; // segunda columna de texto (~ mitad de la etiqueta)

  /* ─── Genera barcode PNG en alta resolución ─── */
  const barcodeDataURL = (text, mmWidth, mmHeight) => {
    const canvas = document.createElement("canvas");
    canvas.width  = mmToPx(mmWidth);
    canvas.height = mmToPx(mmHeight);

    JsBarcode(canvas, text, {
      format: "CODE128",
      displayValue: false,
      margin: 0,
      height: canvas.height,
      width: mmToPx(0.35), // línea ligeramente más gruesa
      background: "#ffffff",
      lineColor: "#000000",
    });
    return canvas.toDataURL("image/png");
  };

  /* ─── Generación de PDFs ─── */
  const generateAllPdfs = async () => {
    const doc = new jsPDF({ unit: "mm", format: [PAGE_W, PAGE_H], orientation: "landscape" });

    /* Logo HM */
    const logo   = await loadImage("/hm.png");
    const logoW  = 25; // mm
    const logoH  = logo.height * (logoW / logo.width);

    /* Posición constante del código de barras (esquina inferior-derecha) */
    const bcX = PAGE_W - MARGIN - BC_W_MM;
    const bcY = PAGE_H - MARGIN - BC_H_MM;

    products.forEach((product, pIdx) => {
      product.lines.forEach((data, lIdx) => {
        if (pIdx > 0 || lIdx > 0) doc.addPage();

        /* ─── Variables ─── */
        const loteEtiqueta = (data.lotes?.[0] || "").toUpperCase();
        const secuencia    = (data.secuencia   || "").toUpperCase();
        const gramaje      = (data.gramaje     || "").toString().toUpperCase();
        const ancho        = (data.ancho       || "").toString().toUpperCase();
        const kilos        = (data.kilos       || "").toString().toUpperCase();
        const planta       = (data.planta      || "").toString().toUpperCase();
        const tipoLetter   = (data.tipo        || " ").trim().charAt(0).toUpperCase();

        /* ─── Logo ─── */
        doc.addImage(logo, "PNG", PAGE_W - MARGIN - logoW, MARGIN, logoW, logoH);

        /* Ajustes de fuente gruesa */
        doc.setFont("helvetica", "bold");
        doc.setCharSpace(0);

        /* ─── Línea 1: Secuencia / lote ─── */
        doc.setFontSize(70);
        const line1Y = MARGIN + 38;
        doc.text(secuencia || loteEtiqueta, MARGIN, line1Y);

        /* ─── Línea 2: L300GRS y ancho ─── */
        doc.setFontSize(52);
        const line2Y = line1Y + 23;
        doc.text(`${tipoLetter}${gramaje}GRS`, MARGIN, line2Y);
        doc.text(`${ancho}CM`, COL2_X, line2Y);

        /* ─── Línea 3: Kilos y planta ─── */
        doc.setFontSize(52);
        const line3Y = line2Y + 23;
        doc.text(`${kilos}KG`, MARGIN, line3Y);
        doc.text(`P${planta}`, COL2_X, line3Y);

        /* ─── Código de barras ─── */
        const bcData = barcodeDataURL(loteEtiqueta, BC_W_MM, BC_H_MM);
        doc.addImage(bcData, "PNG", bcX, bcY, BC_W_MM, BC_H_MM);
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