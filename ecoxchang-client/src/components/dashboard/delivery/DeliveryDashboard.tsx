"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Timeline } from "@/components/dashboard/Timeline";
import { BarChartWidget } from "@/components/dashboard/BarChartWidget";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Package, Truck, CheckCircle, MapPin, DollarSign, Clock, Phone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const efficiencyData = [
  { name: "Mon", completed: 12, failed: 1 },
  { name: "Tue", completed: 18, failed: 0 },
  { name: "Wed", completed: 15, failed: 2 },
  { name: "Thu", completed: 22, failed: 1 },
  { name: "Fri", completed: 20, failed: 0 },
  { name: "Sat", completed: 25, failed: 0 },
  { name: "Sun", completed: 8, failed: 0 },
];

const assignedPickups = [
  {
    id: "PK-2001",
    name: "John Doe",
    phone: "+91 90000 10001",
    address: "123 Main St, Downtown",
    type: "Electronics",
    time: "10:00 AM",
    status: "pending",
    priority: "high",
  },
  {
    id: "PK-2002",
    name: "Jane Smith",
    phone: "+91 90000 10002",
    address: "456 Oak Ave, Westside",
    type: "Plastics",
    time: "11:30 AM",
    status: "completed",
    priority: "normal",
  },
  {
    id: "PK-2003",
    name: "Mike Ross",
    phone: "+91 90000 10003",
    address: "789 Pine Ln, North Hills",
    type: "Mixed Recyclables",
    time: "01:00 PM",
    status: "on-route",
    priority: "normal",
  },
  {
    id: "PK-2004",
    name: "Sarah Connor",
    phone: "+91 90000 10004",
    address: "321 Elm St, Downtown",
    type: "Glass & Metal",
    time: "03:00 PM",
    status: "pending",
    priority: "high",
  },
];

const timelineEvents = [
  { id: "t1", title: "Shift Started", description: "Vehicle inspected and ready", time: "08:00 AM", status: "completed" as const },
  { id: "t2", title: "Pickup PK-2001", description: "Collected 15kg Electronics", time: "10:15 AM", status: "completed" as const },
  { id: "t3", title: "Pickup PK-2002", description: "Collected 8kg Plastics", time: "11:45 AM", status: "completed" as const },
  { id: "t4", title: "En route to PK-2003", description: "Current destination", time: "12:45 PM", status: "in-progress" as const },
  { id: "t5", title: "Pickup PK-2004", description: "Scheduled", time: "03:00 PM", status: "pending" as const },
  { id: "t6", title: "Drop-off at Recycler Facility", description: "End of day routing", time: "05:00 PM", status: "pending" as const },
];

export function DeliveryDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/delivery/scanner"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}
        >
          Open QR scanner
        </Link>
        <Link
          href="/delivery/map"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}
        >
          Route map
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Pickups Today" value="12" icon={Package} description="Out of 15 assigned" />
        <StatCard title="Completed" value="8" icon={CheckCircle} trend={{ value: 20, isPositive: true }} />
        <StatCard title="Distance Covered" value="45 km" icon={Truck} description="Since shift start" />
        <StatCard title="Est. Earnings Today" value="₹1250" icon={DollarSign} trend={{ value: 5, isPositive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Assigned tasks</CardTitle>
              <CardDescription>Today&apos;s deliveries and pickups</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              Downtown Route
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignedPickups.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell>
                      <div className="font-medium">{pickup.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center mt-1">
                        {pickup.priority === "high" && (
                          <Badge variant="destructive" className="px-1 py-0 text-[10px] mr-1">
                            Urgent
                          </Badge>
                        )}
                        {pickup.type}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{pickup.phone}</TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-sm">{pickup.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{pickup.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          pickup.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : pickup.status === "on-route"
                              ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }
                      >
                        {pickup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {pickup.status === "pending" && <Button size="sm">Start</Button>}
                      {pickup.status === "on-route" && (
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                          Complete
                        </Button>
                      )}
                      {pickup.status === "completed" && (
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily timeline</CardTitle>
            <CardDescription>Operational progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineEvents} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartWidget
          title="Weekly delivery efficiency"
          description="Pickups completed vs failed"
          data={efficiencyData}
          xAxisKey="name"
          dataKeys={[
            { key: "completed", name: "Completed", color: "var(--primary)" },
            { key: "failed", name: "Failed / rescheduled", color: "var(--destructive)" },
          ]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Vehicle</CardTitle>
            <CardDescription>Current assignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-muted rounded-xl flex items-center justify-center">
                <Truck className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">EcoVan Transit 250</h3>
                <p className="text-muted-foreground">License: EV-889-X</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Report vehicle issue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
