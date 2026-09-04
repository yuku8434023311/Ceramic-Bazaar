import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { sendDiscordNotification } from "@/lib/discord";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      fullName,
      securityQuestion,
      securityAnswer,
      phone,
      role = "CUSTOMER",
      shopName,
      shopAddress,
      gstNumber,
    } = body ?? {};

    if (!email || !password || !fullName || !securityQuestion || !securityAnswer || !phone) {
      return NextResponse.json({ error: "All required fields must be provided" }, { status: 400 });
    }

    if (role === "DEALER" && (!shopName || !shopAddress)) {
      return NextResponse.json({ error: "Shop Name and Shop Address are required for Dealers" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(String(securityAnswer).toLowerCase().trim(), 10);

    const isDealer = role === "DEALER";
    const hasGst = isDealer && Boolean(gstNumber && String(gstNumber).trim().length > 0);
    const status = isDealer ? (hasGst ? "APPROVED" : "PENDING") : "APPROVED";

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        fullName,
        phone,
        securityQuestion,
        securityAnswer: hashedAnswer,
        role: isDealer ? "DEALER" : "CUSTOMER",
        shopName: isDealer ? shopName : null,
        shopAddress: isDealer ? shopAddress : null,
        gstNumber: isDealer ? (gstNumber ? String(gstNumber).trim().toUpperCase() : null) : null,
        status,
      },
    });

    // Trigger Discord Notification
    if (isDealer) {
      sendDiscordNotification({
        title: "🏬 New Dealer Registered for Ceramic Bazaar!",
        description: `Dealer ${shopName} registered. Super Admin verification pending.`,
        color: 3066993,
        fields: [
          { name: "Shop Name", value: shopName, inline: true },
          { name: "Owner Name", value: fullName, inline: true },
          { name: "Phone Number", value: phone, inline: true },
          { name: "Email", value: normalizedEmail, inline: true },
          { name: "Status", value: status, inline: true },
        ],
      });
    } else {
      sendDiscordNotification({
        title: "👤 New Customer Registered!",
        description: `A new customer has signed up on Ceramic Bazaar.`,
        color: 1752220,
        fields: [
          { name: "Full Name", value: user.fullName, inline: true },
          { name: "Email Address", value: user.email, inline: true },
          { name: "Mobile Number", value: user.phone || 'N/A', inline: true },
        ],
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      message: isDealer && status === "PENDING"
        ? "Dealer account registered! Super Admin will verify and activate your account shortly."
        : "Account created successfully!"
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to signup" }, { status: 500 });
  }
}
