// Exports one owner-authorized quotation as a generated PDF document.
import { requireActiveAdmin } from "@/lib/auth";
import { generateQuotationPdf } from "@/lib/quotation-pdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireActiveAdmin();
  const { id } = await params;
  const document = await generateQuotationPdf(id);
  if (!document)
    return Response.json({ error: "Quotation not found" }, { status: 404 });
  return new Response(Buffer.from(document.bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${document.reference}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
