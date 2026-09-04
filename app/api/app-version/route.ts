import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    version: "2.0.0",
    minVersion: "2.0.0",
    apkUrl: "https://yuvraj.electrobazaars.com/app-release.apk",
    releaseNotes: "Direct WhatsApp Support Integration, 100% Android URL scheme error fixes, and performance improvements.",
    forceUpdate: true,
  });
}
