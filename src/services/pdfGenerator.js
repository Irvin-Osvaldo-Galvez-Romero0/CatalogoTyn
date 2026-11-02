/**
 * Generador Profesional de Cotizaciones en PDF
 * Utiliza jsPDF y jsPDF-AutoTable para crear documentos con membrete oficial, logotipo activo,
 * desglose exhaustivo de variantes compuestas (piezas, medidas y colores) y suma total de costos.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { brandingService } from './brandingService';

/**
 * Convierte color hex a RGB array [r, g, b]
 */
function hexToRgbArray(hex) {
  let c = (hex || '#10B4C1').replace('#', '');
  if (c.length === 3) c = c.split('').map((char) => char + char).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Convierte cualquier ruta de imagen o data-URL a data-URL rasterizada en canvas
 */
function getLogoAsDataUrl(logoPathOrDataUrl) {
  return new Promise((resolve) => {
    if (!logoPathOrDataUrl) return resolve(null);
    if (typeof window === 'undefined') return resolve(null);

    if (logoPathOrDataUrl.startsWith('data:image')) {
      return resolve(logoPathOrDataUrl);
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 200;
        canvas.height = img.naturalHeight || img.height || 60;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn('Could not convert logo to data URL for PDF:', e);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = logoPathOrDataUrl;
  });
}

export const pdfGenerator = {
  /**
   * Genera el documento PDF de cotización con el logo activo en el momento
   */
  async createQuotePdf({
    items = [],
    salesRep = null,
    brandColor = '#10B4C1',
    customerName = 'Estimado Cliente',
    logoDataUrl = null
  }) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    const primaryRgb = hexToRgbArray(brandColor);
    const folio = `COT-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // 1. Barra superior decorativa
    doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.rect(0, 0, 216, 6, 'F');

    // 2. Cargar e Incrustar el Logotipo Activo
    const activeLogoSrc = logoDataUrl || brandingService.getLogo();
    const rasterLogo = await getLogoAsDataUrl(activeLogoSrc);

    let currentY = 16;
    let titleStartX = 14;

    if (rasterLogo) {
      try {
        doc.addImage(rasterLogo, 'PNG', 14, 10, 36, 14, undefined, 'FAST');
        titleStartX = 54;
      } catch (e) {
        console.warn('Could not render logo in PDF:', e);
        titleStartX = 14;
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.text('COTIZACIÓN Y ESPECIFICACIÓN TÉCNICA', titleStartX, currentY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Documento oficial generado desde Kiosco Digital Interactivo', titleStartX, currentY + 5);

    // Folio y Fecha a la derecha
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`FOLIO: ${folio}`, 202, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Fecha: ${dateStr}`, 202, currentY + 5, { align: 'right' });

    currentY += 14;

    // 3. Tarjeta de Metadatos (Asesor Comercial y Cliente)
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY, 188, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('ASESOR COMERCIAL ASIGNADO:', 18, currentY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    const repName = salesRep?.name || 'Asesor Tynor México';
    const repPhone = salesRep?.displayPhone || salesRep?.phone || 'Atención en Stand';
    doc.text(`${repName}  •  WhatsApp: ${repPhone}`, 18, currentY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('CLIENTE / SOLICITANTE:', 125, currentY + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`${customerName} (Atención en Stand)`, 125, currentY + 12);

    currentY += 24;

    // 4. Preparar Filas de la Tabla desglosando Variantes Compuestas
    let totalGeneral = 0;
    let totalPiezas = 0;
    const tableRows = [];
    let rowNumber = 1;

    items.forEach((item) => {
      const pPrice = Number(item.price) || 0;
      const marcaStr = item.marca ? ` [${item.marca}]` : ' [Tynor]';
      const prodName = `${item.name}${marcaStr}`;

      const variants = item.variants && item.variants.length > 0 ? item.variants : null;

      if (variants) {
        variants.forEach((v) => {
          const qty = v.quantity || 1;
          const subtotal = pPrice * qty;
          totalPiezas += qty;
          totalGeneral += subtotal;

          const colorPart = v.colorName ? ` - Color: ${v.colorName}` : '';
          const specsText = `Medida: ${v.size}${colorPart}`;

          const priceStr = pPrice > 0
            ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(pPrice)
            : 'Especial';
          const subtotalStr = pPrice > 0
            ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subtotal)
            : '-';

          tableRows.push([
            rowNumber++,
            `${qty} pz${qty > 1 ? 's' : ''}`,
            item.code || 'N/A',
            prodName,
            specsText,
            priceStr,
            subtotalStr
          ]);
        });
      } else {
        const qty = item.quantity || 1;
        const subtotal = pPrice * qty;
        totalPiezas += qty;
        totalGeneral += subtotal;

        const sizes = item.selectedSizes && item.selectedSizes.length > 0
          ? item.selectedSizes.join(', ')
          : (item.sizes ? item.sizes.join(', ') : 'Universal');

        const colorNames = item.selectedColorNames && item.selectedColorNames.length > 0
          ? item.selectedColorNames.join(', ')
          : (item.selectedColorName || '');

        const specsText = colorNames ? `Medida: ${sizes} - Color: ${colorNames}` : `Medida: ${sizes}`;

        const priceStr = pPrice > 0
          ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(pPrice)
          : 'Especial';
        const subtotalStr = pPrice > 0
          ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(subtotal)
          : '-';

        tableRows.push([
          rowNumber++,
          `${qty} pz${qty > 1 ? 's' : ''}`,
          item.code || 'N/A',
          prodName,
          specsText,
          priceStr,
          subtotalStr
        ]);
      }
    });

    // 5. Renderizar Tabla con autoTable
    autoTable(doc, {
      startY: currentY,
      head: [['#', 'Cant.', 'Código', 'Producto y Marca', 'Medida y Color', 'P. Unitario', 'Subtotal']],
      body: tableRows,
      margin: { left: 14, right: 14 },
      headStyles: {
        fillColor: primaryRgb,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'left'
      },
      styles: {
        font: 'helvetica',
        fontSize: 8,
        textColor: [15, 23, 42],
        cellPadding: 3,
        lineColor: [226, 232, 240],
        lineWidth: 0.2
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 22, fontStyle: 'bold' },
        3: { cellWidth: 58 },
        4: { cellWidth: 42 },
        5: { cellWidth: 22, halign: 'right' },
        6: { cellWidth: 20, halign: 'right', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    const finalY = doc.lastAutoTable.finalY + 8;

    // 6. Cuadro de Resumen de Totales
    const formattedTotal = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(totalGeneral);

    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.roundedRect(118, finalY, 84, 28, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Piezas totales cotizadas:', 123, finalY + 7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${totalPiezas} pieza${totalPiezas > 1 ? 's' : ''} (${items.length} modelo${items.length > 1 ? 's' : ''})`, 197, finalY + 7, { align: 'right' });

    doc.setDrawColor(203, 213, 225);
    doc.line(123, finalY + 11, 197, finalY + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.text('TOTAL ESTIMADO:', 123, finalY + 20);
    doc.setFontSize(13);
    doc.text(formattedTotal, 197, finalY + 20, { align: 'right' });

    // 7. Notas y Pie de Página
    const footerY = 255;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, footerY, 202, footerY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('CONDICIONES COMERCIALES Y DE GARANTÍA:', 14, footerY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      '• Precios expresados en Moneda Nacional (MXN). Sujetos a confirmación de existencias y condiciones comerciales al momento del pedido.\n' +
      '• Dispositivos ortopédicos fabricados bajo estándares internacionales de calidad y grado clínico.\n' +
      '• Para formalizar esta cotización, contacta a tu asesor comercial asignado o escanea el QR en tu dispositivo.',
      14,
      footerY + 9
    );

    return {
      doc,
      folio,
      totalGeneral,
      totalPiezas,
      formattedTotal,
      filename: `Cotizacion_${folio}.pdf`
    };
  },

  /**
   * Genera y descarga forzadamente el archivo PDF garantizado en Android, Windows, Mac e iOS (iPhone/iPad)
   */
  async downloadQuote(options) {
    const { doc, filename } = await this.createQuotePdf(options);

    try {
      // 1. Obtener Blob del PDF con tipo application/octet-stream para forzar descarga en iOS/Safari
      const pdfBlob = doc.output('blob');
      const forceDownloadBlob = new Blob([pdfBlob], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(forceDownloadBlob);

      // 2. Disparador de descarga vía elemento <a> con atributo download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();

      // Limpieza del DOM
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1500);

      return { success: true, filename };
    } catch (e) {
      console.warn('Fallback standard doc.save:', e);
      doc.save(filename);
      return { success: true, filename };
    }
  }
};
