"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Leaf, ShoppingBag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderConfirmationPage() {
  const [orderNumber] = useState(
    () => `ECX-${Date.now().toString(36).toUpperCase().slice(-6)}`
  );
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-background/60 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Decorative Green Gradients */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Success Icon Animation */}
        <div className="flex justify-center mb-6 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
            className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-1/3 text-primary"
          >
            <Leaf className="w-5 h-5 fill-current" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Order Confirmed!</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-8">
          Thank you for choosing sustainability! Your eco-friendly purchase reduces carbon footprint and supports green circular economies.
        </p>

        {/* Order Details Card */}
        <div className="bg-muted/30 border border-muted-foreground/10 rounded-2xl p-5 mb-8 text-left space-y-3.5 relative z-10">
          <div className="flex justify-between items-center text-xs text-muted-foreground border-b pb-3 border-muted-foreground/10">
            <span className="flex items-center gap-1"><ShoppingBag className="w-3.5 h-3.5" /> Order Number</span>
            <span className="font-mono font-black text-foreground">{orderNumber}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground border-b pb-3 border-muted-foreground/10">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Order Date</span>
            <span className="font-bold text-foreground">{currentDate}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1">🌱 Impact Created</span>
            <span className="font-bold text-emerald-500">~2.5 kg CO₂ Saved</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
          <Link href="/trial/marketplace" className="w-full">
            <Button variant="outline" className="w-full rounded-xl border-primary/20 hover:bg-primary/5">
              <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
            </Button>
          </Link>
          <Link href="/trial" className="w-full">
            <Button className="w-full rounded-xl bg-primary text-primary-foreground font-bold shadow-lg hover:shadow-xl">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
