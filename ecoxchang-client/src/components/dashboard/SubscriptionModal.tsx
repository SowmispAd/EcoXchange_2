"use client";

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  Trash2, 
  Package, 
  QrCode, 
  ArrowRight,
  Sparkles,
  Check
} from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
  const [selectedBin, setSelectedBin] = useState<'small' | 'medium' | 'large'>('medium');
  const [showPayment, setShowPayment] = useState(false);

  const { data: plansData } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      const res = await api.get('/membership/plans');
      return res.data.data;
    },
  });

  const plan = plansData?.[0];

  const binOptions = [
    { id: 'small', name: 'Small Bin', capacity: '15L', icon: Trash2, color: 'emerald' },
    { id: 'medium', name: 'Standard Bin', capacity: '30L', icon: Trash2, color: 'blue' },
    { id: 'large', name: 'Family Bin', capacity: '60L', icon: Trash2, color: 'indigo' },
  ];

  const handleProceed = () => {
    setShowPayment(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <div className="bg-gradient-to-br from-primary/10 to-emerald-500/10 p-8">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-emerald-500 hover:bg-emerald-600">Premium Membership</Badge>
              </div>
              <DialogTitle className="text-3xl font-extrabold tracking-tight">Upgrade Your Plan</DialogTitle>
              <DialogDescription className="text-lg">
                Unlock the full power of EcoXchange for just ₹300/year.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Side: Benefits */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">What&apos;s Included</h4>
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle2, text: 'Unlimited Pickup Requests' },
                    { icon: Sparkles, text: 'Earn Unlimited EcoPoints' },
                    { icon: Package, text: '100 Biodegradable Polythene Bags' },
                    { icon: QrCode, text: '100 QR Stickers' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-background/50 rounded-2xl border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-2">Included Welcome Kit:</p>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
                                <Package className="h-6 w-6 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-bold">100 Bags</span>
                        </div>
                        <div className="text-center">
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-1 mx-auto">
                                <QrCode className="h-6 w-6 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-bold">100 Stickers</span>
                        </div>
                    </div>
                </div>
              </div>

              {/* Right Side: Bin Selection */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Select Your Smart Bin</h4>
                <div className="space-y-3">
                  {binOptions.map((bin) => (
                    <div 
                      key={bin.id}
                      onClick={() => setSelectedBin(bin.id as 'small' | 'medium' | 'large')}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        selectedBin === bin.id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-transparent bg-background hover:border-primary/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-${bin.color}-100 text-${bin.color}-600`}>
                          <bin.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{bin.name}</p>
                          <p className="text-xs text-muted-foreground">{bin.capacity} Capacity</p>
                        </div>
                      </div>
                      {selectedBin === bin.id && (
                        <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 bg-background border-t">
            <div className="flex items-center justify-between w-full">
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Annual Membership</p>
                <p className="text-2xl font-black">₹{plan?.price ?? '300.00'}</p>
              </div>
              <Button size="lg" className="rounded-full px-8 font-bold" onClick={handleProceed}>
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaymentModal 
        open={showPayment} 
        onOpenChange={setShowPayment} 
        onSuccess={() => {
          setShowPayment(false);
          onOpenChange(false);
        }}
        amount={plan?.price?.toString() ?? "300"}
        planId={plan?._id}
      />
    </>
  );
}
