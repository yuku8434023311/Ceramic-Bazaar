import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), "public", "ceramic-bazaar.apk");

    if (!fs.existsSync(filePath)) {
      return NextResponse.redirect(new URL("/ceramic-bazaar.apk", request.url));
    }

    const fileStat = await fs.promises.stat(filePath);
    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="ceramic-bazaar.apk"',
        "Content-Length": fileStat.size.toString(),
        "Cache-Control": "public, max-age=86400, must-revalidate",
      },
    });
  } catch (error) {
    console.error("[Download APK API Error]:", error);
    return NextResponse.redirect(new URL("/ceramic-bazaar.apk", request.url));
  }
}
