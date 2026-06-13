"use client";

import { useEffect, useState, useCallback } from "react";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface ShipmentHistory {
  status: string;
  remarks: string;
  timestamp: string;
}

interface Shipment {
  _id: string;
  fromHub: string;
  wasteType: string;
  weightKg: number;
  status: string;
  shipmentHistory: ShipmentHistory[];
}

export default function RecyclerShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [remarks, setRemarks] = useState("");

  const loadShipments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/shipments");
      if (res.data?.success) {
        setShipments(res.data.data);
      }
    } catch {
      toast.error("Failed to load shipments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/shipments");
        if (res.data?.success) {
          setShipments(res.data.data);
        }
      } catch {
        toast.error("Failed to load shipments");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleConfirmReceipt = async (id: string) => {
    try {
      const res = await api.post(`/shipments/${id}/confirm-receipt`, { remarks });
      if (res.data?.success) {
        toast.success("Receipt confirmed successfully!");
        setRemarks("");
        setSelectedShipment(null);
        loadShipments();
      }
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr.response?.data?.message || "Failed to confirm receipt");
    }
  };

  const handleUpdateProcessing = async (id: string) => {
    try {
      const res = await api.patch(`/shipments/${id}/status`, {
        status: "Processing",
        remarks: "Started processing waste at recycler facility",
      });
      if (res.data?.success) {
        toast.success("Processing status updated");
        loadShipments();
      }
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr.response?.data?.message || "Failed to update status");
    }
  };

  const handleCompleteShipment = async (id: string) => {
    try {
      const res = await api.patch(`/shipments/${id}/status`, {
        status: "Completed",
        remarks: "Recycling completed successfully",
      });
      if (res.data?.success) {
        toast.success("Shipment marked as completed");
        loadShipments();
      }
    } catch (err) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <DashboardCard title="Incoming shipments" description="Real-time status changes and verification dashboard.">
          {loading ? (
            <p>Loading shipments...</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">From Hub</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {shipments.map((s) => (
                    <tr
                      key={s._id}
                      onClick={() => setSelectedShipment(s)}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedShipment?._id === s._id ? "bg-muted" : ""}`}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{s._id.slice(-6)}</td>
                      <td className="px-4 py-3 text-sm">{s.fromHub}</td>
                      <td className="px-4 py-3 text-sm font-mono">{s.weightKg} kg</td>
                      <td className="px-4 py-3 text-sm capitalize">
                        <Badge variant="outline">{s.wasteType}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant={
                            s.status === "Receipt Confirmed"
                              ? "default"
                              : s.status === "Delivered"
                              ? "secondary"
                              : s.status === "Completed"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {s.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        {s.status === "Delivered" && (
                          <Button size="sm" onClick={() => setSelectedShipment(s)}>
                            Confirm
                          </Button>
                        )}
                        {s.status === "Receipt Confirmed" && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateProcessing(s._id)}>
                            Process
                          </Button>
                        )}
                        {s.status === "Processing" && (
                          <Button size="sm" variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleCompleteShipment(s._id)}>
                            Complete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {shipments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="h-24 text-center text-muted-foreground text-sm">
                        No shipments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCard>
      </div>

      <div className="space-y-6">
        {selectedShipment ? (
          <DashboardCard title={`Shipment ${selectedShipment._id.slice(-6)} details`}>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-xs text-muted-foreground uppercase">Source Hub</p>
                <p>{selectedShipment.fromHub}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-muted-foreground uppercase">Waste Specifications</p>
                <p className="capitalize">{selectedShipment.wasteType} ({selectedShipment.weightKg} kg)</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-muted-foreground uppercase">Current State</p>
                <p className="font-medium">{selectedShipment.status}</p>
              </div>

              {selectedShipment.status === "Delivered" && (
                <div className="space-y-2 pt-2 border-t">
                  <label className="text-xs font-semibold">Verification Remarks</label>
                  <Input
                    placeholder="Enter observations or remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                  <Button className="w-full" onClick={() => handleConfirmReceipt(selectedShipment._id)}>
                    Confirm Receipt
                  </Button>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="font-semibold text-xs text-muted-foreground uppercase mb-2">Immutable Audit History</p>
                <div className="relative pl-4 border-l border-muted space-y-3">
                  {selectedShipment.shipmentHistory.map((h, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                      <p className="font-medium text-xs">{h.status}</p>
                      {h.remarks && <p className="text-xs text-muted-foreground">{h.remarks}</p>}
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(h.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DashboardCard>
        ) : (
          <DashboardCard title="Audit Console" description="Select a shipment row to inspect historical audits and lifecycle triggers." />
        )}
      </div>
    </div>
  );
}
