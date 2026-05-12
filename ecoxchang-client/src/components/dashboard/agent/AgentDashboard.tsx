"use client";

import { StatCard } from '@/components/dashboard/StatCard';
import { Timeline } from '@/components/dashboard/Timeline';
import { BarChartWidget } from '@/components/dashboard/BarChartWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, MapPin, DollarSign, Clock, Phone } from 'lucide-react';

const efficiencyData = [
  { name: 'Mon', completed: 12, failed: 1 },
  { name: 'Tue', completed: 18, failed: 0 },
  { name: 'Wed', completed: 15, failed: 2 },
  { name: 'Thu', completed: 22, failed: 1 },
  { name: 'Fri', completed: 20, failed: 0 },
  { name: 'Sat', completed: 25, failed: 0 },
  { name: 'Sun', completed: 8, failed: 0 },
];

const assignedPickups = [
  { id: 'PK-2001', name: 'John Doe', address: '123 Main St, Downtown', type: 'Electronics', time: '10:00 AM', status: 'pending', priority: 'high' },
  { id: 'PK-2002', name: 'Jane Smith', address: '456 Oak Ave, Westside', type: 'Plastics', time: '11:30 AM', status: 'completed', priority: 'normal' },
  { id: 'PK-2003', name: 'Mike Ross', address: '789 Pine Ln, North Hills', type: 'Mixed Recyclables', time: '01:00 PM', status: 'on-route', priority: 'normal' },
  { id: 'PK-2004', name: 'Sarah Connor', address: '321 Elm St, Downtown', type: 'Glass & Metal', time: '03:00 PM', status: 'pending', priority: 'high' },
];

const timelineEvents = [
  { id: 't1', title: 'Shift Started', description: 'Vehicle inspected and ready', time: '08:00 AM', status: 'completed' as const },
  { id: 't2', title: 'Pickup PK-2001', description: 'Collected 15kg Electronics', time: '10:15 AM', status: 'completed' as const },
  { id: 't3', title: 'Pickup PK-2002', description: 'Collected 8kg Plastics', time: '11:45 AM', status: 'completed' as const },
  { id: 't4', title: 'En route to PK-2003', description: 'Current destination', time: '12:45 PM', status: 'in-progress' as const },
  { id: 't5', title: 'Pickup PK-2004', description: 'Scheduled', time: '03:00 PM', status: 'pending' as const },
  { id: 't6', title: 'Drop-off at Recycler Facility', description: 'End of day routing', time: '05:00 PM', status: 'pending' as const },
];

export function AgentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Pickups Today"
          value="12"
          icon={Package}
          description="Out of 15 assigned"
        />
        <StatCard
          title="Completed"
          value="8"
          icon={CheckCircle}
          trend={{ value: 20, isPositive: true }}
        />
        <StatCard
          title="Distance Covered"
          value="45 km"
          icon={Truck}
          description="Since shift start"
        />
        <StatCard
          title="Est. Earnings Today"
          value="₹1250"
          icon={DollarSign}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Requests Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Assigned Pickups</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">Downtown Route</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
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
                        {pickup.priority === 'high' && <Badge variant="destructive" className="px-1 py-0 text-[10px] mr-1">Urgent</Badge>}
                        {pickup.type}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
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
                          pickup.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 
                          pickup.status === 'on-route' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 
                          'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        }
                      >
                        {pickup.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {pickup.status === 'pending' && <Button size="sm">Start</Button>}
                      {pickup.status === 'on-route' && <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Complete</Button>}
                      {pickup.status === 'completed' && (
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

        {/* Timeline & Route */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Task Timeline</CardTitle>
            <CardDescription>Your operational progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineEvents} />
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartWidget 
          title="Weekly Delivery Efficiency" 
          description="Pickups completed vs failed"
          data={efficiencyData}
          xAxisKey="name"
          dataKeys={[
            { key: 'completed', name: 'Completed', color: 'var(--primary)' },
            { key: 'failed', name: 'Failed/Rescheduled', color: 'var(--destructive)' }
          ]}
        />
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Current fleet assignment</CardDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-xl border">
                <p className="text-sm text-muted-foreground mb-1">Fuel Level</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">78%</span>
                  <span className="text-sm font-medium text-emerald-600 mb-1">Good</span>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl border">
                <p className="text-sm text-muted-foreground mb-1">Capacity</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">45%</span>
                  <span className="text-sm font-medium text-amber-600 mb-1">Filling</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">Report Vehicle Issue</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
