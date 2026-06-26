"use client";

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Leaf, 
  Recycle, 
  TrendingUp, 
  Users, 
  Globe, 
  Award,
  CheckCircle2,
  Quote
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8 font-medium text-sm">
              <Leaf className="h-4 w-4" />
              <span>EcoXchange: Smart Waste Management</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Transform Your Waste Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Rewards</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the revolution in sustainable living. Track your recycling, earn EcoPoints, and contribute to a cleaner environment with our intelligent platform.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/roles">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why EcoXchange?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Innovative solutions for modern environmental challenges.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Recycle, title: "Smart Tracking", desc: "Real-time monitoring of your recycling habits and environmental impact." },
              { icon: TrendingUp, title: "Reward System", desc: "Earn EcoPoints for every contribution and redeem them for exciting perks." },
              { icon: Users, title: "Community Impact", desc: "Be part of a growing movement dedicated to global sustainability." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-all bg-background/50 backdrop-blur-sm">
                  <CardContent className="pt-8">
                    <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
            {[
              { value: "50K+", label: "Eco Warriors" },
              { value: "120M", label: "KG Recycled" },
              { value: "500+", label: "Recycle Partners" },
              { value: "99%", label: "Clean City Index" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-bold tracking-tight">{stat.value}</h4>
                <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Mission Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                <Globe className="h-4 w-4" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">Driving Global Change Through Local Action</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that small individual actions lead to massive collective impact. Our mission is to digitize the waste management lifecycle, making it transparent, efficient, and rewarding for everyone involved.
              </p>
              <ul className="space-y-4">
                {[
                  "Zero-waste future commitment",
                  "Transparency in waste processing",
                  "Empowering local communities",
                  "Incentivizing sustainable habits"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center relative overflow-hidden group">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 opacity-10"
                >
                  <Recycle className="w-full h-full p-20" />
                </motion.div>
                <div className="relative z-10 text-center p-8">
                  <div className="h-20 w-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Award className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">ISO Certified</h4>
                  <p className="text-muted-foreground">Excellence in Environmental Management</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-lg text-muted-foreground">Join thousands of satisfied eco-warriors.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Sarah J.", role: "Premium Member", text: "EcoXchange turned my recycling habit into a game. I've earned so many points and my neighborhood is cleaner than ever!" },
              { name: "Marcus T.", role: "Supervisor", text: "The platform provides incredible transparency. Verifying waste collections has never been this efficient and accurate." },
              { name: "Elena R.", role: "Permanent Member", text: "The transition from trial to permanent membership was smooth. The welcome kit and smart bins are game-changers." }
            ].map((t, i) => (
              <Card key={i} className="border-none shadow-sm bg-background">
                <CardContent className="pt-8">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground italic mb-6">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <span className="font-bold text-2xl tracking-tight">EcoXchange</span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                Revolutionizing waste management through technology and community participation. Together for a greener tomorrow.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-6">Quick Links</h5>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="/roles" className="hover:text-primary transition-colors">Get Started</Link></li>
                <li><Link href="/auth/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-6">Connect</h5>
              <ul className="space-y-4 text-muted-foreground">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EcoXchange. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

