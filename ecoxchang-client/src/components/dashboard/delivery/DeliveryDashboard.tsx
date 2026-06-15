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
    <div className="flex flex-col gap-6 pb-12">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Pickups Today" value={String(analytics.tasksToday)} icon={Package} description="Assigned pickups" />
        <StatCard title="Completed Tasks" value={String(analytics.completedTasks)} icon={CheckCircle} />
        <StatCard title="Distance Covered" value={`${analytics.distanceCoveredKm} km`} icon={Truck} description="Based on GPS history" />
        <StatCard title="Proof Success Rate" value={`${analytics.proofUploadSuccessRate}%`} icon={Camera} description="Verified uploads" />
      </div>

      {/* PRIORITY UI: 2x2 Grid for Tasks, Map, Scanner, Camera */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. Assigned Tasks Card */}
        <Card className="flex flex-col h-[450px] shadow-lg border-primary/20">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" /> Assigned Tasks
            </CardTitle>
            <CardDescription>Live pickup schedules & status</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {loading ? (
              <div className="text-center py-6 text-muted-foreground animate-pulse">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">No tasks currently assigned.</div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task._id} className={task.status === "in_progress" ? "bg-blue-500/5" : ""}>
                      <TableCell className="py-3">
                        <div className="font-semibold text-sm">{task.user?.fullName || "Customer"}</div>
                        <div className="text-xs text-muted-foreground max-w-[150px] truncate" title={task.address}>{task.address}</div>
                      </TableCell>
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
                          <Button size="sm" onClick={() => void handleAccept(task._id)} className="w-20">
                            Accept
                          </Button>
                        )}
                        {task.status === "accepted" && (
                          <Button size="sm" onClick={() => void handleStart(task._id)} className="bg-blue-600 hover:bg-blue-700 w-20">
                            Start
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <div className="flex flex-col gap-1.5 items-end">
                            <div className="flex gap-1.5">
                              <Button size="sm" variant="outline" onClick={() => triggerScan(task._id)} className="h-8 px-2 border-primary/20 bg-background" title="Scan QR">
                                <ScanLine className="h-4 w-4 text-primary" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => triggerCamera(task._id)} className="h-8 px-2 border-primary/20 bg-background" title="Capture Proof">
                                <Camera className="h-4 w-4 text-primary" />
                              </Button>
                            </div>
                            <Button size="sm" onClick={() => void handleComplete(task._id)} className="bg-emerald-600 hover:bg-emerald-700 h-8 w-full text-xs">
                              Complete
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* 2. Route Navigation Card */}
        <Card className={cn("flex flex-col h-[450px] shadow-lg border-primary/20", mapFullscreen && "fixed inset-4 z-50 bg-background shadow-2xl h-auto")}>
          <CardHeader className="pb-3 border-b border-border/50 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" /> Route Navigation
              </CardTitle>
              <CardDescription>Live route to destinations</CardDescription>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" onClick={() => void fetchData()} className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => setMapFullscreen(!mapFullscreen)} className="h-8 w-8">
                {mapFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden relative min-h-[300px]">
            <RouteMap title="Live Routing Map" points={routePoints} />
          </CardContent>
        </Card>

        {/* 3. QR Scanner Card */}
        <Card className="flex flex-col min-h-[350px] shadow-lg border-primary/20 bg-background/50">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-primary" /> QR Scanner
            </CardTitle>
            <CardDescription>Verify customer pickup QR codes</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 relative">
            {scannerOpen ? (
              <div className="w-full h-full relative">
                <button onClick={() => setScannerOpen(false)} className="absolute top-2 right-2 z-10 p-2 bg-background/80 rounded-full text-muted-foreground hover:text-foreground shadow">
                  <X className="h-4 w-4" />
                </button>
                <div className="rounded-xl overflow-hidden shadow-inner border h-[250px] flex items-center justify-center bg-black/5">
                  <QRScanner onScan={handleQRScan} />
                </div>
              </div>
            ) : (
              <div className="text-center w-full max-w-sm">
                <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ScanLine className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Scanner Inactive</h3>
                <p className="text-sm text-muted-foreground mb-6">Select a task and click 'Scan QR' to activate the camera scanner.</p>
                <Button 
                  size="lg" 
                  className="w-full font-bold h-14 text-lg" 
                  onClick={() => {
                    const activeTask = tasks.find(t => t.status === "in_progress");
                    if (activeTask) triggerScan(activeTask._id);
                    else toast.error("Start a task first to scan its QR code.");
                  }}
                >
                  <ScanLine className="mr-2 h-5 w-5" /> Launch Scanner
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 4. Camera Capture Card */}
        <Card className="flex flex-col min-h-[350px] shadow-lg border-primary/20 bg-background/50">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" /> Proof Capture
            </CardTitle>
            <CardDescription>Upload photographic proof of pickup</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center p-6 relative">
            {cameraOpen ? (
              <div className="w-full h-full relative">
                <button onClick={() => setCameraOpen(false)} className="absolute top-2 right-2 z-10 p-2 bg-background/80 rounded-full text-muted-foreground hover:text-foreground shadow">
                  <X className="h-4 w-4" />
                </button>
                <div className="rounded-xl overflow-hidden shadow-inner border h-[250px] flex items-center justify-center bg-black/5">
                  <CameraCapture onCapture={handleCapture} />
                </div>
              </div>
            ) : (
              <div className="text-center w-full max-w-sm">
                <div className="h-20 w-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Camera Inactive</h3>
                <p className="text-sm text-muted-foreground mb-6">Select a task and click 'Upload Proof' to take a photo of the collected waste.</p>
                <Button 
                  size="lg" 
                  className="w-full font-bold h-14 text-lg bg-blue-600 hover:bg-blue-700" 
                  onClick={() => {
                    const activeTask = tasks.find(t => t.status === "in_progress");
                    if (activeTask) triggerCamera(activeTask._id);
                    else toast.error("Start a task first to capture proof.");
                  }}
                >
                  <Camera className="mr-2 h-5 w-5" /> Launch Camera
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Timeline events */}
      <Card className="shadow-lg border-border/50">
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
  );
}
