import { connection, NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Keep-alive health endpoint triggered periodically by Vercel Cron
 * to prevent Supabase Free Plan 7-day inactivity auto-pause.
 */
export async function GET(request: NextRequest) {
  await connection();

  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  try {
    const supabase = createPublicClient();
    const { count, error } = await supabase
      .from("divisions")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        divisionsCount: count ?? 0,
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
