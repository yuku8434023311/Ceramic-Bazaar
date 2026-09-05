"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatRupees } from "@/lib/format";
import { useSession } from "next-auth/react";
import { getGuestCart, updateGuestCartQty, removeFromGuestCart } from "@/lib/cart-local";

export default function CartPage() {
  const router = useRouter();
  const { status } = useSession() || {};
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      if (status === "authenticated") {
        setLoading(true);
        const res = await fetch("/api/cart");
        const d = res.ok ? await res.json() : [];
        setItems(Array.isArray(d) ? d : []);
        setLoading(false);
      } else {
        const guestCart = getGuestCart();
        
        // Immediate render with stored product snapshots
        if (guestCart.length > 0) {
          const initialMapped = guestCart.map(item => ({
            id: item.id,
            productId: item.productId,
            quantity: Number(item.quantity) || 1,
            product: item.product || {
              id: item.productId,
              name: item.variantName || "CERA Official Product",
              price: item.price || 2990,
              image: "https://www.cera-india.com/sites/default/files/cera/product_images/S1013272.jpg",
              slug: item.productId.replace("prod_", ""),
              stock: 30,
            }
          }));
          setItems(initialMapped);
          setLoading(false);
        } else {
          setItems([]);
          setLoading(false);
        }

        // Background sync to fetch fresh product specs / images
        try {
          const res = await fetch("/api/products?limit=500");
          if (res.ok) {
            const products = await res.json();
            if (Array.isArray(products) && products.length > 0) {
              const refreshed = guestCart.map(item => {
                const liveProduct = products.find((prod: any) => prod.id === item.productId || prod.slug === item.productId);
                return {
                  id: item.id,
                  productId: item.productId,
                  quantity: Number(item.quantity) || 1,
                  product: liveProduct || item.product || {
                    id: item.productId,
                    name: "CERA Official Product",
                    price: item.price || 2990,
                    image: "https://www.cera-india.com/sites/default/files/cera/product_images/S1013272.jpg",
                    slug: item.productId.replace("prod_", ""),
                    stock: 30,
                  }
                };
              });
              setItems(refreshed);
            }
          }
        } catch (_) {}
      }
    } catch {
      toast.error("Failed to load cart items");
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handleCartChange = () => {
      load();
    };
    window.addEventListener("guest-cart-change", handleCartChange);
    return () => window.removeEventListener("guest-cart-change", handleCartChange);
  }, [status]);

  const updateQty = async (id: string, q: number) => {
    if (q < 1) return;
    const item = items.find(it => it.id === id);
    if (!item) return;

    const stock = item.product?.stock ?? 0;
    if (q > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    if (status === "authenticated") {
      const res = await fetch("/api/cart", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ itemId: id, quantity: q }) });
      if (res.ok) setItems(prev => prev.map(it => it.id === id ? { ...it, quantity: q } : it));
      else toast.error("Failed to update quantity");
    } else {
      updateGuestCartQty(item.productId, q);
      setItems(prev => prev.map(it => it.id === id ? { ...it, quantity: q } : it));
    }
  };

  const remove = async (id: string) => {
    if (status === "authenticated") {
      const res = await fetch(`/api/cart?itemId=${id}`, { method: "DELETE" });
      if (res.ok) { setItems(prev => prev.filter(it => it.id !== id)); toast.success("Removed from cart"); }
    } else {
      const item = items.find(it => it.id === id);
      if (item) {
        removeFromGuestCart(item.productId);
        setItems(prev => prev.filter(it => it.id !== id));
        toast.success("Removed from cart");
      }
    }
  };

  const subtotal = items.reduce((s: number, it: any) => s + (it.product?.price ?? 0) * it.quantity, 0);
  const shipping = subtotal > 10000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  if (loading) return <div className="mx-auto max-w-[1200px] px-4 py-12 text-center text-muted-foreground">Loading cart...</div>;
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-20 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4"><ShoppingBag className="h-10 w-10 text-muted-foreground" /></div>
        <h1 className="text-2xl font-display font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Browse products and add your favorites</p>
        <Link href="/products"><Button className="bg-[#062524] text-white hover:bg-[#0c3f3d]">Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-6 text-slate-900">Shopping Cart ({items.length})</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((it) => (
              <motion.div key={it.id} layout exit={{ opacity: 0, x: -20 }} className="bg-card rounded-xl p-4 product-card-shadow border border-border">
                <div className="flex gap-4 relative">
                  <div className="h-20 w-20 bg-white rounded-lg overflow-hidden shrink-0 border border-border p-1 flex items-center justify-center">
                    <img src={it.product?.image} alt={it.product?.name ?? ""} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <Link href={`/products/${it.product?.slug}`}><h3 className="font-semibold text-xs sm:text-sm line-clamp-1 hover:text-[#c59b27]">{it.product?.name}</h3></Link>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{it.product?.category?.name}</p>
                    <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
                      <div className="flex items-center border border-input rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(it.id, it.quantity - 1)} className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-muted" aria-label="Decrease"><Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5 mx-auto" /></button>
                        <span className="h-7 w-8 sm:h-8 sm:w-10 flex items-center justify-center text-xs sm:text-sm font-medium">{it.quantity}</span>
                        <button onClick={() => updateQty(it.id, it.quantity + 1)} className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-muted" aria-label="Increase"><Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 mx-auto" /></button>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-sm sm:text-base text-slate-900">{formatRupees((it.product?.price ?? 0) * it.quantity)}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">{formatRupees(it.product?.price ?? 0)} each</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(it.id)} aria-label="Remove" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="bg-card rounded-xl p-5 product-card-shadow h-fit lg:sticky lg:top-20 border border-border">
          <h2 className="font-display font-bold text-lg mb-4 text-slate-900">Order Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-medium text-slate-900">{formatRupees(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="font-medium text-emerald-600">{shipping === 0 ? "Free" : formatRupees(shipping)}</dd></div>
            <div className="border-t border-border pt-2 mt-2"></div>
            <div className="flex justify-between text-base"><dt className="font-bold text-slate-900">Total</dt><dd className="font-display font-bold text-lg text-[#062524]">{formatRupees(total)}</dd></div>
          </dl>
          <Button 
            onClick={() => {
              if (status === "authenticated") {
                router.push("/checkout");
              } else {
                router.push("/login?callbackUrl=/checkout");
              }
            }} 
            className="w-full mt-5 bg-[#c59b27] hover:bg-[#b38820] text-slate-950 font-black h-11 shadow-md transition active:scale-95"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">Secure checkout • Direct Factory Pricing</p>
        </div>
      </div>
    </div>
  );
}
