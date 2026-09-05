const PRIMARY_CART_KEY = "ceramic_bazaar_guest_cart";
const LEGACY_KEYS = ["electro_bazaar_guest_cart", "guest_cart"];

export interface GuestCartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  brand?: string;
  unit?: string;
  stock?: number;
  category?: { id?: string; name?: string; slug?: string } | null;
  specs?: Record<string, any>;
}

export interface GuestCartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: GuestCartProduct | null;
  variantId?: string | null;
  variantName?: string | null;
  sku?: string | null;
  price?: number | null;
  color?: string | null;
  ram?: string | null;
  storage?: string | null;
}

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    let data = localStorage.getItem(PRIMARY_CART_KEY);
    if (!data) {
      // Check legacy keys and migrate automatically
      for (const k of LEGACY_KEYS) {
        const legacy = localStorage.getItem(k);
        if (legacy) {
          data = legacy;
          localStorage.setItem(PRIMARY_CART_KEY, legacy);
          break;
        }
      }
    }
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to read guest cart", e);
    return [];
  }
}

export function saveGuestCart(cart: GuestCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(cart);
    localStorage.setItem(PRIMARY_CART_KEY, json);
    for (const k of LEGACY_KEYS) {
      localStorage.setItem(k, json);
    }
    // Dispatch custom event to notify components (like Header, BottomNav, CartPage) to update counts & items
    window.dispatchEvent(new Event("guest-cart-change"));
  } catch (e) {
    console.error("Failed to save guest cart", e);
  }
}

export function addToGuestCart(
  productOrId: string | GuestCartProduct | any,
  quantity: number = 1,
  variantOpts?: {
    variantId?: string | null;
    variantName?: string | null;
    sku?: string | null;
    price?: number | null;
    color?: string | null;
    ram?: string | null;
    storage?: string | null;
    product?: GuestCartProduct | null;
  }
): GuestCartItem[] {
  const cart = getGuestCart();
  
  let productId: string;
  let productSnapshot: GuestCartProduct | null = null;

  if (typeof productOrId === "object" && productOrId !== null && productOrId.id) {
    productId = productOrId.id;
    productSnapshot = {
      id: productOrId.id,
      name: productOrId.name || "CERA Product",
      slug: productOrId.slug || "cera-product",
      price: productOrId.price || 0,
      originalPrice: productOrId.originalPrice || productOrId.price,
      discount: productOrId.discount || 0,
      image: productOrId.image || productOrId.images?.[0] || "",
      brand: productOrId.brand || "CERA",
      unit: productOrId.unit || "Piece",
      stock: productOrId.stock ?? 25,
      category: productOrId.category || null,
      specs: productOrId.specs || {},
    };
  } else {
    productId = String(productOrId);
    if (variantOpts?.product) {
      productSnapshot = variantOpts.product;
    }
  }

  const variantId = variantOpts?.variantId || null;
  const existingIndex = cart.findIndex(
    (item) => item.productId === productId && (item.variantId || null) === variantId
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
    if (productSnapshot && !cart[existingIndex].product) {
      cart[existingIndex].product = productSnapshot;
    }
  } else {
    cart.push({
      id: "guest_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36),
      productId,
      quantity,
      product: productSnapshot,
      variantId: variantOpts?.variantId || null,
      variantName: variantOpts?.variantName || null,
      sku: variantOpts?.sku || null,
      price: variantOpts?.price || productSnapshot?.price || null,
      color: variantOpts?.color || null,
      ram: variantOpts?.ram || null,
      storage: variantOpts?.storage || null,
    });
  }

  saveGuestCart(cart);
  return cart;
}

export function updateGuestCartQty(productId: string, quantity: number): GuestCartItem[] {
  let cart = getGuestCart();
  if (quantity < 1) {
    return removeFromGuestCart(productId);
  }

  cart = cart.map((item) =>
    item.productId === productId ? { ...item, quantity } : item
  );

  saveGuestCart(cart);
  return cart;
}

export function removeFromGuestCart(productId: string): GuestCartItem[] {
  const cart = getGuestCart().filter((item) => item.productId !== productId);
  saveGuestCart(cart);
  return cart;
}

export function clearGuestCart() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PRIMARY_CART_KEY);
    for (const k of LEGACY_KEYS) {
      localStorage.removeItem(k);
    }
    window.dispatchEvent(new Event("guest-cart-change"));
  } catch (e) {
    console.error("Failed to clear guest cart", e);
  }
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
}

