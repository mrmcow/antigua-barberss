import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side image proxy for Google Places photos.
 *
 * Fetches barbershop images server-side so the Google API key referrer
 * restrictions never block them (applies to both localhost and production).
 *
 * Usage: /api/photo?url=<encoded Google Places photo URL>
 * Cache: 7 days via Cache-Control (photos rarely change)
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only proxy Google Places photo URLs — block anything else
  if (!url.startsWith("https://maps.googleapis.com/maps/api/place/photo")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const upstream = await fetch(url, {
      // Follow the 302 redirect Google Places returns
      redirect: "follow",
      headers: {
        // No Referer header → bypasses any API key referrer restrictions
        "User-Agent": "AntiguaBarbers/1.0",
      },
      // Next.js fetch cache: revalidate once per week
      next: { revalidate: 604800 },
    });

    if (!upstream.ok) {
      return new NextResponse("Upstream error", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache aggressively — 7 days browser + 7 days CDN (Vercel)
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
