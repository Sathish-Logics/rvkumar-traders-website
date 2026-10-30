// Generates an owner-authorized professional quotation PDF from stored snapshots.
import "server-only";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getQuotation } from "@/services/operations.service";

export async function generateQuotationPdf(id: string) {
  const quotation = await getQuotation(id);
  if (!quotation) return null;
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const navy = rgb(0.04, 0.15, 0.23);
  const orange = rgb(0.9, 0.35, 0.06);
  let y = 790;
  const text = (value: string, x: number, size = 10, font = regular) => {
    page.drawText(value.replaceAll("₹", "INR "), { x, y, size, font, color: navy });
  };

  text("RVKUMAR TRADERS", 45, 20, bold);
  page.drawText("QUOTATION", { x: 430, y, size: 16, font: bold, color: orange });
  y -= 24;
  text("Aathipatti, Aruppukottai Taluk, Virudhunagar District - 626101", 45, 9);
  y -= 34;
  text(`Reference: ${quotation.reference}`, 45, 11, bold);
  text(`Version: ${quotation.version}`, 430, 10);
  y -= 18;
  text(`Customer: ${quotation.customer.name}`, 45, 10);
  text(`Enquiry: ${quotation.enquiry.reference}`, 340, 10);
  y -= 30;
  page.drawLine({
    start: { x: 45, y },
    end: { x: 550, y },
    thickness: 1,
    color: orange,
  });
  y -= 20;
  text("Description", 45, 9, bold);
  text("Qty", 285, 9, bold);
  text("Rate", 350, 9, bold);
  text("Tax", 420, 9, bold);
  text("Total", 490, 9, bold);
  y -= 12;
  page.drawLine({
    start: { x: 45, y },
    end: { x: 550, y },
    thickness: 0.5,
    color: rgb(0.8, 0.82, 0.84),
  });
  for (const item of quotation.items) {
    y -= 20;
    text(item.description.slice(0, 42), 45, 9);
    text(`${item.quantity.toString()} ${item.unit}`, 285, 9);
    text(`INR ${item.unitRate.toString()}`, 350, 9);
    text(`${item.taxRate.toString()}%`, 420, 9);
    text(`INR ${item.lineTotal.toString()}`, 490, 9);
  }
  y -= 24;
  page.drawLine({
    start: { x: 330, y },
    end: { x: 550, y },
    thickness: 0.5,
    color: rgb(0.8, 0.82, 0.84),
  });
  y -= 18;
  text("Subtotal", 380, 9);
  text(`INR ${quotation.subtotal.toString()}`, 490, 9, bold);
  y -= 16;
  text("Tax", 380, 9);
  text(`INR ${quotation.taxTotal.toString()}`, 490, 9, bold);
  y -= 16;
  text("Transport", 380, 9);
  text(`INR ${quotation.transportationCharge.toString()}`, 490, 9, bold);
  y -= 16;
  text("Discount", 380, 9);
  text(`INR ${quotation.discountAmount.toString()}`, 490, 9, bold);
  y -= 22;
  page.drawText("Grand total", { x: 380, y, size: 11, font: bold, color: orange });
  text(`INR ${quotation.grandTotal.toString()}`, 475, 11, bold);
  y -= 46;
  if (quotation.validUntil) {
    text(
      `Valid until: ${quotation.validUntil.toLocaleDateString("en-IN")}`,
      45,
      9,
      bold,
    );
    y -= 18;
  }
  if (quotation.paymentTerms) {
    text(`Payment terms: ${quotation.paymentTerms}`.slice(0, 95), 45, 9);
    y -= 18;
  }
  if (quotation.deliveryTerms) {
    text(`Delivery terms: ${quotation.deliveryTerms}`.slice(0, 95), 45, 9);
    y -= 18;
  }
  text(
    "This quotation becomes an order only after acceptance and separate confirmation.",
    45,
    9,
    bold,
  );
  return { bytes: await pdf.save(), reference: quotation.reference };
}
