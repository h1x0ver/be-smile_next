import { NextRequest, NextResponse } from "next/server";
import { searchSite, type Lang } from "@/lib/directus";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const lang = (searchParams.get("lang") || "ru") as Lang;

    const results = await searchSite(q, lang);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("❌ /api/search ERROR:", error);
    return NextResponse.json({ results: [] }, { status: 200 });
  }
}