import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const docs = await db.legalDocument.findMany({
      orderBy: { enactedDate: "desc" },
    });
    return NextResponse.json(docs);
  } catch (error) {
    console.error("Failed to fetch legal documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch legal documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const doc = await db.legalDocument.create({
      data: {
        title: body.title,
        description: body.description ?? null,
        category: body.category,
        jurisdiction: body.jurisdiction ?? "Zanzibar",
        pdfUrl: body.pdfUrl,
        fileSize: body.fileSize ?? null,
        pages: body.pages ?? null,
        language: body.language ?? "English",
        referenceNumber: body.referenceNumber ?? null,
        enactedDate: body.enactedDate ? new Date(body.enactedDate) : null,
        lastAmended: body.lastAmended ? new Date(body.lastAmended) : null,
        tags: Array.isArray(body.tags) ? body.tags.join(", ") : (body.tags ?? ""),
      },
    });
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error("Failed to create legal document:", error);
    return NextResponse.json(
      { error: "Failed to create legal document" },
      { status: 500 }
    );
  }
}
