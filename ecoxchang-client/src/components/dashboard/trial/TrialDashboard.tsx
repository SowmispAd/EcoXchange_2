"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Sparkles, 
  Clock, 
  ShoppingBag, 
  Recycle, 
  Upload, 
  Camera,
  AlertCircle,
  Leaf
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { dashboardPath } from "@/config/role-nav";
import { SubscriptionModal } from "../SubscriptionModal";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import type { TrialSubmission, ApiError } from "@/types/api";

export function TrialDashboard() {
  const user = useAuthStore((s) => s.user);
  
  const [streak, setStreak] = useState(user?.streak ?? 0);
  const [schedule, setSchedule] = useState<{ day: string; wasteCategory: string; instructions: string } | null>(null);
  const [submissions, setSubmissions] = useState<TrialSubmission[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await api.get("/trial/progress");
      if (res.data?.success) {
        setStreak(res.data.data.currentStreak);
      }
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  }, []);

  const fetchSchedule = useCallback(async () => {
    try {
      const res = await api.get("/trial/schedule");
      if (res.data?.success) {
        setSchedule(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch schedule", err);
    }
  }, []);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await api.get("/trial/submissions/my");
      if (res.data?.success) {
        setSubmissions(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchProgress(), fetchSchedule(), fetchSubmissions()]);
    };
    load();
  }, [fetchProgress, fetchSchedule, fetchSubmissions]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      // 1. Upload to Cloudinary via backend
      const uploadRes = await api.post("/trial/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadRes.data?.success) {
        const imageUrl = uploadRes.data.url;
        toast.success("Photo uploaded successfully! Submitting proof...");

        // 2. Submit trial proof
        setIsSubmitting(true);
        const submitRes = await api.post("/trial/submissions", { imageUrl });
        if (submitRes.data?.success) {
          toast.success("Trial proof submitted for verification!");
          fetchSubmissions();
          fetchProgress();
        }
      }
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.response?.data?.message || "Failed to submit photo proof");
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const hasPending = submissions.some((s) => s.status === "pending_verification");

  return (
    <div className="flex flex-col gap-8 pb-12">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/*"
        className="hidden"
      />

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
            <h3 className="text-xl font-bold mb-6">Today&apos;s Collection</h3>
            <div className="rounded-2xl bg-white/20 p-6 mb-6 transform hover:scale-105 transition-transform">
              <p className="text-sm font-bold uppercase tracking-wider mb-2 text-white">{schedule?.day || "Loading..."}</p>
              <p className="text-2xl font-black text-white">{schedule?.wasteCategory || "Please wait"}</p>
            </div>
            <Button 
              className="w-full h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-lg shadow-lg group"
              onClick={triggerFileSelect}
              disabled={isUploading || isSubmitting || hasPending || streak >= 5}
            >
              {isUploading ? "Uploading..." : isSubmitting ? "Submitting..." : hasPending ? "Pending Verification" : "Submit Photo"}
              <Camera className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Guideline Card */}
        <Card className="lg:col-span-1 border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/50 pb-6">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Daily Collection Details
            </CardTitle>
            <CardDescription>Instructions for {schedule?.day || "today"}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <p className="text-sm font-bold text-primary mb-1">Waste Category</p>
                <p className="font-bold text-lg">{schedule?.wasteCategory || "Loading..."}</p>
              </div>
              <div className="p-4 bg-muted rounded-2xl">
                <p className="text-sm font-bold text-muted-foreground mb-1">Instructions</p>
                <p className="text-sm font-medium leading-relaxed">{schedule?.instructions || "Instructions will load shortly."}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification System */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle>Verification History & Status</CardTitle>
              <CardDescription>Track all submitted proofs and supervisor remarks</CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-2xl bg-muted/20">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                      <Upload className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-muted-foreground mb-1">No Submissions Yet</h4>
                    <p className="text-sm text-muted-foreground mb-6">Upload a photo of your waste to get started.</p>
                    <Button variant="outline" className="rounded-full" onClick={triggerFileSelect}>
                      Upload Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {submissions.map((sub) => (
                      <div key={sub._id} className="flex items-center justify-between p-4 bg-muted/30 border rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Image src={sub.imageUrl} width={48} height={48} className="w-12 h-12 object-cover rounded-xl border" alt="Proof" />
                          <div>
                            <p className="text-sm font-bold">Submitted Proof</p>
                            <p className="text-xs text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {sub.status === "pending_verification" && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
                          )}
                          {sub.status === "approved" && (
                            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">Approved</Badge>
                          )}
                          {sub.status === "rejected" && (
                            <div className="text-right">
                              <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200">Rejected</Badge>
                              <p className="text-[10px] text-rose-500 mt-1 max-w-[150px] truncate">{sub.remarks}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
                  Completing your 5-day trial period successfully awards +50 EcoPoints immediately!
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
                  Clear, well-lit photos of separated recycling waste guarantee fastest supervisor approvals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href={dashboardPath("trial", "marketplace")} className="block">
          <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-background/80">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                Marketplace
              </CardTitle>
              <CardDescription>Browse and buy eco-products directly.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        {streak >= 5 && (
          <Card 
            className="h-full border-none bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 shadow-md hover:shadow-lg cursor-pointer transition-all"
            onClick={() => setShowUpgradeModal(true)}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 font-black">
                <Sparkles className="h-4 w-4 text-amber-950" />
                Claim Permanent Status
              </CardTitle>
              <CardDescription className="text-amber-900 font-bold">Upgrade to unlock full features & Smart Bins!</CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <SubscriptionModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
    </div>
  );
}
