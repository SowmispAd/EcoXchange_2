"use client";

import { StatCard } from '@/components/dashboard/StatCard';
import { PieChartWidget } from '@/components/dashboard/PieChartWidget';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { Recycle, Factory, DollarSign, Leaf, Zap, Battery, ArrowRight } from 'lucide-react';

const incomingDeliveries = [
  { id: 'DEL-801', source: 'Downtown Hub', material: 'Plastics (PET)', weight: '1,250 kg', estArrival: '10:30 AM', status: 'arriving' },
  { id: 'DEL-802', source: 'North Hills Center', material: 'Mixed Electronics', weight: '450 kg', estArrival: '11:15 AM', status: 'arriving' },
  { id: 'DEL-803', source: 'Westside Sector', material: 'Glass & Metal', weight: '2,100 kg', estArrival: '01:00 PM', status: 'scheduled' },
  { id: 'DEL-804', source: 'Industrial Park', material: 'Paper & Cardboard', weight: '3,500 kg', estArrival: '02:30 PM', status: 'scheduled' },
];

const processedMaterialData = [
  { name: 'Plastics', value: 4500 },
  { name: 'Electronics', value: 1200 },
  { name: 'Glass', value: 3000 },
  { name: 'Metal', value: 2800 },
  { name: 'Paper', value: 5000 },
];

const revenueTrend = [
  { name: 'Jan', revenue: 125000 },
  { name: 'Feb', revenue: 142000 },
  { name: 'Mar', revenue: 138000 },
  { name: 'Apr', revenue: 165000 },
  { name: 'May', revenue: 180000 },
  { name: 'Jun', revenue: 195000 },
];

export function RecyclerDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Processed (Month)"
          value="16.5 Tons"
          icon={Factory}
          trend={{ value: 12.4, isPositive: true }}
        />
        <StatCard
          title="Carbon Offset"
          value="42,000 kg"
          icon={Leaf}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Material Value"
          value="₹4,52,000"
          icon={DollarSign}
          trend={{ value: 5.1, isPositive: true }}
        />
        <StatCard
          title="Processing Efficiency"
          value="94%"
          icon={Zap}
          description="Above industry average"
        />
      </div>

      {/* Inventory & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Incoming Deliveries</CardTitle>
              <CardDescription>Expected material shipments today</CardDescription>
            </div>
            <Button size="sm">Manage Schedule</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Est. Arrival</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomingDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.id}</TableCell>
                    <TableCell>{delivery.source}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">{delivery.material}</Badge>
                    </TableCell>
                    <TableCell>{delivery.weight}</TableCell>
                    <TableCell>{delivery.estArrival}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={delivery.status === 'arriving' ? 'default' : 'secondary'}
                        className={delivery.status === 'arriving' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
                      >
                        {delivery.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Processing Pipeline</CardTitle>
            <CardDescription>Current factory operations</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-6 justify-center">
            <ProgressWidget 
              title="Sorting Line A (Plastics)" 
              value={85} 
              max={100} 
              icon={Recycle}
              color="bg-blue-500"
            />
            <ProgressWidget 
              title="Furnace B (Glass/Metal)" 
              value={60} 
              max={100} 
              icon={Battery}
              color="bg-amber-500"
            />
            <ProgressWidget 
              title="Shredder C (Paper)" 
              value={95} 
              max={100} 
              icon={Zap}
              color="bg-emerald-500"
            />
            <Button variant="outline" className="w-full mt-2">
              View Full Diagnostics <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartWidget 
          title="Material Distribution"
          description="Breakdown of processed waste by category"
          data={processedMaterialData}
          dataKey="value"
          nameKey="name"
        />
        <ActivityChart 
          title="Revenue Trend"
          description="Monthly earnings from processed materials (₹)"
          data={revenueTrend}
          dataKey="revenue"
        />
      </div>
    </div>
  );
}
