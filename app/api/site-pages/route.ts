import { NextResponse } from "next/server";
import { getAllSiteUrls } from "@/lib/siteUrls";

export async function GET() {
  const pages = await getAllSiteUrls();

  return NextResponse.json({
    count: pages.length,
    pages,
  });
}