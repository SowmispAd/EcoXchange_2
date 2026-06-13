"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductCard } from "@/components/eco/ProductCard";
import { useCartStore } from "@/store/useCartStore";
import { api } from "@/lib/api";
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import type { MarketplaceProduct } from "@/types/api";

export default function TrialMarketplacePage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  const {
    items: cartItems,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    checkout,
  } = useCartStore();

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get("/marketplace/products");
      if (res.data?.success) {
        setProducts(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchProducts();
      await fetchCart();
    };
    load();
  }, [fetchProducts, fetchCart]);

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter a valid shipping address");
      return;
    }
    await checkout(shippingAddress);
    setCartOpen(false);
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  return (
    <div className="space-y-6 relative min-h-[80vh]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Eco Marketplace</h2>
          <p className="text-muted-foreground">Browse and purchase eco-friendly recycled items</p>
        </div>
        <Button
          onClick={() => setCartOpen(true)}
          className="relative rounded-full px-6 h-12 shadow-lg hover:shadow-xl bg-primary text-primary-foreground font-bold"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart
          {totalCartItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full border border-background shadow-md">
              {totalCartItems}
            </Badge>
          )}
        </Button>
      </div>

      {loadingProducts ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <Card className="border-none bg-muted/20 py-20 text-center rounded-3xl">
          <CardContent className="flex flex-col items-center">
            <Leaf className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">No Products Listed Yet</h3>
            <p className="text-sm text-muted-foreground mt-2">Check back later or register as a partner to sell products.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, index) => (
            <ProductCard
              key={p._id || p.id || `product-${index}`}
              name={p.name}
              category={p.category}
              price={p.price}
              image={p.images?.[0] || "🌱"}
              seller={p.recycler?.fullName || "EcoRecycler"}
              score={p.ecoScore || 90}
              onBuy={() => addToCart(p._id)}
              sellDisabled
              sellTooltip="Only members can list products."
            />
          ))}
        </div>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-background/95 backdrop-blur-xl border-l shadow-2xl z-50 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black flex items-center">
                    <ShoppingCart className="mr-2 text-primary w-6 h-6" /> Your Cart
                  </h3>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setCartOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Your cart is empty. Start adding items!
                    </div>
                  ) : (
                    cartItems.map((item, index) => (
                      <div key={item._id || `cart-${index}`} className="flex items-center justify-between p-4 bg-muted/30 border rounded-2xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate text-sm">{item.product?.name || "Product"}</p>
                          <p className="text-xs text-muted-foreground">₹{item.product?.price || 0} each</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <div className="flex items-center border rounded-full overflow-hidden bg-background">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none border-r"
                              onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </Button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-none border-l"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-rose-500 hover:text-rose-600 rounded-full"
                            onClick={() => removeItem(item._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cartItems.length > 0 && (
                <div className="border-t pt-6 space-y-4 bg-background">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-bold text-sm">Shipping Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter delivery address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div className="flex justify-between items-center text-lg font-black pt-2">
                    <span>Subtotal</span>
                    <span className="text-primary">₹{cartSubtotal}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-lg"
                  >
                    <CreditCard className="w-5 h-5 mr-2" /> Pay with Razorpay
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
