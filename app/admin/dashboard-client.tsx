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
  Search,
  Filter,
  Calendar,
  ChevronDown,
  TrendingUp,
  PackageCheck,
  Film,
  Ticket,
  CheckCircle2,
  ShoppingCart,
  UserCheck,
  Eye,
  EyeOff,
  Copy,
  KeyRound,
  Download,
  Truck,
} from "lucide-react";
import { formatRupees } from "@/lib/format";
import toast from "react-hot-toast";

interface Stats {
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  totalCustomers?: number;
  recentOrders?: any[];
  dailyRevenue?: { date: string; revenue: number }[];
  categoryStats?: { name: string; count: number }[];
}

const DEFAULT_SALES_DATA = [
  { day: "26 May", sales: 25000 },
  { day: "27 May", sales: 48000 },
  { day: "28 May", sales: 38000 },
  { day: "29 May", sales: 68000 },
  { day: "30 May", sales: 52000 },
  { day: "31 May", sales: 95000 },
  { day: "01 Jun", sales: 56000 },
];

const DONUT_DATA = [
  { name: "Approved Dealers", value: 110, color: "#10b981", percentage: "85.9%" },
  { name: "Pending Approvals", value: 18, color: "#f59e0b", percentage: "14.1%" },
  { name: "Rejected Dealers", value: 0, color: "#3b82f6", percentage: "0%" },
];

