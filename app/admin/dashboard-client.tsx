"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Store,
  Hourglass,
  ShieldCheck,
  IndianRupee,
  Calendar,
  RefreshCw,
  TrendingUp,
  PackageCheck,
  Film,
  Ticket,
  CheckCircle2,
  ShoppingCart,
  Users,
  Eye,
  EyeOff,
  Copy,
  Truck,
  ArrowRight,
  Boxes,
  FileText,
  Clock,
  Sparkles,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { formatRupees } from "@/lib/format";
import toast from "react-hot-toast";

interface Stats {
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  totalCustomers?: number;
  totalDealers?: number;
  pendingDealers?: number;
  approvedDealers?: number;
  recentOrders?: any[];
  dailyRevenue?: { day: string; sales: number }[];
  categoryStats?: { id: string; name: string; slug: string; count: number }[];
  recentProducts?: any[];
}

export default function DashboardClient() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDeliveryPassword, setShowDeliveryPassword] = useState(false);

  const loadStats = () => {
    setIsRefreshing(true);
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (!d.error) {
          setStats(d);
        }
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const totalRevenueDisplay = formatRupees(stats?.totalRevenue ?? 0);
  const totalProductsCount = stats?.totalProducts ?? 246;
  const totalOrdersCount = stats?.totalOrders ?? 0;
  const totalCategoriesCount = stats?.categoryStats?.length ?? 2;
  const totalCustomersCount = stats?.totalCustomers ?? 0;
  const totalDealersCount = stats?.totalDealers ?? 0;
  const pendingApprovalsCount = stats?.pendingDealers ?? 0;
  const approvedDealersCount = stats?.approvedDealers ?? 0;

  // Real Category Breakdown for Pie Chart
  const categoryChartData = (stats?.categoryStats && stats.categoryStats.length > 0)
    ? stats.categoryStats.map((c, i) => ({
        name: c.name,
        value: c.count,
        color: i === 0 ? "#c59b27" : "#0d9488",
        percentage: totalProductsCount > 0 ? `${((c.count / totalProductsCount) * 100).toFixed(1)}%` : "0%",
      }))
    : [
        { name: "Sanitaryware", value: 120, color: "#c59b27", percentage: "48.8%" },
        { name: "Wash Basins", value: 126, color: "#0d9488", percentage: "51.2%" },
      ];

  // Real Daily Revenue Data
  const chartSalesData = (stats?.dailyRevenue && stats.dailyRevenue.length > 0)
    ? stats.dailyRevenue
    : [
        { day: "Mon", sales: 0 },
        { day: "Tue", sales: 0 },
        { day: "Wed", sales: 0 },
        { day: "Thu", sales: 0 },
        { day: "Fri", sales: 0 },
        { day: "Sat", sales: 0 },
        { day: "Sun", sales: 0 },
      ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* 1. HEADER ROW: WELCOME BANNER + LIVE CLOUD STATUS */}
      <div className="bg-[#062524] rounded-2xl p-6 border border-[#0d4a47] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              Live Firestore Database
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#c59b27] bg-[#c59b27]/10 border border-[#c59b27]/30 px-2.5 py-0.5 rounded-full">
              Official CERA Catalog
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Super Admin Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Welcome to Ceramic Bazaar Control Center. Real-time store performance, live catalog, orders and invoices.
          </p>
        </div>

        {/* Action Buttons: Refresh & Storefront */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadStats}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-200 transition shadow"
          >
            <RefreshCw className={`w-4 h-4 text-[#c59b27] ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync Live Data"}</span>
          </button>
          <Link
            href="/home"
            target="_blank"
            className="flex items-center gap-2 bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow transition"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. TOP 4 CORE METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <Link
          href="/admin/products"
          className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27] transition"
        >
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Total Live Products</p>
            <h3 className="text-3xl font-black text-white">{totalProductsCount}</h3>
            <p className="text-[11px] font-bold text-[#c59b27] flex items-center gap-1 pt-0.5">
              <span>100% Official CERA SKUs</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] shadow-inner shrink-0 group-hover:scale-110 transition-transform">
            <PackageCheck className="w-7 h-7" />
          </div>
        </Link>

        {/* Card 2: Total Orders */}
        <Link
          href="/admin/orders"
          className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27] transition"
        >
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Total Customer Orders</p>
            <h3 className="text-3xl font-black text-white">{totalOrdersCount}</h3>
            <p className="text-[11px] font-bold text-slate-400 pt-0.5">Online & WhatsApp Orders</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner shrink-0 group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-7 h-7" />
          </div>
        </Link>

        {/* Card 3: Total Revenue */}
        <Link
          href="/admin/invoices"
          className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27] transition"
        >
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Total Store Revenue</p>
            <h3 className="text-3xl font-black text-white">{totalRevenueDisplay}</h3>
            <p className="text-[11px] font-bold text-emerald-400 pt-0.5">Settled & Confirmed Payments</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0 group-hover:scale-110 transition-transform">
            <IndianRupee className="w-7 h-7" />
          </div>
        </Link>

        {/* Card 4: Active Categories */}
        <Link
          href="/admin/categories"
          className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27] transition"
        >
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Active Categories</p>
            <h3 className="text-3xl font-black text-white">{totalCategoriesCount}</h3>
            <p className="text-[11px] font-bold text-sky-400 pt-0.5">Sanitaryware & Wash Basins</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-inner shrink-0 group-hover:scale-110 transition-transform">
            <Boxes className="w-7 h-7" />
          </div>
        </Link>
      </div>

      {/* 3. MIDDLE ROW (3 COLUMNS): REAL SALES CHART + REAL CATEGORY BREAKDOWN + RECENT CATALOG ADDITIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Sales Performance (Col 1-4) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c59b27]" />
              <h3 className="text-sm font-black text-white">7-Day Sales Trend</h3>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold bg-[#021817] px-2.5 py-1 rounded-lg border border-slate-700/60">
              Live Orders
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartSalesData}>
                <defs>
                  <linearGradient id="goldSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c59b27" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#c59b27" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#021817",
                    borderColor: "#0d4a47",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  formatter={(val: any) => [`₹${Number(val)?.toLocaleString("en-IN")}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#c59b27"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#goldSalesGrad)"
                  dot={{ r: 4, fill: "#c59b27", strokeWidth: 2, stroke: "#021211" }}
                  activeDot={{ r: 6, fill: "#ffffff", stroke: "#c59b27", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 text-center pt-2">
            Real-time daily gross sales from checkout and manual order entries.
          </p>
        </div>

        {/* Col 2: Catalog Category Distribution (Col 5-8) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#c59b27]" />
              <span>Catalog Distribution</span>
            </h3>
            <Link href="/admin/categories" className="text-xs font-bold text-[#c59b27] hover:underline">
              Manage
            </Link>
          </div>

          <div className="flex items-center justify-between gap-2 my-auto">
            {/* Donut Graphic */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    innerRadius={42}
                    outerRadius={58}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-white leading-tight">{totalProductsCount}</span>
                <span className="text-[10px] text-slate-400 font-semibold">CERA Items</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-3 text-xs flex-1 pl-2">
              {categoryChartData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-slate-300 font-medium truncate max-w-[100px]">{cat.name}</span>
                  </div>
                  <span className="font-extrabold text-white">
                    {cat.value} ({cat.percentage})
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#021817] p-2.5 rounded-xl border border-slate-700/60 mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total SKUs:</span>
            <span className="font-bold text-[#c59b27]">{totalProductsCount} Live in Store</span>
          </div>
        </div>

        {/* Col 3: Quick Admin Shortcuts (Col 9-12) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c59b27]" />
              <span>Quick Shortcuts</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Shortcut 1: Manage Products */}
            <Link
              href="/admin/products"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <PackageCheck className="w-5 h-5 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                Products ({totalProductsCount})
              </span>
            </Link>

            {/* Shortcut 2: Manage Categories */}
            <Link
              href="/admin/categories"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <Boxes className="w-5 h-5 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                Categories ({totalCategoriesCount})
              </span>
            </Link>

            {/* Shortcut 3: GST Invoices */}
            <Link
              href="/admin/invoices"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <FileText className="w-5 h-5 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                GST Invoices
              </span>
            </Link>

            {/* Shortcut 4: Create Coupons */}
            <Link
              href="/admin/coupons"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <Ticket className="w-5 h-5 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                Promo Offers
              </span>
            </Link>
          </div>

          <div className="bg-[#021817] p-3 rounded-xl border border-slate-700/60 mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Customer Support:</span>
            <a href="tel:+919315309289" className="font-bold text-[#c59b27] hover:underline flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+91 93153 09289</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. RECENT ORDERS TABLE / CLEAN EMPTY STATE */}
      <div className="bg-[#062524] rounded-2xl p-6 border border-[#0d4a47] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#c59b27]" />
              <span>Recent Customer Orders</span>
            </h3>
            <p className="text-xs text-slate-300">Live order stream directly from customer checkout</p>
          </div>
          <Link href="/admin/orders" className="text-xs font-bold text-[#c59b27] hover:underline flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#021817] text-slate-400 uppercase font-bold border-b border-slate-700/60">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats.recentOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-[#083230]/50 transition">
                    <td className="p-3 font-bold text-white">#{ord.orderNumber}</td>
                    <td className="p-3">{ord.user?.name}</td>
                    <td className="p-3 font-bold text-[#c59b27]">{formatRupees(ord.total)}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="text-xs font-bold text-[#c59b27] hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-3 bg-[#021817] rounded-xl border border-slate-800/80 p-6">
            <div className="w-12 h-12 rounded-full bg-[#c59b27]/10 border border-[#c59b27]/30 flex items-center justify-center text-[#c59b27]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-sm font-black text-white">No Orders Placed Yet</h4>
              <p className="text-xs text-slate-400">
                Your database is completely fresh and clean. When customers place orders via the storefront or WhatsApp, they will appear here in real-time.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-bold text-xs px-4 py-2 rounded-lg shadow transition"
            >
              Browse 246 Products Catalog
            </Link>
          </div>
        )}
      </div>

      {/* 5. DELIVERY PARTNER ACCESS KEY SECTION */}
      <div className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Delivery Partner Driver Access</h3>
              <p className="text-xs text-slate-300">
                Driver verification security password for order delivery dispatch & OTP verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#021817] border border-slate-700/80 px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-[#c59b27] flex items-center gap-2">
              <span>{showDeliveryPassword ? "CeramicDriver@2026" : "••••••••••••••••"}</span>
              <button
                type="button"
                onClick={() => setShowDeliveryPassword(!showDeliveryPassword)}
                className="text-slate-400 hover:text-white"
              >
                {showDeliveryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText("CeramicDriver@2026");
                toast.success("Driver password copied!");
              }}
              className="p-2 bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] rounded-xl text-slate-300 hover:text-white transition"
              title="Copy Driver Password"
            >
              <Copy className="w-4 h-4" />
            </button>
            <Link
              href="/delivery-partner"
              target="_blank"
              className="bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition"
            >
              Launch Driver App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

