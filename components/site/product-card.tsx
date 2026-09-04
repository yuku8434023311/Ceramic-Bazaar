"use client";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatRupees } from "@/lib/format";
import { useSession } from "next-auth/react";
import { addToGuestCart } from "@/lib/cart-local";
import { triggerFlyToCart } from "@/components/site/fly-to-cart";

export function ProductCard({
  product,
  onAdd,
  onWish,
  inWishlist = false,
}: {
  product: any;
  onAdd?: (id: string) => void;
  onWish?: (id: string) => void;
  inWishlist?: boolean;
}) {
  const router = useRouter();
  const { status } = useSession() || {};
  const [imgErr, setImgErr] = useState(false);
  const [wishing, setWishing] = useState(inWishlist);
  const [adding, setAdding] = useState(false);

  const productVariants = Array.isArray(product.variants) ? product.variants : [];
  const defaultVar = productVariants.find((v: any) => v.isDefault) || productVariants[0];
  const displayPrice = defaultVar ? Number(defaultVar.price) : product.price;
  const displayOriginalPrice = defaultVar
    ? defaultVar.originalPrice != null
      ? Number(defaultVar.originalPrice)
      : product.originalPrice
    : product.originalPrice;

  const unitLabel = product.unit ? ` / ${product.unit}` : product.name?.toLowerCase().includes("tile") ? " / Sq.ft" : "";

  const discountPercent =
    product.discount > 0
      ? product.discount
      : displayOriginalPrice && displayOriginalPrice > displayPrice
      ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
      : 0;

  const addToCart = async (e?: React.MouseEvent) => {
    if (adding) return;
    if (e) {
      triggerFlyToCart(e, defaultVar?.image || product.image);
    }
    const variantId = defaultVar?.id || null;
    const variantName = defaultVar ? `${defaultVar.ram || ""} ${defaultVar.storage || ""}`.trim() : null;

    if (status !== "authenticated") {
      addToGuestCart(product.id, 1, {
        variantId,
        variantName,
        sku: defaultVar?.sku,
        price: displayPrice,
      });
      toast.success("Added to cart");
      onAdd?.(product.id);
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          variantId,
          variantName,
          sku: defaultVar?.sku,
          price: displayPrice,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j?.error ?? "Failed to add to cart");
      } else {
        toast.success("Added to cart");
        onAdd?.(product.id);
      }
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(e);
    router.push("/cart");
  };

  const toggleWish = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const data = await res.json();
      if (data?.added) {
        setWishing(true);
        toast.success("Added to wishlist");
      } else if (data?.removed) {
        setWishing(false);
        toast.success("Removed from wishlist");
      }
      onWish?.(product.id);
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const ratingVal = (product.rating ?? 4.6).toFixed(1);
  const reviewsCount = product.reviewCount ?? 128;

  const isOutOfStock = product.stock === 0 || product.inStock === false;

  return (
    <div className="group bg-white rounded-xl overflow-hidden product-card-shadow transition-all duration-300 flex flex-col justify-between border border-slate-200 hover:border-[#c59b27]/40">
      {/* Top Image Section */}
      <div>
        <div className="relative aspect-[4/3] bg-white overflow-hidden flex items-center justify-center p-3">
          <Link href={`/products/${product.slug}`} className="w-full h-full flex items-center justify-center">
            {!imgErr && (defaultVar?.image || product.image) ? (
              <img
                src={defaultVar?.image || product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={() => setImgErr(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs bg-slate-50 rounded-lg">
                Ceramic Product
              </div>
            )}
          </Link>

          {/* Wishlist Heart Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWish();
            }}
            className="absolute top-2.5 right-2.5 h-6.5 w-6.5 rounded-full bg-white/90 backdrop-blur border border-slate-200/90 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                wishing ? "fill-red-500 text-red-500" : "text-slate-600 hover:text-red-500"
              } transition`}
              strokeWidth={1.6}
            />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-3 space-y-1.5">
          {/* Rating Stars */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <Star className="h-3 w-3 fill-amber-400/30 text-amber-400" />
            </div>
            <span className="font-bold text-slate-800 text-xs">{ratingVal}</span>
            <span className="text-slate-500 text-[11px] font-medium">({reviewsCount})</span>
          </div>

          {/* Title (2 lines max, perfectly readable) */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 min-h-[2.25rem] hover:text-[#062524] transition">
              {product.name}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 pt-0.5">
            <span className="font-black text-sm sm:text-base text-[#062524]">
              {formatRupees(displayPrice)}
              <span className="text-[11px] font-semibold text-slate-600">{unitLabel}</span>
            </span>
            {displayOriginalPrice && displayOriginalPrice > displayPrice && (
              <span className="text-[11px] text-slate-400 line-through font-medium">
                {formatRupees(displayOriginalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-extrabold text-red-600 bg-red-50 px-1 py-0.5 rounded border border-red-200">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Dual Action Buttons (Cart Icon Only + Buy Now) */}
      {isOutOfStock ? (
        <div className="px-3 pb-3 pt-1">
          <div className="w-full h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-bold text-[11px] flex items-center justify-center shadow-inner cursor-not-allowed">
            Out of Stock
          </div>
        </div>
      ) : (
        <div className="px-3 pb-3 pt-1 flex items-center gap-1.5">
          {/* Cart Icon-Only Button (Clean Square w-8 h-8) */}
          <button
            type="button"
            onClick={addToCart}
            disabled={adding}
            className="w-8 h-8 rounded-lg border border-slate-300 hover:border-[#062524] hover:bg-[#062524] hover:text-white active:scale-95 text-slate-700 flex items-center justify-center transition-all shadow-xs shrink-0 bg-white"
            title="Add to Cart"
            aria-label="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={1.6} />
          </button>

          {/* Solid Gold Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 h-8 bg-[#c59b27] hover:bg-[#b38820] active:scale-95 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-sm text-center flex items-center justify-center"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

