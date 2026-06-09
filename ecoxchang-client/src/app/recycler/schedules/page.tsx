"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardCard } from "@/components/eco/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Trash2, Pause, Play, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Schedule {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  zone: string;
  maxCapacity: number;
  bookedCapacity: number;
  acceptedWasteCategories: string[];
  specialInstructions?: string;
  recurrence: string;
  status: "active" | "paused";
}

export default function RecyclerSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form Fields
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [zone, setZone] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(1000);
  const [categories, setCategories] = useState("plastic, paper, metal");
  const [instructions, setInstructions] = useState("");
  const [recurrence, setRecurrence] = useState("none");

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/recycler/schedules");
      if (res.data?.success) {
        setSchedules(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const splitCats = categories.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
      const payload = {
        date,
        startTime,
        endTime,
        zone,
        maxCapacity,
        acceptedWasteCategories: splitCats,
        specialInstructions: instructions,
        recurrence,
      };

      const res = await api.post("/recycler/schedules", payload);
      if (res.data?.success) {
        toast.success("Schedule created successfully");
        setShowForm(false);
        fetchSchedules();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create schedule");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await api.patch(`/recycler/schedules/${id}/status`);
      if (res.data?.success) {
        toast.success(res.data.message);
        fetchSchedules();
      }
    } catch (err) {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule slot?")) return;
    try {
      const res = await api.delete(`/recycler/schedules/${id}`);
      if (res.data?.success) {
        toast.success("Schedule deleted");
        fetchSchedules();
      }
    } catch (err) {
      toast.error("Failed to delete schedule");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Waste Collection Scheduling</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> {showForm ? "Hide Form" : "New Collection Slot"}
        </Button>
      </div>

      {showForm && (
        <DashboardCard title="Schedule new waste collection slot">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <Input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <Input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Collection Zone / Area</label>
              <Input type="text" placeholder="e.g. Zone-A, Indiranagar" required value={zone} onChange={(e) => setZone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Collection Capacity (kg)</label>
              <Input type="number" required value={maxCapacity} onChange={(e) => setMaxCapacity(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Accepted Waste Categories (comma separated)</label>
              <Input type="text" placeholder="plastic, paper, metal, glass, ewaste" value={categories} onChange={(e) => setCategories(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recurrence</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
                <option value="none">Once (none)</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Special Instructions</label>
              <Input type="text" placeholder="Instructions for drops/deliveries" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Create Schedule</Button>
            </div>
          </form>
        </DashboardCard>
      )}

      {loading ? (
        <p>Loading schedule slots...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((s) => {
            const isOverbooked = s.bookedCapacity >= s.maxCapacity;
            return (
              <DashboardCard key={s._id} title={`Collection in ${s.zone}`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {new Date(s.date).toLocaleDateString()}
                    <Clock className="h-4 w-4 ml-2" /> {s.startTime} - {s.endTime}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Zone:</span> {s.zone}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Capacity:</span> {s.bookedCapacity} / {s.maxCapacity} kg
                    {isOverbooked ? (
                      <Badge className="ml-2 bg-destructive text-destructive-foreground">Fully Booked</Badge>
                    ) : (
                      <Badge className="ml-2 bg-emerald-500 text-white">
                        {s.maxCapacity - s.bookedCapacity} kg remaining
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Accepted Categories:</span>{" "}
                    {s.acceptedWasteCategories.map((cat) => (
                      <Badge key={cat} variant="outline" className="mr-1 capitalize">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                  {s.specialInstructions && (
                    <p className="text-xs italic text-muted-foreground bg-muted p-2 rounded">
                      Note: {s.specialInstructions}
                    </p>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <Badge variant={s.status === "active" ? "default" : "secondary"}>
                      {s.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" onClick={() => handleToggleStatus(s._id)}>
                        {s.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(s._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            );
          })}
          {schedules.length === 0 && <p className="text-muted-foreground">No waste collection schedules created yet.</p>}
        </div>
      )}
    </div>
  );
}
