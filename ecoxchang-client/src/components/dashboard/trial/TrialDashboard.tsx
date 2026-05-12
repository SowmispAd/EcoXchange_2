"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Gift,
  ShoppingBag,
  Users,
  Leaf,
  Recycle,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Camera,
  Upload,
  ArrowRight,
} from 'lucide-react';
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { SubscriptionModal } from "../SubscriptionModal";
import { motion, AnimatePresence } from 'framer-motion';

const weeklySchedule = [
  { day: 'Monday', waste: 'Wet Waste', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { day: 'Tuesday', waste: 'Plastic Waste', color: 'text-blue-600', bg: 'bg-blue-50' },
  { day: 'Wednesday', waste: 'Paper Waste', color: 'text-amber-600', bg: 'bg-amber-50' },
  { day: 'Thursday', waste: 'Metal Waste', color: 'text-slate-600', bg: 'bg-slate-50' },
  { day: 'Friday', waste: 'E-Waste', color: 'text-purple-600', bg: 'bg-purple-50' },
  { day: 'Saturday', waste: 'Mixed Recycling', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { day: 'Sunday', waste: 'Awareness Day', color: 'text-rose-600', bg: 'bg-rose-50' },
];

export function TrialDashboard() {
  const [streak, setStreak] = useState(0);
  const ecoPoints = useAuthStore((s) => s.user?.ecoPoints ?? 120);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleVerify = () => {
    setIsSubmitting(true);
    // Mocking submission process
    setTimeout(() => {
      setIsSubmitting(false);
      setPendingVerification(true);
      setLastSubmission(new Date().toLocaleDateString());
      
      // Mocking supervisor approval after 3 seconds
      setTimeout(() => {
        setPendingVerification(false);
        setStreak(prev => Math.min(prev + 1, 5));
      }, 3000);
    }, 1500);
  };

  useEffect(() => {
    if (streak === 5) {
      const timer = setTimeout(() => {
        setShowUpgradeModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaySchedule = weeklySchedule.find(s => s.day === currentDay);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Streak Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-800 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none rotate-12">
          <Recycle className="h-64 w-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none px-4 py-1 backdrop-blur-md">
              <Sparkles className="mr-2 h-4 w-4" />
              Trial Membership Active
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Your Streak: <span className="text-amber-400">{streak}/5</span>
            </h2>
            <p className="text-emerald-50 text-lg max-w-lg mb-8 leading-relaxed">
              Complete 5 successful waste verifications to unlock Permanent Membership and receive your Smart Bin kit!
            </p>
            
            <div className="w-full max-w-md bg-white/10 rounded-full h-4 mb-4 overflow-hidden p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(streak / 5) * 100}%` }}
                className="h-full bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"
              />
            </div>
            <p className="text-sm font-medium text-emerald-100 flex items-center justify-center md:justify-start gap-2">
              <Rocket className="h-4 w-4" />
              {streak < 5 ? `${5 - streak} more verifications to reach Permanent Status!` : "You've reached the goal! Upgrade now."}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 text-center w-full md:w-80 shadow-inner">
            <h3 className="text-xl font-bold mb-6">Today's Collection</h3>
            <div className={`rounded-2xl ${todaySchedule?.bg || 'bg-white/20'} p-6 mb-6 transform hover:scale-105 transition-transform`}>
              <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${todaySchedule?.color || 'text-white'}`}>{todaySchedule?.day}</p>
              <p className={`text-2xl font-black ${todaySchedule?.color || 'text-white'}`}>{todaySchedule?.waste}</p>
            </div>
            <Button 
              className="w-full h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-lg shadow-lg group"
              onClick={handleVerify}
              disabled={isSubmitting || pendingVerification || streak === 5}
            >
              {isSubmitting ? "Submitting..." : pendingVerification ? "Verifying..." : "Submit Photo"}
              <Camera className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Schedule Card */}
        <Card className="lg:col-span-1 border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/50 pb-6">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Always know what to recycle next</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {weeklySchedule.map((item, i) => (
                <div 
                  key={i} 
                  className={`flex items-center justify-between p-4 px-6 transition-colors ${item.day === currentDay ? 'bg-primary/10' : ''}`}
                >
                  <div>
                    <p className={`text-sm font-bold ${item.day === currentDay ? 'text-primary' : 'text-muted-foreground'}`}>{item.day}</p>
                    <p className="font-medium">{item.waste}</p>
                  </div>
                  {item.day === currentDay && (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/20">Today</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Verification System */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle>Trash Verification Status</CardTitle>
              <CardDescription>Monitor your recent submissions and supervisor feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {pendingVerification ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="relative mb-6">
                      <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                      <ShieldCheck className="h-10 w-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Verification in Progress</h4>
                    <p className="text-muted-foreground max-w-sm">
                      Our supervisor is checking your submission for <span className="font-bold text-primary">{todaySchedule?.waste}</span>. This usually takes a few moments.
                    </p>
                  </motion.div>
                ) : streak === 5 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h4 className="text-2xl font-black mb-2">Goal Achieved!</h4>
                    <p className="text-muted-foreground max-w-sm mb-8">
                      You've successfully completed your trial period. You're now eligible for Permanent Membership!
                    </p>
                    <Button size="lg" className="rounded-full px-12 bg-primary hover:bg-primary/90" onClick={() => setShowUpgradeModal(true)}>
                      Claim Permanent Status <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl bg-muted/20">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-muted-foreground mb-1">No Recent Submissions</h4>
                    <p className="text-sm text-muted-foreground mb-6">Upload a photo of today's {todaySchedule?.waste} to increase your streak.</p>
                    <Button variant="outline" className="rounded-full" onClick={handleVerify}>
                      Upload Photo
                    </Button>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-lg bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <Leaf className="h-5 w-5" />
                  Eco-Bonus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium leading-relaxed">
                  Trial members who reach a 5-day streak get a 10% bonus on their first month's EcoPoints!
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-blue-50 dark:bg-blue-950/20 rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <AlertCircle className="h-5 w-5" />
                  Quick Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 dark:text-blue-500 font-medium leading-relaxed">
                  Make sure your waste is cleaned and separated properly for a 100% approval rate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/trial/marketplace" className="block">
          <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-background/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Marketplace
              </CardTitle>
              <CardDescription>Browse recycled products (buy only while on trial).</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/trial/referrals" className="block">
          <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-background/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Referrals
              </CardTitle>
              <CardDescription>Share your link and earn bonus EcoPoints.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/trial/rewards" className="block">
          <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-background/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                Rewards · {ecoPoints} pts
              </CardTitle>
              <CardDescription>Discounts, cashback, and free refills.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <SubscriptionModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
  );
}

