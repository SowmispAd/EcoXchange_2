import { create } from "zustand";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    avatar?: string;
  };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  checkout: (shippingAddress: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/cart");
      if (res.data?.success) {
        set({ items: res.data.data.items || [] });
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const res = await api.post("/cart/add", { productId, quantity });
      if (res.data?.success) {
        set({ items: res.data.data.items || [] });
        toast.success("Added to cart!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const res = await api.patch(`/cart/item/${itemId}`, { quantity });
      if (res.data?.success) {
        set({ items: res.data.data.items || [] });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await api.delete(`/cart/item/${itemId}`);
      if (res.data?.success) {
        set({ items: res.data.data.items || [] });
        toast.success("Item removed from cart");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  },

  checkout: async (shippingAddress) => {
    try {
      // Dynamically load Razorpay SDK
      const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          if ((window as any).Razorpay) {
            resolve(true);
            return;
          }
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Failed to load Razorpay SDK. Please check your internet connection.");
        return;
      }

      // 1. Create order on backend -> gets Razorpay Order ID
      const orderRes = await api.post("/orders/checkout", {
        fromCart: true,
        shippingAddress
      });

      if (orderRes.data?.success) {
        const { order, razorpayOrderId, amount, currency } = orderRes.data.data;

        // 2. Open Razorpay Checkout modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo",
          amount: amount,
          currency: currency,
          name: "EcoXchange",
          description: "Marketplace Purchase",
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            // 3. Send response to payment verification endpoint
            try {
              const verifyRes = await api.post("/payments/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes.data?.success) {
                toast.success("Payment successful! Order processed.");
                await get().fetchCart(); // clear / refresh cart
                window.location.href = "/trial/marketplace/confirmation";
              }
            } catch (err) {
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: useAuthStore.getState().user?.name || "",
            email: useAuthStore.getState().user?.email || "",
            contact: useAuthStore.getState().user?.phone || "",
          },
          theme: {
            color: "#10b981", // emerald primary color
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Checkout failed");
    }
  }
}));
