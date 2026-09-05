import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-check";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const [
    totalOrdersCount,
    totalRevenueRow,
    totalProducts,
    totalCustomers,
    totalDealers,
    pendingDealers,
    approvedDealers,
    recentOrders,
    allOrders,
    categories,
    recentProducts
  ] = await Promise.all([
    prisma.order.count({ where: { status: { not: "PENDING_PAYMENT" } } }),
    prisma.order.aggregate({
      where: { status: { not: "PENDING_PAYMENT" } },
      _sum: { total: true },
    }),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "DEALER" } }),
    prisma.user.count({ where: { role: "DEALER", status: "PENDING" } }),
    prisma.user.count({ where: { role: "DEALER", status: "APPROVED" } }),
    prisma.order.findMany({
      where: { status: { not: "PENDING_PAYMENT" } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { user: { select: { fullName: true } } },
    }),
    prisma.order.findMany({
      where: {
        status: { not: "PENDING_PAYMENT" },
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
      select: { total: true, createdAt: true },
    }),
    prisma.category.findMany({ include: { _count: { select: { products: true } } } }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // Daily revenue (last 7 days)
  const dailyMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    dailyMap[key] = 0;
  }
  for (const o of allOrders) {
    const dateObj = new Date(o.createdAt);
    const key = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    if (dailyMap[key] != null) dailyMap[key] += Number(o.total) || 0;
  }
  const dailyRevenue = Object.entries(dailyMap).map(([day, sales]) => ({ day, sales }));

  return NextResponse.json({
    totalRevenue: totalRevenueRow._sum.total ?? 0,
    totalOrders: totalOrdersCount ?? 0,
    totalProducts: totalProducts ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalDealers: totalDealers ?? 0,
    pendingDealers: pendingDealers ?? 0,
    approvedDealers: approvedDealers ?? 0,
    recentOrders: recentOrders.map((o: any) => ({
      id: o.id,
      orderNumber: o.orderNumber || o.id?.slice(-8)?.toUpperCase() || "ORD",
      status: o.status || "CONFIRMED",
      total: o.total || 0,
      createdAt: o.createdAt,
      user: { name: o.user?.fullName || o.customerName || "Customer" },
    })),
    dailyRevenue,
    categoryStats: categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      count: c._count?.products ?? 0,
    })),
    recentProducts: recentProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      brand: p.brand || "CERA",
      category: p.specs?.Category || "Sanitaryware",
      createdAt: p.createdAt,
    })),
  });
}
