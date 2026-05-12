"use client";

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle2, 
  Loader2,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  amount: string;
}

export function PaymentModal({ open, onOpenChange, onSuccess, amount }: PaymentModalProps) {
  const router = useRouter();
  const [method, setMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Update role in store
      if (useAuthStore.getState().user) {
        const currentUser = useAuthStore.getState().user;
        useAuthStore.getState().login({
          ...currentUser!,
          role: 'member'
        });
      }

      setTimeout(() => {
        onSuccess();
        router.push('/member/dashboard');
      }, 2000);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="payment-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Secure Payment</DialogTitle>
                <DialogDescription>Pay ₹{amount} to activate membership</DialogDescription>
              </DialogHeader>

              <div className="flex gap-4">
                {[
                  { id: 'upi', icon: Smartphone, label: 'UPI' },
                  { id: 'card', icon: CreditCard, label: 'Card' },
                  { id: 'wallet', icon: Wallet, label: 'Wallet' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id as any)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                      method === m.id ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-muted hover:border-primary/20'
                    }`}
                  >
                    <m.icon className="h-6 w-6" />
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {method === 'upi' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">UPI ID</label>
                    <Input placeholder="example@upi" className="rounded-xl h-12" />
                  </div>
                )}
                {method === 'card' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground">Card Number</label>
                      <Input placeholder="0000 0000 0000 0000" className="rounded-xl h-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Expiry</label>
                        <Input placeholder="MM/YY" className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">CVV</label>
                        <Input placeholder="***" className="rounded-xl h-12" />
                      </div>
                    </div>
                  </div>
                )}
                {method === 'wallet' && (
                  <div className="p-4 bg-muted rounded-2xl text-center">
                    <p className="text-sm font-medium">Select your preferred wallet provider at the next step.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-4">
                <Button 
                  className="w-full h-14 rounded-full text-lg font-bold shadow-lg shadow-primary/20" 
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>Pay Now ₹{amount}</>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span className="text-[10px] font-medium uppercase tracking-widest">Secure 256-bit SSL Encryption</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="payment-success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center text-center space-y-6"
            >
              <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black">Payment Successful!</h3>
                <p className="text-muted-foreground text-lg">Your membership is now activated.</p>
              </div>
              <div className="pt-6 w-full">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-800 text-sm font-medium flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" /> Redirecting to Dashboard...
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
