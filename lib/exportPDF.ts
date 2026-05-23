import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { REVIEW_TYPE_LABELS, Review, ReviewType } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

function resolveReviewType(review: Review): string {
  if (review.reviewType && review.reviewType in REVIEW_TYPE_LABELS) {
    return REVIEW_TYPE_LABELS[review.reviewType as ReviewType];
  }
  const match = review.notes?.match(/^\[(daily|weekly|monthly)\]/i);
  if (match && match[1] in REVIEW_TYPE_LABELS) {
    return REVIEW_TYPE_LABELS[match[1] as ReviewType];
  }
  return '—';
}

export function exportReviewsPDF(reviews: Review[], title = 'Reviews Report') {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);

  autoTable(doc, {
    startY: 32,
    head: [['Subject', 'Type', 'Hours', 'Amount', 'Date', 'Notes']],
    body: reviews.map((r) => [
      r.subjectName,
      resolveReviewType(r),
      String(r.hours),
      formatCurrency(r.finalAmount),
      formatDate(r.date),
      r.notes || '',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [16, 185, 129] },
  });

  doc.save('reviews.pdf');
}
