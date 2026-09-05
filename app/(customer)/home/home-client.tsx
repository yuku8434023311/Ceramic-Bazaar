"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  Headphones,
  Boxes,
  Award,
  ExternalLink,
  Download,
  Smartphone,
  QrCode,
} from "lucide-react";
import { ProductCard } from "@/components/site/product-card";

// Ceramic Bazaar 2 Official CERA Categories
const CERAMIC_CATEGORY_CARDS = [
  {
    id: "cat_sanitary",
    name: "Sanitaryware",
    desc: "One-Piece EWCs, Wall-Hung Toilets, Urinals, Cisterns & Accessories",
    slug: "sanitary-ware",
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S1013272.jpg",
  },
  {
    id: "cat_wash_basins",
    name: "Wash Basins",
    desc: "Table Top, Wall-Hung, Counter & Pedestal Art Basins",
    slug: "wash-basins",
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S2020198.jpg",
  },
];

// Fallback / Initial Best Selling Products for Ceramic Bazaar (Official CERA)
const DEFAULT_BEST_SELLERS = [
  {
    id: "prod_cera_charm_6d_s1013272",
    name: "CERA Charm 6D One-Piece Toilet (S1013272)",
    slug: "cera-charm-6d-s1013272",
    price: 11990,
    originalPrice: 16990,
    discount: 29,
    unit: "Piece",
    rating: 4.8,
    reviewCount: 53,
    stock: 31,
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S1013272.jpg",
  },
  {
    id: "prod_cera_calibre_s2020198",
    name: "CERA Calibre Table Top Wash Basin (S2020198)",
    slug: "cera-calibre-s2020198",
    price: 3190,
    originalPrice: 4590,
    discount: 30,
    unit: "Piece",
    rating: 4.9,
    reviewCount: 42,
    stock: 25,
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S2020198.jpg",
  },
  {
    id: "prod_cera_campbell_s1013174",
    name: "CERA Campbell One-Piece Toilet (S1013174)",
    slug: "cera-campbell-s1013174",
    price: 8990,
    originalPrice: 12990,
    discount: 31,
    unit: "Piece",
    rating: 4.7,
    reviewCount: 68,
    stock: 22,
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S1013174.jpg",
  },
  {
    id: "prod_cera_garnet_s2020199",
    name: "CERA Garnet Table Top Wash Basin (S2020199)",
    slug: "cera-garnet-s2020199",
    price: 3490,
    originalPrice: 4990,
    discount: 30,
    unit: "Piece",
    rating: 4.8,
    reviewCount: 39,
    stock: 18,
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S2020199.jpg",
  },
];

// Multi-slide Hero Banners for Ceramic Bazaar
const HERO_SLIDES = [
  {
    id: "slide-cera-sanitary",
    tag: "OFFICIAL CERA SANITARYWARE",
    titlePrimary: "LUXURY SANITARY",
    titleHighlight: "& TOILETS",
    subtitle: "One-Piece Rimless EWCs, Wall-Hung Smart Toilets & Cisterns",
    description: "Official CERA India Collection at Direct Wholesale Rates",
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S1013272.jpg",
    btn1Text: "Shop Sanitaryware",
    btn1Link: "/products?category=sanitary-ware",
    btn2Text: "Explore Wash Basins",
    btn2Link: "/products?category=wash-basins",
  },
  {
    id: "slide-wash-basins",
    tag: "DESIGNER ART & TABLE TOP BASINS",
    titlePrimary: "ELEGANT WASH",
    titleHighlight: "BASIN SUITES",
    subtitle: "Table Top, Wall-Hung, Counter & Full Pedestal Basins",
    description: "Upgrade Your Bathroom With Ultra-Glazed Vitreous China Basins",
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S2020198.jpg",
    btn1Text: "Explore Wash Basins",
    btn1Link: "/products?category=wash-basins",
    btn2Text: "Wholesale Offers",
    btn2Link: "/offers",
  },
  {
    id: "slide-wholesale-rates",
    tag: "DIRECT WHOLESALE GUARANTEE",
    titlePrimary: "UNMATCHED PRICES",
    titleHighlight: "& 10-YR WARRANTY",
    subtitle: "100% Genuine CERA Products With Fast Delivery & Live Support",
    description: "Order Online or Call/WhatsApp +91 93153 09289 for Bulk Inquiries",
    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S1043105.jpg",
    btn1Text: "Shop All Products",
    btn1Link: "/products",
    btn2Text: "Help & Support",
    btn2Link: "/support",
  },
];

