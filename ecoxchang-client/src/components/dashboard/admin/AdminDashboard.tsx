"use client";

import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { BarChartWidget } from '@/components/dashboard/BarChartWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, Search, Filter, MoreHorizontal, ShieldCheck, Factory, Sparkles } from 'lucide-react';
import { Timeline } from '@/components/dashboard/Timeline';

const revenueData = [
  { name: 'Jan', subscription: 15000, recycling: 12000 },
  { name: 'Feb', subscription: 16500, recycling: 14200 },
  { name: 'Mar', subscription: 18000, recycling: 13800 },
  { name: 'Apr', subscription: 21000, recycling: 16500 },
  { name: 'May', subscription: 24500, recycling: 18000 },
  { name: 'Jun', subscription: 28000, recycling: 19500 },
];

const collectionForecast = [
  { name: 'Week 1', actual: 4200, forecast: 4100 },
  { name: 'Week 2', actual: 4500, forecast: 4400 },
  { name: 'Week 3', actual: 4100, forecast: 4600 },
  { name: 'Week 4', actual: 4800, forecast: 4700 },
  { name: 'Week 5', actual: 0, forecast: 5100 },
  { name: 'Week 6', actual: 0, forecast: 5300 },
];

const usersData = [
  { id: 'USR-001', name: 'Alice Johnson', role: 'Member', status: 'Active', joinDate: 'Oct 10, 2023' },
  { id: 'AGT-002', name: 'Bob Smith', role: 'Agent', status: 'Active', joinDate: 'Oct 12, 2023' },
  { id: 'REC-003', name: 'GreenCorp Ltd.', role: 'Recycler', status: 'Verified', joinDate: 'Oct 15, 2023' },
  { id: 'SUP-004', name: 'Diana Prince', role: 'Supervisor', status: 'Active', joinDate: 'Nov 01, 2023' },
  { id: 'USR-005', name: 'Evan Wright', role: 'Member', status: 'Suspended', joinDate: 'Nov 05, 2023' },
];

const systemEvents = [
  { id: 'evt1', title: 'New Recycler Partner Onboarded', description: 'GreenCorp Ltd. completed verification.', time: '10 mins ago', status: 'completed' as const },
  { id: 'evt2', title: 'High Volume Alert', description: 'Downtown sector experiencing 200% normal load.', time: '1 hr ago', status: 'in-progress' as const },
  { id: 'evt3', title: 'System Maintenance Scheduled', description: 'Database optimization planned.', time: 'Tonight, 02:00 AM', status: 'pending' as const },
  { id: 'evt4', title: 'Monthly Payouts Processed', description: 'Successfully distributed ₹42k to members.', time: 'Yesterday', status: 'completed' as const },
];

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top AI Insight Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-primary flex items-center gap-2">
              AI Platform Insight
            </h4>
            <p className="text-sm text-muted-foreground">Forecast indicates a 15% surge in electronic waste next week. Consider increasing agent allocation in industrial zones.</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">Review Forecast</Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="12,450"
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Trial Conversions"
          value="84"
          icon={Sparkles}
          description="Last 30 days"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Platform Revenue (MRR)"
          value="₹47,500"
          icon={DollarSign}
          trend={{ value: 14.3, isPositive: true }}
        />
        <StatCard
          title="System Health"
          value="99.9%"
          icon={ShieldCheck}
          description="All services operational"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarChartWidget 
            title="Revenue Streams" 
            description="Comparing membership fees vs recycling profit share"
            data={revenueData}
            xAxisKey="name"
            dataKeys={[
              { key: 'subscription', name: 'Membership Fees', color: 'var(--primary)' },
              { key: 'recycling', name: 'Recycling Share', color: '#3b82f6' }
            ]}
          />
        </div>
        <Card className="flex flex-col border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl">
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Real-time platform events</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <Timeline items={systemEvents} />
          </CardContent>
        </Card>
      </div>
      
      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl">
          <CardHeader>
            <CardTitle>Demographics</CardTitle>
            <CardDescription>Breakdown by user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Permanent Members</span>
                </div>
                <span className="font-bold">8,400</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2 w-[65%]" />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium">Trial Members</span>
                </div>
                <span className="font-bold">2,800</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-amber-500 rounded-full h-2 w-[20%]" />
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Logistics & Partners</span>
                </div>
                <span className="font-bold">1,250</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 rounded-full h-2 w-[15%]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <ActivityChart 
            title="Waste Volume Forecast" 
            description="Historical data vs AI predictive model (kg)"
            data={collectionForecast}
            dataKey="actual"
          />
        </div>
      </div>

      {/* Multi-Role Management Table */}
      <Card className="border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardHeader className="pb-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <CardTitle className="text-2xl font-bold">User & Entity Management</CardTitle>
                <CardDescription>Manage platform access and privileges</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-9 rounded-xl" />
                </div>
                <Button variant="outline" size="icon" className="rounded-xl"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
            
            <TabsList className="grid w-full grid-cols-5 md:w-[600px] mb-4 bg-muted/50 rounded-2xl p-1">
              <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
              <TabsTrigger value="trials" className="rounded-xl">Trials</TabsTrigger>
              <TabsTrigger value="members" className="rounded-xl">Members</TabsTrigger>
              <TabsTrigger value="agents" className="rounded-xl">Agents</TabsTrigger>
              <TabsTrigger value="partners" className="rounded-xl">Partners</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-xs text-muted-foreground">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize bg-muted/50">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.status === 'Active' ? 'default' : 
                            user.status === 'Verified' ? 'default' : 'secondary'
                          }
                          className={
                            (user.status === 'Active' || user.status === 'Verified') 
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
                              : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          }
                        >
                          {user.status === 'Verified' && <ShieldCheck className="mr-1 h-3 w-3" />}
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
