// app/api/upload/route.ts
import { PDFDocument } from 'pdf-lib';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // Basic metadata only
    return NextResponse.json({
      message: "PDF uploaded successfully",
      fileName: file.name,
      pageCount: pages.length,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
  }
}