export function HomeClient({
  categories = [],
  featured = [],
  trending = [],
}: {
  categories?: any[];
  featured?: any[];
  trending?: any[];
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  // Dynamic categories with live DB images and fallback presets
  const displayCategories = React.useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((cat: any) => {
        const fallback = CERAMIC_CATEGORY_CARDS.find(
          (c) => c.slug === cat.slug || c.name.toLowerCase() === cat.name.toLowerCase()
        );
        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          desc: cat.description || fallback?.desc || "Premium Ceramic Collection",
          image: cat.image || fallback?.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
        };
      });
    }
    return CERAMIC_CATEGORY_CARDS;
  }, [categories]);

  // Auto-advance hero banner slider every 5.5 seconds
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Touch Swipe Navigation for Mobile & Tablets with Seamless Vertical Scroll Passthrough
  const minHorizontalSwipeDistance = 50;
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) return;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // If vertical movement is greater than horizontal movement, user is scrolling vertically!
    // DO NOT intercept or change slide, allow 100% natural, fluid vertical page scrolling from anywhere on screen.
    if (Math.abs(diffY) > Math.abs(diffX)) {
      return;
    }

    // Only if horizontal swipe is clearly dominant
    if (Math.abs(diffX) > minHorizontalSwipeDistance) {
      if (diffX > 0) {
        // Swiped Left -> Next Slide
        setActiveSlide((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
      } else {
        // Swiped Right -> Previous Slide
        setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
      }
    }
  };

  // Merge database products or fallback to default ceramic best sellers
  const bestSellersList =
    featured && featured.length >= 4
      ? featured
      : DEFAULT_BEST_SELLERS;

  const currentSlide = HERO_SLIDES[activeSlide] || HERO_SLIDES[0];

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#f8faf9] text-slate-900 pb-16">
      {/* 1. LUXURY HERO BANNER SECTION (Touch Swipeable & Mobile Stabilized) */}
      <section
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-full overflow-hidden bg-[#031716] select-none"
        style={{ touchAction: "pan-y" }}
      >
        {/* Background Visuals with Atmospheric Gold & Dark Teal Glow */}
        <div className="relative mx-auto max-w-[1440px] h-[400px] sm:h-[480px] lg:h-[540px] flex items-center px-4 sm:px-6 lg:px-12 w-full">
          {/* Background Image of Luxury Modern Interior */}
          <div
            key={currentSlide.image}
            className="absolute inset-0 bg-cover bg-right lg:bg-center opacity-90 transition-all duration-700 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(to right, #031716 40%, rgba(3, 23, 22, 0.8) 65%, rgba(3, 23, 22, 0.3) 100%), url('${currentSlide.image}')`,
            }}
          />

          {/* Luxury Ambient Halo Overlay */}
          <div className="absolute top-1/4 right-1/4 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-[#c59b27]/15 blur-3xl pointer-events-none" />

          {/* Left Hero Content */}
          <div className="relative z-10 max-w-2xl text-white space-y-3 sm:space-y-4">
            <div className="inline-block text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-[#c59b27] bg-[#c59b27]/20 px-3.5 py-1 rounded-full border border-[#c59b27]/40 shadow-sm">
              {currentSlide.tag}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-tight uppercase">
              {currentSlide.titlePrimary} <br />
              <span className="text-[#c59b27] font-serif tracking-normal drop-shadow-md">
                {currentSlide.titleHighlight}
              </span>
            </h1>

            <p className="text-sm sm:text-lg lg:text-xl text-slate-100 font-bold leading-snug">
              {currentSlide.subtitle}
            </p>

            <p className="text-xs sm:text-base text-slate-300 font-medium pb-1 line-clamp-2">
              {currentSlide.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link href={currentSlide.btn1Link}>
                <button className="bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black text-xs sm:text-base px-5 sm:px-7 py-2.5 sm:py-3 rounded-lg shadow-2xl flex items-center gap-2 transition-all">
                  <span>{currentSlide.btn1Text}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>

              <Link href={currentSlide.btn2Link}>
                <button className="border-2 border-white/60 hover:border-white hover:bg-white/15 active:scale-95 text-white font-extrabold text-xs sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg flex items-center gap-2 transition-all backdrop-blur-sm">
                  <span>{currentSlide.btn2Text}</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Slider Pagination Touch Dots (No intrusive arrow buttons) */}
          <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === idx
                    ? "w-7 sm:w-9 bg-[#c59b27] shadow-md"
                    : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY (8 CARDS ROW) */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10 w-full overflow-hidden">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              Explore our curated selection of architectural and home improvement products
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-extrabold text-[#062524] hover:text-[#c59b27] flex items-center gap-1.5 transition shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200 hover:border-[#c59b27] product-card-shadow hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Category Image Preview */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 mb-2 sm:mb-2.5 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Title & Description */}
              <div className="text-left space-y-0.5">
                <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight group-hover:text-[#062524] transition line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold line-clamp-1 leading-snug">
                  {cat.desc}
                </p>
              </div>

              {/* Arrow Indicator */}
              <div className="mt-2 flex justify-end">
                <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-[#c59b27] text-slate-950 flex items-center justify-center shadow transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURE HIGHLIGHTS BAR (4 Dark Teal Pills) */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-3 sm:py-4 w-full overflow-hidden">
        <div className="bg-[#062524] text-white rounded-2xl p-5 sm:p-7 border border-[#0d4a47] shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#0d4a47]">
          {/* Feature 1 */}
          <div className="flex items-center gap-3.5 sm:gap-4 sm:px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27]" />
            </div>
            <div>
              <p className="font-black text-sm sm:text-lg text-white leading-snug">
                100% Genuine Products
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#c59b27]">Quality Assured</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3.5 sm:gap-4 sm:px-4 pt-3.5 sm:pt-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center shrink-0 shadow-inner">
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27]" />
            </div>
            <div>
              <p className="font-black text-sm sm:text-lg text-white leading-snug">
                Wholesale Pricing
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#c59b27]">Best Prices Guaranteed</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3.5 sm:gap-4 sm:px-4 pt-3.5 sm:pt-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center shrink-0 shadow-inner">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27]" />
            </div>
            <div>
              <p className="font-black text-sm sm:text-lg text-white leading-snug">
                Fast Delivery
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#c59b27]">On Time, Every Time</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-3.5 sm:gap-4 sm:px-4 pt-3.5 sm:pt-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#c59b27]/20 border border-[#c59b27]/40 flex items-center justify-center shrink-0 shadow-inner">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-[#c59b27]" />
            </div>
            <div>
              <p className="font-black text-sm sm:text-lg text-white leading-snug">
                Secure Payments
              </p>
              <p className="text-xs sm:text-sm font-bold text-[#c59b27]">100% Safe & Secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SPECIAL OFFER BANNER & BEST SELLING PRODUCTS (SIDE-BY-SIDE) */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Special Offer Banner (Col 1-4) */}
          <div className="lg:col-span-4 bg-[#062524] rounded-2xl p-6 sm:p-7 text-white border border-[#0d4a47] flex flex-col justify-between relative overflow-hidden group shadow-xl">
            {/* Background Texture & Stacked Tiles Visual */}
            <div
              className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-contain bg-no-repeat bg-right-bottom opacity-40 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80')`,
              }}
            />

            {/* Gold Badge in Top-Right */}
            <div className="flex justify-between items-start">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#c59b27] bg-[#c59b27]/20 px-2.5 sm:px-3 py-1 rounded-md border border-[#c59b27]/40">
                SPECIAL OFFER
              </span>
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#c59b27] text-slate-950 flex flex-col items-center justify-center font-black text-[8px] sm:text-[9px] leading-tight shadow-xl rotate-12">
                <span>BEST</span>
                <span>PRICE</span>
              </div>
            </div>

            {/* Main Offer Copy */}
            <div className="space-y-1.5 sm:space-y-2 my-6 sm:my-8 z-10">
              <h3 className="text-xl sm:text-3xl font-black uppercase leading-tight text-white">
                WHOLESALE PRICE
              </h3>
              <p className="text-2xl sm:text-4xl font-extrabold text-[#c59b27] tracking-tight drop-shadow">
                UP TO 20% OFF
              </p>
              <p className="text-xs sm:text-base text-slate-200 font-semibold pt-1">
                Premium Products. Better Prices.
              </p>
            </div>

            {/* CTA Button */}
            <div className="z-10">
              <Link href="/offers">
                <button className="w-full bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black text-xs sm:text-sm py-3 px-5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all">
                  <span>Shop Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Best Selling Products Grid (Col 5-12) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Header with View All Link */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Best Selling Products
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
                  Top verified tiles, commodes, basins & fixtures
                </p>
              </div>
              <Link
                href="/products"
                className="text-xs sm:text-sm font-extrabold text-[#062524] hover:text-[#c59b27] flex items-center gap-1.5 group transition shrink-0"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* 6 Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {bestSellersList.slice(0, 6).map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 3-COLUMN COMPOSITION: PREMIUM COLLECTION + WHY CERAMIC BAZAAR + STORE LOCATION */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Column 1: PREMIUM COLLECTION */}
          <div className="bg-[#062524] rounded-2xl p-6 sm:p-7 text-white border border-[#0d4a47] flex flex-col justify-between relative overflow-hidden group shadow-xl">
            {/* Background Luxury Tub Visual */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&auto=format&fit=crop&q=80')`,
              }}
            />

            <div className="relative z-10 space-y-2.5 sm:space-y-3">
              <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#c59b27] bg-[#c59b27]/20 px-3 py-1 rounded-md border border-[#c59b27]/40">
                PREMIUM COLLECTION
              </span>
              <h3 className="text-lg sm:text-2xl font-black leading-snug text-white">
                Elevate your space with our premium quality tiles, fittings & designer products.
              </h3>
            </div>

            <div className="relative z-10 pt-5 sm:pt-6">
              <Link href="/products?featured=true">
                <button className="bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black text-xs sm:text-sm py-2.5 sm:py-3 px-5 rounded-lg shadow-lg flex items-center gap-2 transition-all">
                  <span>Explore Premium Range</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Column 2: WHY CERAMIC BAZAAR? (6 Features Grid) */}
          <div className="bg-[#062524] rounded-2xl p-6 sm:p-7 text-white border border-[#0d4a47] flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#c59b27] mb-4 sm:mb-5">
                WHY CERAMIC BAZAAR?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-5 gap-x-3 sm:gap-x-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm text-white leading-tight">Genuine Products</p>
                    <p className="text-xs text-slate-300 font-medium">Quality Assured</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm text-white leading-tight">Wholesale Rates</p>
                    <p className="text-xs text-slate-300 font-medium">Best Price Guarantee</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ThumbsUp className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm text-white leading-tight">Trusted Service</p>
                    <p className="text-xs text-slate-300 font-medium">100% Satisfaction</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Headphones className="w-5 h-5 text-[#c59b27] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm text-white leading-tight">Expert Support</p>
                    <p className="text-xs text-slate-300 font-medium">Guidance & Help</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5 sm:pt-6">
              <Link href="/support">
                <button className="w-full border-2 border-white/40 hover:border-white hover:bg-white/10 active:scale-95 text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                  <span>Customer Helpdesk</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Column 3: VISIT OUR SHOWROOM (Siwan Location Card) */}
          <div className="bg-[#062524] rounded-2xl p-6 sm:p-7 text-white border border-[#0d4a47] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#c59b27]" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#c59b27] bg-[#c59b27]/20 px-2.5 py-0.5 rounded border border-[#c59b27]/40">
                  STORE LOCATION
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Visit Our Showroom</h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Experience luxury tiles and sanitary ware live in person
              </p>

              <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#021817] border border-[#0d4a47] space-y-2">
                <p className="font-black text-sm text-white flex items-center gap-1.5">
                  <span>📍 Ceramic Bazaar Showroom</span>
                </p>
                <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                  Bhagwanpur Hat, Siwan, Bihar – 841408
                </p>
                <div className="pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between text-xs gap-1 font-bold">
                  <span className="text-[#c59b27]">🕒 Mon - Sat: 9 AM - 8 PM</span>
                  <span className="text-slate-300">📞 +91 93153 09289</span>
                </div>
              </div>
            </div>

            <div className="pt-5 sm:pt-6">
              <a
                href="https://maps.google.com/?q=Bhagwanpur+Hat+Siwan+Bihar+841408"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-lg shadow-lg flex items-center justify-center gap-2 transition"
              >
                <span>Get Google Maps Directions</span>
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DOWNLOAD ANDROID APP BANNER SECTION */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 w-full overflow-hidden">
        <div className="bg-gradient-to-r from-[#031716] via-[#062524] to-[#041d1b] rounded-3xl p-6 sm:p-10 border-2 border-[#c59b27]/40 shadow-2xl relative overflow-hidden">
          {/* Ambient Gold Glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#c59b27]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#c59b27] bg-[#c59b27]/20 px-3 py-1 rounded-full border border-[#c59b27]/40">
                <Smartphone className="w-3.5 h-3.5 text-[#c59b27]" />
                Download Ceramic Bazaar Official Android App
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
                Get Direct Wholesale Rates <br />
                <span className="text-[#c59b27]">On Your Mobile Phone</span>
              </h2>

              <p className="text-xs sm:text-base text-slate-200 font-medium max-w-2xl leading-relaxed">
                Install the official Ceramic Bazaar APK for superfast browsing, instant WhatsApp order inquiries, live order tracking, and exclusive discounts on all 246+ CERA sanitaryware and wash basins.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-bold text-slate-300">
                <span className="bg-[#031716] px-3 py-1 rounded-lg border border-[#0d4a47] flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Virus-Free APK
                </span>
                <span className="bg-[#031716] px-3 py-1 rounded-lg border border-[#0d4a47] text-white">
                  File Size: <strong className="text-[#c59b27]">7.1 MB</strong>
                </span>
                <span className="bg-[#031716] px-3 py-1 rounded-lg border border-[#0d4a47] text-white">
                  Android 7.0 & Higher
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/ceramic-bazaar.apk"
                  download="ceramic-bazaar.apk"
                  className="bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xl flex items-center gap-2.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK Now (7.1 MB)</span>
                </a>

                <Link
                  href="/download"
                  className="border-2 border-white/50 hover:border-white hover:bg-white/10 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 transition-all backdrop-blur-sm"
                >
                  <span>Installation Guide & QR</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right QR Box */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl p-5 text-center shadow-xl border-2 border-[#c59b27] max-w-[220px] w-full">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl mb-2 flex items-center justify-center">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https%3A%2F%2Fceramic-bazaar.vercel.app%2Fdownload%3Fauto%3D1"
                    alt="Scan QR Code to Download Ceramic Bazaar APK"
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <p className="text-[11px] font-black text-slate-900 leading-tight">Scan with Phone</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Auto-Starts APK Download</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

