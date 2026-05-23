import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Review, REVIEW_TYPE_LABELS, ReviewStats } from '@/types';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export function exportReviewsPDF(
  reviews: Review[],
  stats: ReviewStats,
  month: number,
  year: number,
) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  // ── Header ──────────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);          // slate-900
  doc.rect(0, 0, 297, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('Review Tracker', 14, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);       // slate-400
  doc.text(`Report Period: ${monthLabel}`, 14, 21);

  const today = new Date().toLocaleDateString('en-US', { dateStyle: 'long' });
  doc.text(`Generated: ${today}`, 283, 21, { align: 'right' });

  // ── Stats row ────────────────────────────────────────────────────────────
  const statItems = [
    { label: 'Total Reviews',       value: stats.total_review,        color: [99,  102, 241] as [number,number,number] },
    { label: 'Single Sessions',     value: stats.total_session,       color: [16,  185, 129] as [number,number,number] },
    { label: 'Group Sessions',      value: stats.total_group_session, color: [245, 158, 11]  as [number,number,number] },
    { label: 'Group Projects',      value: stats.total_group_project, color: [239, 68,  68]  as [number,number,number] },
  ];

  const cardW = 64, cardH = 22, cardY = 33, startX = 14;
  statItems.forEach((s, i) => {
    const x = startX + i * (cardW + 4);
    doc.setFillColor(...s.color);
    doc.roundedRect(x, cardY, cardW, cardH, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text(String(s.value), x + cardW / 2, cardY + 13, { align: 'center' });
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 230, 255);
    doc.text(s.label.toUpperCase(), x + cardW / 2, cardY + 19, { align: 'center' });
  });

  // ── Table ────────────────────────────────────────────────────────────────
  autoTable(doc, {
    startY: 62,
    head: [['#', 'Intern Name', 'Type', 'Advisor', 'Date', 'Notes']],
    body: [...reviews].reverse().map((r, idx) => [
      idx + 1,
      r.intern_name,
      REVIEW_TYPE_LABELS[r.type],
      r.advisor_name,
      new Date(r.review_date).toLocaleDateString('en-US', { dateStyle: 'medium' }),
      r.notes ?? '—',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { cellWidth: 32 },
      4: { cellWidth: 30 },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ───────────────────────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, 283, 205, { align: 'right' });
  }

const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    const newTab = window.open(url, '_blank');
    if (!newTab) window.location.href = url;
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = `review-tracker-${year}-${String(month).padStart(2, '0')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
