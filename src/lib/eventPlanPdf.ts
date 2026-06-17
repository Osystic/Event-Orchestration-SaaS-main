/** Event plan PDF generation using jsPDF + jspdf-autotable. */

export interface EventPlanPdfData {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  venue?: string;
  location?: string;
  budget?: number;
  expectedAttendees?: number;
  status?: string;
  themeName?: string;
  tasks: {
    title: string;
    status?: string;
    priority?: string;
    assignedTo?: string;
    dueDate?: string;
  }[];
  budgetItems: {
    category?: string;
    description?: string;
    estimatedCost?: number;
    actualCost?: number;
    vendorName?: string;
  }[];
  suppliers: {
    businessName: string;
    category?: string;
  }[];
  changeRequests: {
    createdAt: string;
    description?: string;
    fieldChanged?: string;
    status?: string;
    priorityTag?: string;
  }[];
}

export async function downloadEventPlanPdf(data: EventPlanPdfData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = 48;

  const ensureSpace = (needed: number) => {
    const h = doc.internal.pageSize.getHeight();
    if (y + needed > h - 50) {
      doc.addPage();
      y = 48;
    }
  };

  const section = (label: string) => {
    ensureSpace(36);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(label, margin, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
  };

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(data.title || "Event Plan", margin, y);
  y += 28;

  // Event details
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (data.startDate) {
    doc.text(`Date: ${data.startDate}${data.endDate ? ` – ${data.endDate}` : ""}`, margin, y);
    y += 14;
  }
  if (data.venue) {
    doc.text(`Venue: ${data.venue}`, margin, y);
    y += 14;
  }
  if (data.location) {
    doc.text(`Location: ${data.location}`, margin, y);
    y += 14;
  }
  if (data.budget != null) {
    doc.text(`Budget: $${Number(data.budget).toLocaleString()}`, margin, y);
    y += 14;
  }
  if (data.expectedAttendees != null) {
    doc.text(`Expected Attendees: ${data.expectedAttendees}`, margin, y);
    y += 14;
  }
  if (data.status) {
    doc.text(`Status: ${data.status}`, margin, y);
    y += 14;
  }
  if (data.themeName && data.themeName !== "—") {
    doc.text(`Theme: ${data.themeName}`, margin, y);
    y += 14;
  }
  if (data.description) {
    doc.text(`Description: ${data.description}`, margin, y);
    y += 14;
  }
  y += 12;

  // Tasks section
  if (data.tasks.length > 0) {
    section("Tasks");
    autoTable(doc, {
      startY: y,
      head: [["Task", "Status", "Priority", "Assigned To", "Due Date"]],
      body: data.tasks.map((t) => [
        t.title || "—",
        t.status || "—",
        t.priority || "—",
        t.assignedTo || "—",
        t.dueDate || "—",
      ]),
      styles: { fontSize: 8, overflow: "linebreak", cellWidth: "wrap" },
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable?.finalY + 24;
  }

  // Budget section
  if (data.budgetItems.length > 0) {
    section("Budget Items");
    autoTable(doc, {
      startY: y,
      head: [["Category", "Description", "Estimated", "Actual", "Vendor"]],
      body: data.budgetItems.map((b) => [
        b.category || "—",
        b.description || "—",
        b.estimatedCost != null ? `$${Number(b.estimatedCost).toLocaleString()}` : "—",
        b.actualCost != null ? `$${Number(b.actualCost).toLocaleString()}` : "—",
        b.vendorName || "—",
      ]),
      styles: { fontSize: 8, overflow: "linebreak", cellWidth: "wrap" },
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable?.finalY + 24;
  }

  // Suppliers section
  if (data.suppliers.length > 0) {
    section("Suppliers");
    autoTable(doc, {
      startY: y,
      head: [["Business Name", "Category"]],
      body: data.suppliers.map((s) => [s.businessName || "—", s.category || "—"]),
      styles: { fontSize: 8, overflow: "linebreak", cellWidth: "wrap" },
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable?.finalY + 24;
  }

  // Change Requests section
  if (data.changeRequests.length > 0) {
    ensureSpace(60);
    section("Change Requests");
    autoTable(doc, {
      startY: y,
      head: [["Date", "Description", "Field", "Status", "Priority"]],
      body: data.changeRequests.map((c) => [
        c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—",
        c.description || "—",
        c.fieldChanged || "—",
        c.status || "—",
        c.priorityTag || "—",
      ]),
      styles: { fontSize: 8, overflow: "linebreak", cellWidth: "wrap" },
      headStyles: { fillColor: [66, 66, 66] },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable?.finalY + 24;
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text("Event Orchestration — Ida Event Partners", margin, pageHeight - 28);
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
    margin,
    pageHeight - 16
  );

  const slug = data.title
    ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)
    : "event-plan";
  doc.save(`event-plan-${slug}.pdf`);
}
