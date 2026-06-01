"use client";

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserCircle, 
  ShieldCheck, 
  Truck, 
  Recycle, 
  Settings, 
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const roles = [
  {
    id: 'trial',
    title: 'Trial Member',
    description: 'Start your journey. Complete 5 streaks to unlock full membership.',
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
    features: ['5-day streak goal', 'Basic waste tracking', 'Community access'],
    link: '/login'
  },
  {
    id: 'member',
    title: 'Permanent Member',
    description: 'Full access to EcoXchange ecosystem and premium rewards.',
    icon: UserCircle,
    color: 'from-emerald-400 to-teal-600',
    features: ['Unlimited pickups', 'Smart bin included', 'EcoPoints wallet'],
    link: '/login'
  },
  {
    id: 'supervisor',
    title: 'Supervisor',
    description: 'Manage collections and verify waste authenticity.',
    icon: ShieldCheck,
    color: 'from-blue-500 to-indigo-600',
    features: ['Verification system', 'Area monitoring', 'Team management'],
    link: '/login'
  },
  {
    id: 'delivery',
    title: 'Delivery Agent',
    description: 'The backbone of our logistics. Manage routes and pickups.',
    icon: Truck,
    color: 'from-purple-500 to-pink-600',
    features: ['Route optimization', 'Pickup logs', 'Performance tracking'],
    link: '/login'
  },
  {
    id: 'recycler',
    title: 'Recycler Partner',
    description: 'Process collected waste and generate sustainability metrics.',
    icon: Recycle,
    color: 'from-cyan-500 to-blue-600',
    features: ['Processing pipeline', 'Inventory management', 'Impact reports'],
    link: '/login'
  },
  {
    id: 'admin',
    title: 'System Admin',
    description: 'Full control over platform operations and analytics.',
    icon: Settings,
    color: 'from-gray-700 to-slate-900',
    features: ['Global analytics', 'User management', 'Revenue tracking'],
    link: '/login'
  }
];

export default function RolesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Choose Your <span className="text-primary">Role</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Select how you want to contribute to the EcoXchange ecosystem. 
            Each role has a specific set of tools and responsibilities.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {roles.map((role) => (
            <motion.div key={role.id} variants={itemVariants}>
              <Card className="h-full flex flex-col group hover:shadow-xl transition-all duration-300 border-none bg-background/80 backdrop-blur-sm overflow-hidden">
                <div className={`h-2 w-full bg-gradient-to-r ${role.color}`} />
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <role.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <p className="text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href={role.link} className="w-full">
                    <Button className="w-full group/btn" variant="outline">
                      Select Role
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
