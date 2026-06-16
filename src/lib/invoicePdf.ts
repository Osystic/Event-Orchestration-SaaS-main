/** Invoice / receipt PDF generation using jsPDF + jspdf-autotable. */

export interface InvoicePdfData {
  invoiceNumber: string;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  billingPeriodStart: string | null;
  billingPeriodEnd: string | null;
  userName?: string;
  userEmail?: string;
}

export async function downloadInvoicePdf(data: InvoicePdfData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = 48;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", margin, y);
  y += 30;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Invoice #: ${data.invoiceNumber}`, margin, y);
  y += 16;
  doc.text(
    `Date: ${data.paidAt ? new Date(data.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    margin,
    y
  );
  y += 16;

  const statusColor =
    data.status === "paid"
      ? [34, 197, 94]
      : data.status === "overdue"
        ? [239, 68, 68]
        : [234, 179, 8];
  doc.setTextColor(...(statusColor as [number, number, number]));
  doc.setFont("helvetica", "bold");
  doc.text(`Status: ${data.status.toUpperCase()}`, margin, y);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  y += 30;

  // Bill to
  if (data.userName || data.userEmail) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To", margin, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (data.userName) {
      doc.text(data.userName, margin, y);
      y += 14;
    }
    if (data.userEmail) {
      doc.text(data.userEmail, margin, y);
      y += 14;
    }
    y += 16;
  }

  // Line items table
  autoTable(doc, {
    startY: y,
    head: [["Description", "Amount"]],
    body: [
      [
        `${data.planName.charAt(0).toUpperCase() + data.planName.slice(1)} Plan Subscription${data.billingPeriodStart && data.billingPeriodEnd ? ` (${new Date(data.billingPeriodStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(data.billingPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})` : ""}`,
        `$${data.amount.toFixed(2)} ${data.currency.toUpperCase()}`,
      ],
    ],
    styles: { fontSize: 10, overflow: "linebreak" },
    headStyles: { fillColor: [66, 66, 66] },
    margin: { left: margin, right: margin },
  });

  const finalY = (doc as any).lastAutoTable?.finalY ?? y + 40;

  // Total
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Total:", margin, finalY + 24);
  doc.text(`$${data.amount.toFixed(2)} ${data.currency.toUpperCase()}`, margin + 200, finalY + 24);

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(
    "Thank you for your payment. This receipt serves as your invoice.",
    margin,
    pageHeight - 40
  );
  doc.text(
    "Event Orchestration — Ida Event Partners",
    margin,
    pageHeight - 28
  );

  doc.save(`invoice-${data.invoiceNumber}.pdf`);
}
