"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Timeline } from "@/components/dashboard/Timeline";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  Phone,
  ScanLine,
  Camera,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { QRScanner } from "@/components/eco/QRScanner";
import { CameraCapture } from "@/components/eco/CameraCapture";
import { RouteMap } from "@/components/eco/RouteMap";
import { queueAction, syncOfflineQueue, getOfflineQueue } from "@/lib/offlineSync";

interface TaskUser {
  fullName?: string;
  phoneNumber?: string;
}

interface Task {
  _id: string;
  user: TaskUser | null;
  wasteType: string;
  estimatedWeight: number;
  address: string;
  notes?: string;
  scheduledDate: string;
  status: string;
  destinationLat: number;
  destinationLng: number;
  qrScanned?: boolean;
}

interface Analytics {
  tasksToday: number;
  completedTasks: number;
  failedTasks: number;
  averageDeliveryTimeMinutes: number;
  distanceCoveredKm: number;
  proofUploadSuccessRate: number;
}

export function DeliveryDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    tasksToday: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageDeliveryTimeMinutes: 0,
    distanceCoveredKm: 0,
    proofUploadSuccessRate: 100,
  });

  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [offlineCount, setOfflineCount] = useState(0);

  // Map controls
  const [mapOpen, setMapOpen] = useState(true);
  const [mapMinimized, setMapMinimized] = useState(false);
  const [mapFullscreen, setMapFullscreen] = useState(false);

  // QR and Camera controls
  const [scannerOpen, setScannerOpen] = useState(false);
  const [activeScanTaskId, setActiveScanTaskId] = useState<string | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeCameraTaskId, setActiveCameraTaskId] = useState<string | null>(null);

  // Agent location
  const [currentLat, setCurrentLat] = useState<number>(12.9716);
  const [currentLng, setCurrentLng] = useState<number>(77.5946);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksRes, analyticsRes] = await Promise.all([
        api.get("/api/delivery/tasks"),
        api.get("/api/delivery/analytics"),
      ]);
      if (tasksRes.data?.success) {
        setTasks(tasksRes.data.data);
      }
      if (analyticsRes.data?.success) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Monitor online status & offline queue count
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateStatus = () => {
      setIsOnline(navigator.onLine);
      setOfflineCount(getOfflineQueue().length);
      if (navigator.onLine) {
        void syncOfflineQueue().then(() => {
          void fetchData();
        });
      }
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();

    const interval = setInterval(() => {
      setOfflineCount(getOfflineQueue().length);
    }, 3000);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      clearInterval(interval);
    };
  }, [fetchData]);

  // Periodic GPS simulation/tracking
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    const updateLocation = (pos: GeolocationPosition) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setCurrentLat(lat);
      setCurrentLng(lng);

      if (navigator.onLine) {
        api.post("/api/delivery/location", { latitude: lat, longitude: lng }).catch(console.error);
      } else {
        queueAction({
          type: "location_ping",
          url: "/api/delivery/location",
          method: "POST",
          payload: { latitude: lat, longitude: lng },
        });
      }
    };

    navigator.geolocation.getCurrentPosition(updateLocation, console.error);
    const watchId = navigator.geolocation.watchPosition(updateLocation, console.error, {
      enableHighAccuracy: true,
      maximumAge: 10000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchData();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchData]);

  // Map route points
  const routePoints = useMemo<[number, number][]>(() => {
    const points: [number, number][] = [[currentLat, currentLng]];
    tasks
      .filter((t) => t.status === "in_progress" || t.status === "accepted" || t.status === "assigned")
      .forEach((t) => {
        if (t.destinationLat && t.destinationLng) {
          points.push([t.destinationLat, t.destinationLng]);
        }
      });
    return points;
  }, [tasks, currentLat, currentLng]);

  // Handle task state updates
  const handleAccept = async (id: string) => {
    if (!isOnline) {
      queueAction({
        type: "status_change",
        url: `/api/delivery/tasks/${id}/accept`,
        method: "POST",
        payload: {},
      });
      // Pessimistic frontend update for offline feel
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status: "accepted" } : t)));
      return;
    }

    try {
      const res = await api.post(`/api/delivery/tasks/${id}/accept`);
      if (res.data?.success) {
        toast.success("Task accepted!");
        void fetchData();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to accept task");
    }
  };

  const handleStart = async (id: string) => {
    if (!isOnline) {
      queueAction({
        type: "status_change",
        url: `/api/delivery/tasks/${id}/start`,
        method: "POST",
        payload: {},
      });
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status: "in_progress" } : t)));
      return;
    }

    try {
      const res = await api.post(`/api/delivery/tasks/${id}/start`);
      if (res.data?.success) {
        toast.success("Task started!");
        void fetchData();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to start task");
    }
  };

  const handleComplete = async (id: string) => {
    if (!isOnline) {
      toast.error("Cannot complete task while offline. Verification checks require network.");
      return;
    }

    try {
      const res = await api.post(`/api/delivery/tasks/${id}/complete`, {
        actualWeight: undefined,
        completionNotes: "Delivered successfully.",
      });
      if (res.data?.success) {
        toast.success("Task completed successfully!");
        void fetchData();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to complete task");
    }
  };

  // QR Scanning
  const triggerScan = (id: string) => {
    setActiveScanTaskId(id);
    setScannerOpen(true);
  };

  const handleQRScan = async (text: string) => {
    try {
      const payload = JSON.parse(text);
      if (activeScanTaskId && payload.taskId !== activeScanTaskId) {
        toast.error("QR code is for a different task!");
        return;
      }

      if (!isOnline) {
        toast.error("Cannot verify QR code offline. Remote cryptographic validation required.");
        return;
      }

      const res = await api.post("/api/delivery/scan", payload);
      if (res.data?.success) {
        toast.success("QR Token verified successfully!");
        setScannerOpen(false);
        void fetchData();
      }
    } catch {
      toast.error("Invalid QR code payload format.");
    }
  };

  // Proof Capture
  const triggerCamera = (id: string) => {
    setActiveCameraTaskId(id);
    setCameraOpen(true);
  };

  const handleCapture = async (blob: Blob, dataUrl: string) => {
    if (!activeCameraTaskId) return;

    if (!isOnline) {
      // Save offline image and queue
      queueAction({
        type: "proof_upload",
        url: "/api/delivery/proofs",
        method: "POST",
        payload: {
          taskId: activeCameraTaskId,
          imageBase64: dataUrl,
          deviceType: typeof navigator !== "undefined" ? navigator.userAgent : "",
          captureTime: new Date().toISOString(),
          latitude: currentLat,
          longitude: currentLng,
        },
      });
      setCameraOpen(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", blob, "proof.jpg");
      formData.append("taskId", activeCameraTaskId);
      formData.append("deviceType", typeof navigator !== "undefined" ? navigator.userAgent : "");
      formData.append("captureTime", new Date().toISOString());
      formData.append("latitude", String(currentLat));
      formData.append("longitude", String(currentLng));

      const res = await api.post("/api/delivery/proofs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("Proof uploaded successfully!");
        setCameraOpen(false);
        void fetchData();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to upload proof");
    }
  };

  // Daily Timeline mapping
  const timelineEvents = useMemo(() => {
    return tasks.map((t) => ({
      id: t._id,
      title: `${t.wasteType.toUpperCase()} Pickup`,
      description: t.address,
      time: new Date(t.scheduledDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: (t.status === "completed"
        ? "completed"
        : t.status === "in_progress"
        ? "in-progress"
        : "pending") as "completed" | "in-progress" | "pending",
    }));
  }, [tasks]);

  return (
    <div className="flex flex-col gap-6">
      {/* Offline Sync Banner */}
      {(!isOnline || offlineCount > 0) && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600">
          <div className="flex items-center gap-2">
            {!isOnline ? <WifiOff className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
            <span className="font-medium text-sm">
              {!isOnline ? "Working Offline." : "Back Online."} {offlineCount} pending actions in queue.
            </span>
          </div>
          {isOnline && (
            <Button size="sm" variant="outline" onClick={() => void syncOfflineQueue()} className="gap-1 border-amber-500/30 hover:bg-amber-500/20">
              <RefreshCw className="h-3.5 w-3.5" /> Sync Now
            </Button>
          )}
        </div>
      )}

      {/* Analytics stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Pickups Today" value={String(analytics.tasksToday)} icon={Package} description="Assigned pickups" />
        <StatCard title="Completed Tasks" value={String(analytics.completedTasks)} icon={CheckCircle} />
        <StatCard title="Distance Covered" value={`${analytics.distanceCoveredKm} km`} icon={Truck} description="Based on GPS history" />
        <StatCard title="Proof Success Rate" value={`${analytics.proofUploadSuccessRate}%`} icon={Camera} description="Verified proof uploads" />
      </div>

      {/* Route map widget */}
      {mapOpen && (
        <Card className={cn("transition-all duration-300", mapFullscreen && "fixed inset-4 z-50 bg-background overflow-auto shadow-2xl")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle>Delivery Navigation Map</CardTitle>
              <CardDescription>Live route calculations and destinations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" onClick={() => void fetchData()} title="Refresh route">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setMapMinimized(!mapMinimized)} title={mapMinimized ? "Maximize" : "Minimize"}>
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setMapFullscreen(!mapFullscreen)} title="Toggle Fullscreen">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setMapOpen(false)} title="Close map">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {!mapMinimized && (
            <CardContent className="h-[380px] w-full">
              <RouteMap title="Live Routing Map" points={routePoints} />
            </CardContent>
          )}
        </Card>
      )}

      {!mapOpen && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setMapOpen(true)} className="gap-1">
            <RefreshCw className="h-3.5 w-3.5" /> Reopen Navigation Map
          </Button>
        </div>
      )}

      {/* QR Scanner Inline Card */}
      {scannerOpen && (
        <Card className="border-2 border-primary/40 relative">
          <button onClick={() => setScannerOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <CardContent className="pt-6">
            <QRScanner onScan={handleQRScan} />
          </CardContent>
        </Card>
      )}

      {/* Camera Capture Inline Card */}
      {cameraOpen && (
        <Card className="border-2 border-primary/40 relative">
          <button onClick={() => setCameraOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <CardContent className="pt-6">
            <CameraCapture onCapture={handleCapture} />
          </CardContent>
        </Card>
      )}

      {/* Main Grid: Tasks & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
            <CardDescription>Live pickup schedules & verification states</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-6 text-muted-foreground animate-pulse">Loading tasks from API...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No tasks currently assigned.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id}>
                      <TableCell>
                        <div className="font-semibold">{task.user?.fullName || "EcoXchange Customer"}</div>
                        <div className="text-xs text-muted-foreground">{task.wasteType.toUpperCase()} ({task.estimatedWeight}kg)</div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">{task.address}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            task.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : task.status === "in_progress"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1.5 whitespace-nowrap">
                        {task.status === "assigned" && (
                          <Button size="sm" onClick={() => void handleAccept(task._id)}>
                            Accept
                          </Button>
                        )}
                        {task.status === "accepted" && (
                          <Button size="sm" onClick={() => void handleStart(task._id)} className="bg-blue-600 hover:bg-blue-700">
                            Start
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => triggerScan(task._id)} className="gap-1 border-primary/20">
                              <ScanLine className="h-3.5 w-3.5" /> Scan QR
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => triggerCamera(task._id)} className="gap-1 border-primary/20">
                              <Camera className="h-3.5 w-3.5" /> Upload Proof
                            </Button>
                            <Button size="sm" onClick={() => void handleComplete(task._id)} className="bg-emerald-600 hover:bg-emerald-700">
                              Complete
                            </Button>
                          </>
                        )}
                        {task.user?.phoneNumber ? (
                          <a href={`tel:${task.user.phoneNumber}`} className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted text-foreground">
                            <Phone className="h-4 w-4" />
                          </a>
                        ) : (
                          <button disabled className="p-2 text-muted-foreground opacity-40">
                            <Phone className="h-4 w-4" />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Timeline events */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Timeline</CardTitle>
            <CardDescription>Real-time operational feed</CardDescription>
          </CardHeader>
          <CardContent>
            {timelineEvents.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No events recorded.</div>
            ) : (
              <Timeline items={timelineEvents} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