export default function DashboardClient() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [salesTimeframe, setSalesTimeframe] = useState("This Week");
  const [showDeliveryPassword, setShowDeliveryPassword] = useState(false);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenueDisplay =
    stats?.totalRevenue && stats.totalRevenue > 0
      ? formatRupees(stats.totalRevenue)
      : "₹2,45,780";

  const totalDealersCount = 128;
  const pendingApprovalsCount = 18;
  const approvedDealersCount = 110;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* 1. HEADER ROW: TITLE + DATE RANGE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <span>Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
            Welcome back, Super Admin! Here's what's happening with Ceramic Bazaar today.
          </p>
        </div>

        {/* Date Selector Filter */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-[#062524] hover:bg-[#0a3533] border border-[#0d4a47] rounded-xl px-4 py-2 text-xs sm:text-sm font-bold text-slate-200 shadow-sm transition">
            <Calendar className="w-4 h-4 text-[#c59b27]" />
            <span>26 May - 01 Jun 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. TOP 4 KEY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Registered Dealers */}
        <div className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27]/40 transition">
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Total Registered Dealers</p>
            <h3 className="text-3xl font-black text-white">{totalDealersCount}</h3>
            <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pt-0.5">
              <span>↑ 12%</span>
              <span className="text-slate-400 font-normal">from last week</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27] shadow-inner shrink-0">
            <Store className="w-7 h-7" />
          </div>
        </div>

        {/* Card 2: Pending Approvals */}
        <div className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27]/40 transition">
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Pending Approvals</p>
            <h3 className="text-3xl font-black text-white">{pendingApprovalsCount}</h3>
            <p className="text-[11px] font-bold text-[#c59b27] pt-0.5">Requires your action</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <Hourglass className="w-7 h-7" />
          </div>
        </div>

        {/* Card 3: Approved Dealers */}
        <div className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27]/40 transition">
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Approved Dealers</p>
            <h3 className="text-3xl font-black text-white">{approvedDealersCount}</h3>
            <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pt-0.5">
              <span>↑ 8%</span>
              <span className="text-slate-400 font-normal">from last week</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Card 4: Total Dealer Sales */}
        <div className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] flex items-center justify-between shadow-xl relative overflow-hidden group hover:border-[#c59b27]/40 transition">
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-300">Total Dealer Sales</p>
            <h3 className="text-3xl font-black text-white">{totalRevenueDisplay}</h3>
            <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pt-0.5">
              <span>↑ 15.6%</span>
              <span className="text-slate-400 font-normal">from last week</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-inner shrink-0">
            <IndianRupee className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTER BAR */}
      <div className="bg-[#062524] rounded-2xl p-3 border border-[#0d4a47] flex flex-col md:flex-row items-center gap-3 shadow-xl">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by shop name, owner, or phone..."
            className="w-full bg-[#021817] border border-slate-700/80 rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c59b27] focus:ring-1 focus:ring-[#c59b27] transition"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-auto flex items-center gap-2 shrink-0">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#021817] border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 focus:outline-none focus:border-[#c59b27] appearance-none cursor-pointer pr-9 relative w-full md:w-auto"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
            }}
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Filter Button */}
          <button className="bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow flex items-center justify-center gap-2 transition shrink-0">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 4. MIDDLE ROW (3 COLUMNS): SALES OVERVIEW + DEALER STATUS + RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Sales Overview Wave Chart (Col 1-4) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#c59b27]" />
              <h3 className="text-sm font-black text-white">Sales Overview</h3>
            </div>
            <button className="text-xs text-slate-300 bg-[#021817] border border-slate-700/80 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold">
              <span>{salesTimeframe}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Chart View */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEFAULT_SALES_DATA}>
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
                  tickFormatter={(val) => `₹${val / 1000}k`}
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
                  formatter={(val: any) => [`₹${val?.toLocaleString("en-IN")}`, "Sales"]}
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
        </div>

        {/* Col 2: Dealer Status Overview (Donut Chart) (Col 5-8) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Store className="w-4 h-4 text-[#c59b27]" />
              <span>Dealer Status Overview</span>
            </h3>
          </div>

          <div className="flex items-center justify-between gap-2 my-auto">
            {/* Donut Graphic */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DONUT_DATA}
                    innerRadius={42}
                    outerRadius={58}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {DONUT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-white leading-tight">128</span>
                <span className="text-[10px] text-slate-400 font-semibold">Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-2.5 text-xs flex-1 pl-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">Approved Dealers</span>
                </div>
                <span className="font-extrabold text-white">110 (85.9%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">Pending Approvals</span>
                </div>
                <span className="font-extrabold text-white">18 (14.1%)</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">Rejected Dealers</span>
                </div>
                <span className="font-extrabold text-white">0 (0%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Recent Activities (Col 9-12) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-white">Recent Activities</h3>
            <Link
              href="/admin/activities"
              className="text-xs font-bold text-[#c59b27] hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Activity Items List */}
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 truncate">
                  Dealer "Shree Ram Tiles" approved
                </p>
                <p className="text-[10px] text-slate-400">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Hourglass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 truncate">
                  New dealer "Kumar Traders" pending approval
                </p>
                <p className="text-[10px] text-slate-400">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShoppingCart className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 truncate">
                  New order received from "Aman Tiles"
                </p>
                <p className="text-[10px] text-slate-400">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 truncate">
                  Product "Premium Wall Tiles" approved
                </p>
                <p className="text-[10px] text-slate-400">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-200 truncate">
                  New dealer registered "Maa Durga Traders"
                </p>
                <p className="text-[10px] text-slate-400">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM ROW (3 COLUMNS): TOP CATEGORIES + TOP DEALERS + QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Top Selling Categories (Col 1-4) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white">Top Selling Categories</h3>
            <Link
              href="/admin/categories"
              className="text-xs font-bold text-[#c59b27] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            {/* Category 1: Tiles */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#021817] border border-[#0d4a47] flex items-center justify-center text-[#c59b27]">
                    🪟
                  </div>
                  <div>
                    <p className="font-extrabold text-white">Tiles</p>
                    <p className="text-[10px] text-slate-400">1,245 Orders</p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-200">42%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#021817] overflow-hidden">
                <div className="h-full bg-[#c59b27] rounded-full" style={{ width: "42%" }} />
              </div>
            </div>

            {/* Category 2: Sanitary Ware */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#021817] border border-[#0d4a47] flex items-center justify-center text-[#c59b27]">
                    🚽
                  </div>
                  <div>
                    <p className="font-extrabold text-white">Sanitary Ware</p>
                    <p className="text-[10px] text-slate-400">890 Orders</p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-200">30%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#021817] overflow-hidden">
                <div className="h-full bg-[#c59b27] rounded-full" style={{ width: "30%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: Top Dealers by Sales (Col 5-8) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white">Top Dealers by Sales</h3>
            <Link href="/admin/dealers" className="text-xs font-bold text-[#c59b27] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {/* Dealer 1 */}
            <div className="flex items-center justify-between bg-[#021817] p-2.5 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#c59b27] text-slate-950 font-black text-[11px] flex items-center justify-center">
                  1
                </span>
                <span className="font-extrabold text-white">Aman Tiles</span>
              </div>
              <span className="font-black text-[#c59b27]">₹45,780</span>
            </div>

            {/* Dealer 2 */}
            <div className="flex items-center justify-between bg-[#021817] p-2.5 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#c59b27]/80 text-slate-950 font-black text-[11px] flex items-center justify-center">
                  2
                </span>
                <span className="font-extrabold text-white">Shree Ram Tiles</span>
              </div>
              <span className="font-black text-[#c59b27]">₹32,450</span>
            </div>

            {/* Dealer 3 */}
            <div className="flex items-center justify-between bg-[#021817] p-2.5 rounded-xl border border-slate-700/60">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#c59b27]/60 text-slate-950 font-black text-[11px] flex items-center justify-center">
                  3
                </span>
                <span className="font-extrabold text-white">Kumar Traders</span>
              </div>
              <span className="font-black text-[#c59b27]">₹28,990</span>
            </div>
          </div>
        </div>

        {/* Col 3: Quick Actions (Col 9-12) */}
        <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl space-y-3">
          <h3 className="text-sm font-black text-white">Quick Actions</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
            {/* Action 1: Add Dealer */}
            <Link
              href="/admin/dealers"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <Store className="w-6 h-6 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                Add Dealer
              </span>
            </Link>

            {/* Action 2: Approve Products */}
            <Link
              href="/admin/dealer-products"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <PackageCheck className="w-6 h-6 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                Approve Products
              </span>
            </Link>

            {/* Action 3: Add Banner */}
            <Link
              href="/admin/banners"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <Film className="w-6 h-6 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                Add Banner
              </span>
            </Link>

            {/* Action 4: Create Offer */}
            <Link
              href="/admin/coupons"
              className="bg-[#021817] hover:bg-[#083230] border border-[#0d4a47] hover:border-[#c59b27] p-3 rounded-xl flex flex-col items-center justify-center text-center gap-1.5 group transition shadow-sm"
            >
              <Ticket className="w-6 h-6 text-[#c59b27] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                Create Offer
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 6. DELIVERY PARTNER ACCESS KEY SECTION */}
      <div className="bg-[#062524] rounded-2xl p-5 border border-[#0d4a47] shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center text-[#c59b27]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Delivery Partner Driver Access</h3>
              <p className="text-xs text-slate-300">
                Driver verification security password for login & tracking
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

