"use client";

import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { ProgressWidget } from '@/components/dashboard/ProgressWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Award, Leaf, Recycle, Calendar, Camera, Droplet, TreePine, Gift, Clock } from 'lucide-react';
import { MemberStats } from './MemberStats';
import { useAuthStore } from '@/store/useAuthStore';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Pickup, RewardItem } from '@/types/api';

const activityData = [
  { name: 'Mon', recycled: 12 },
  { name: 'Tue', recycled: 19 },
  { name: 'Wed', recycled: 15 },
  { name: 'Thu', recycled: 22 },
  { name: 'Fri', recycled: 28 },
  { name: 'Sat', recycled: 35 },
  { name: 'Sun', recycled: 42 },
];

export function MemberDashboard() {
  const name = useAuthStore((s) => s.user?.name ?? 'Member');

  const { data: pickupsData } = useQuery({
    queryKey: ['my-pickups'],
    queryFn: async () => {
      const res = await api.get('/pickups/my');
      return res.data.data;
    },
  });

  const { data: marketplaceData } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const res = await api.get('/rewards');
      return res.data.data;
    },
  });

  const { data: walletData } = useQuery({
    queryKey: ["wallet-me"],
    queryFn: async () => {
      const res = await api.get("/wallet/me");
      return res.data.data;
    },
  });

  const recentPickups = pickupsData || [];
  const marketplaceItems = marketplaceData || [];
  const ecoPoints = walletData?.ecoPointsBalance || 0;
  
  // Calculate total recycled from pickups
  const totalRecycled = recentPickups
    .filter((p: Pickup) => p.status === 'completed')
    .reduce((sum: number, p: Pickup) => sum + (Number(p.weight) || 0), 0);
    
  // Find next scheduled pickup
  const nextPickup = recentPickups
    .filter((p: Pickup) => p.status === 'scheduled' && p.scheduledDate && new Date(p.scheduledDate) >= new Date())
    .sort((a: Pickup, b: Pickup) => new Date(a.scheduledDate!).getTime() - new Date(b.scheduledDate!).getTime())[0];
    
  const nextPickupDate = nextPickup && nextPickup.scheduledDate ? new Date(nextPickup.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'None';
  const activeRequests = recentPickups.filter((p: Pickup) => p.status === 'scheduled' || p.status === 'pending').length;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-2xl font-semibold tracking-tight">
        Hi, {name} <span aria-hidden>👋</span>
      </p>
      <MemberStats />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Recycled"
          value={`${totalRecycled} kg`}
          icon={Recycle}
          description="Your lifetime impact"
          trend={totalRecycled > 0 ? { value: 100, isPositive: true } : undefined}
        />
        <StatCard
          title="Next Pickup"
          value={nextPickupDate}
          icon={Calendar}
          description={nextPickup ? "10:00 AM - 12:00 PM" : "Schedule now"}
        />
        <StatCard
          title="EcoPoints Earned"
          value={ecoPoints.toLocaleString()}
          icon={Award}
          description="Available balance"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Active Requests"
          value={activeRequests.toString()}
          icon={Calendar}
          description="Pending pickup"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart 
            title="Personal Eco Impact" 
            description="Your recycling volume (kg) over the last 7 days"
            data={activityData}
            dataKey="recycled"
          />
        </div>
        <div className="flex flex-col gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                AI Waste Scanner
              </CardTitle>
              <CardDescription>Not sure how to recycle something?</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center justify-center py-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-2 border-primary/20 border-dashed">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <p className="text-xs font-medium mb-4">Scan items to get instant sorting instructions.</p>
              <Button size="sm" className="w-full">Launch Scanner</Button>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Recycle className="h-5 w-5 text-blue-500" />
                Smart Bin Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-3xl font-black text-blue-600">68%</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fill Level</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none">Connected</Badge>
                  <p className="text-[10px] mt-1 font-medium text-muted-foreground">Last sync: 2m ago</p>
                </div>
              </div>
              <Progress value={68} className="h-2 bg-blue-100" />
              <div className="pt-2 flex items-center gap-2 text-xs font-medium text-blue-700">
                <Clock className="h-3.5 w-3.5" />
                Next pickup estimated in 2 days
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressWidget 
          title="Carbon Saved" 
          description="Equivalent to planting trees" 
          value={45} 
          max={100} 
          icon={TreePine} 
          color="bg-emerald-500" 
        />
        <ProgressWidget 
          title="Water Conserved" 
          description="From recycled plastics" 
          value={120} 
          max={500} 
          icon={Droplet} 
          color="bg-blue-500" 
        />
        <ProgressWidget 
          title="Tier Progress" 
          description="Points to Platinum" 
          value={2450} 
          max={3000} 
          icon={Award} 
          color="bg-amber-500" 
        />
      </div>

      <Card>
        <CardHeader className="pb-0">
          <Tabs defaultValue="pickups" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="pickups">My Pickups</TabsTrigger>
              <TabsTrigger value="rewards">Reward Marketplace</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pickups" className="pt-6 pb-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <CardTitle className="text-lg">Recent Pickups</CardTitle>
                  <CardDescription>Your latest recycling collection requests</CardDescription>
                </div>
                <Button size="sm"><Calendar className="h-4 w-4 mr-2"/> Schedule New</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Points Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPickups.map((pickup: Pickup) => (
                    <TableRow key={pickup._id}>
                      <TableCell className="font-medium">{(pickup.scheduledDate || pickup.createdAt) ? new Date(pickup.scheduledDate || pickup.createdAt!).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell className="capitalize">{pickup.wasteType || pickup.type}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            pickup.status === 'completed' ? 'default' : 
                            pickup.status === 'scheduled' ? 'secondary' : 'outline'
                          }
                          className={pickup.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 capitalize' : 'capitalize'}
                        >
                          {pickup.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                        +{pickup.ecoPointsAwarded || pickup.earnedPoints || pickup.points || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="rewards" className="pt-6 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {marketplaceItems.map((item: RewardItem) => (
                  <Card key={item._id || item.id} className="border border-muted hover:border-primary/50 transition-colors">
                    <CardHeader className="text-center pb-2">
                      <div className="text-6xl mb-2">{item.image || '🎁'}</div>
                      <CardTitle className="text-base">{item.title || item.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <div className="flex items-center gap-1 font-bold text-primary">
                        <Gift className="h-4 w-4" /> {item.pointsRequired || item.points}
                      </div>
                      <Button variant="outline" size="sm">Redeem</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  );
}
