"use client";

import { useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { PieChartWidget } from '@/components/dashboard/PieChartWidget';
import { BarChartWidget } from '@/components/dashboard/BarChartWidget';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Camera,
  CalendarCheck,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialTrialRequests = [
  { id: 'TR-101', member: 'Rahul S.', wasteType: 'Plastic Waste', day: 'Tuesday', time: '10:45 AM', status: 'pending' },
  { id: 'TR-102', member: 'Priya K.', wasteType: 'Plastic Waste', day: 'Tuesday', time: '11:20 AM', status: 'pending' },
  { id: 'TR-103', member: 'Amit V.', wasteType: 'Wet Waste', day: 'Monday', time: '09:15 AM', status: 'pending' },
];

const pendingRequests = [
  { id: 'REQ-5001', member: 'John Doe', area: 'Downtown', type: 'Electronics', scheduled: 'Today, 14:00', status: 'pending', priority: 'high' },
  { id: 'REQ-5002', member: 'Jane Smith', area: 'Westside', type: 'Plastics', scheduled: 'Today, 15:30', status: 'pending', priority: 'normal' },
];

export function SupervisorDashboard() {
  const [trialRequests, setTrialRequests] = useState(initialTrialRequests);
  const [notified, setNotified] = useState<string | null>(null);

  const handleAction = (id: string, action: 'approve' | 'reject') => {
    setTrialRequests(prev => prev.filter(req => req.id !== id));
    setNotified(action === 'approve' ? "Streak increased for member!" : "Request rejected.");
    setTimeout(() => setNotified(null), 3000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Notifications */}
      <AnimatePresence>
        {notified && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-50 bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5" />
            {notified}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Verifications"
          value={trialRequests.length.toString()}
          icon={ClipboardList}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Active Trial Members"
          value="142"
          icon={Users}
          description="Monitoring progression"
        />
        <StatCard
          title="Validation Accuracy"
          value="98.2%"
          icon={ShieldAlert}
          trend={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Conversion Rate"
          value="64%"
          icon={CalendarCheck}
          description="Trial to Permanent"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Trial Verifications Table */}
        <Card className="xl:col-span-2 border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Trial Verifications</CardTitle>
                <CardDescription>Verify waste type and collection day for trial members</CardDescription>
              </div>
              <Badge className="bg-primary/20 text-primary border-none px-4 py-1">Live Feed</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="pl-6">Trial Member</TableHead>
                  <TableHead>Waste Type</TableHead>
                  <TableHead>Collection Day</TableHead>
                  <TableHead className="text-right pr-6">Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {trialRequests.map((req) => (
                    <motion.tr 
                      key={req.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="group hover:bg-muted/30 transition-colors border-b last:border-none"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {req.member.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold">{req.member}</p>
                            <p className="text-xs text-muted-foreground">{req.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted font-medium">{req.wasteType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{req.day}</p>
                          <span className="text-xs text-muted-foreground">• {req.time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl text-destructive hover:bg-destructive/10"
                            onClick={() => handleAction(req.id, 'reject')}
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl text-emerald-600 hover:bg-emerald-600/10"
                            onClick={() => handleAction(req.id, 'approve')}
                          >
                            <CheckCircle2 className="h-5 w-5" />
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-xl">
                            <Camera className="h-4 w-4 mr-2" /> View Photo
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {trialRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
                        <p className="font-medium">All verifications completed!</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Analytics Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-md rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle>Fleet Status</CardTitle>
              <CardDescription>Live agent tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'David Miller', zone: 'Downtown', status: 'on-route' },
                  { name: 'Alex Wong', zone: 'Westside', status: 'available' },
                  { name: 'Maria Garcia', zone: 'North Hills', status: 'returning' },
                ].map((agent, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{agent.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{agent.status}</p>
                      </div>
                    </div>
                    <Badge className={agent.status === 'available' ? 'bg-emerald-500' : 'bg-blue-500'}>
                      {agent.zone}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl overflow-hidden">
            <CardContent className="pt-8 text-center">
              <div className="bg-white/20 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Performance Goal</h4>
              <p className="text-indigo-100 text-sm mb-6">You've verified 92% of today's Trial requests. 8% remaining for the daily bonus!</p>
              <Progress value={92} className="h-2 bg-white/20 mb-4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

