"use client";

import { useEffect, useState } from "react";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, Trash2, Download, Calendar, MapPin, Smartphone, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface Proof {
  _id: string;
  taskId: string;
  imageUrl: string;
  deviceType: string;
  captureTime: string;
  latitude?: number;
  longitude?: number;
  status: string;
}

export default function DeliveryProofsPage() {
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<Proof | null>(null);

  const loadProofs = () => {
    setLoading(true);
    api
      .get("/api/delivery/proofs")
      .then((res) => {
        if (res.data?.success) {
          setProofs(res.data.data);
        }
      })
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error.response?.data?.message || "Failed to load proofs");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const t = setTimeout(() => {
      loadProofs();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this proof?")) return;

    try {
      const res = await api.delete(`/api/delivery/proofs/${id}`);
      if (res.data?.success) {
        toast.success("Proof deleted successfully");
        setProofs((prev) => prev.filter((p) => p._id !== id));
        if (selectedProof?._id === id) setSelectedProof(null);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to delete proof");
    }
  };

  const handleDownload = (url: string, filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Open in new tab or trigger browser download
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardCard title="Proof of Delivery Gallery" description="Manage and view geotagged uploads.">
      {selectedProof ? (
        <div className="space-y-4">
          <Button variant="outline" size="sm" onClick={() => setSelectedProof(null)} className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to gallery
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedProof.imageUrl} alt="Proof upload preview" className="max-h-full object-contain" />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Proof Metadata</h3>
              <div className="space-y-3.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Captured: {new Date(selectedProof.captureTime).toLocaleString()}</span>
                </div>
                {selectedProof.latitude !== undefined && selectedProof.longitude !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Geotag: {selectedProof.latitude.toFixed(6)}, {selectedProof.longitude.toFixed(6)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Device: {selectedProof.deviceType || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="font-medium">Task Association ID:</span>
                  <span className="font-mono text-xs">{selectedProof.taskId}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={(e) => handleDownload(selectedProof.imageUrl, `proof_${selectedProof._id}.jpg`, e)} className="gap-1">
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button variant="destructive" onClick={(e) => handleDelete(selectedProof._id, e)} className="gap-1">
                  <Trash2 className="h-4 w-4" /> Delete Proof
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-12 text-muted-foreground animate-pulse">Loading gallery...</div>
      ) : proofs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No uploaded proofs found. Capture proofs during task delivery.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {proofs.map((proof) => (
            <Card key={proof._id} onClick={() => setSelectedProof(proof)} className="cursor-pointer hover:border-primary/40 transition-colors group overflow-hidden">
              <div className="relative aspect-video bg-muted overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proof.imageUrl} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" className="rounded-full" onClick={(e) => handleDelete(proof._id, e)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3 text-xs text-muted-foreground flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span>Task: {proof.taskId.slice(-6)}</span>
                  <span>{new Date(proof.captureTime).toLocaleDateString()}</span>
                </div>
                {proof.latitude !== undefined && (
                  <div className="truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>{proof.latitude.toFixed(4)}, {proof.longitude?.toFixed(4)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
