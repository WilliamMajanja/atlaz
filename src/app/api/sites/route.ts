import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { saveSiteSchema } from "@/lib/validation";

export async function GET() {
  try {
    const sites = await db.savedSite.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json(sites);
  } catch (error) {
    console.error("Failed to fetch sites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = saveSiteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, latitude, longitude, description, tags } = parsed.data;

    const site = await db.savedSite.create({
      data: {
        name: name ?? `Site at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        latitude,
        longitude,
        description,
        tags: Array.isArray(tags) ? tags.join(", ") : (tags ?? ""),
      },
    });

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    console.error("Failed to save site:", error);
    return NextResponse.json(
      { error: "Failed to save site" },
      { status: 500 }
    );
  }
}
