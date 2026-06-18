import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Shield, Sparkles, Zap, Leaf, Compass } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-green/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-lime/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-8 h-20 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <span className="font-extrabold text-xl tracking-wider text-text-primary">EcoWise AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
          <Button variant="primary" onClick={() => navigate('/register')}>Join Free</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-6 py-20 z-10">
        <div className="inline-flex items-center gap-2 bg-accent-green/10 border border-accent-green/20 px-4 py-1.5 rounded-full text-accent-green font-bold text-xs uppercase tracking-widest mb-6">
          <Sparkles size={14} className="animate-pulse" />
          <span>Meet Your Personal Sustainability Companion</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-text-primary via-emerald-400 to-accent-lime">
          Reduce Your Carbon Footprint <br />
          <span className="text-text-primary">with Intelligent Guidance</span>
        </h1>

        <p className="text-lg md:text-xl text-text-muted max-w-3xl mb-10 leading-relaxed font-medium">
          EcoWise AI goes beyond simple calculators. We analyze your everyday habits to deliver highly personalized sustainability goals, gamified streaks, and an interactive AI Coach.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button variant="primary" size="lg" onClick={() => navigate('/register')} className="!px-8">
            Create Your Eco Persona
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/login')} className="!px-8">
            Access Dashboard
          </Button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <Card className="hover:border-accent-green/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center text-accent-green mb-4">
              <Compass size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">1. Understand</h3>
            <p className="text-sm text-text-muted leading-relaxed font-medium">
              Discover your environmental footprint translated into intuitive real-world equivalents. Identify your unique carbon profile persona.
            </p>
          </Card>

          <Card className="hover:border-accent-emerald/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center text-accent-emerald mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">2. Live Simulators</h3>
            <p className="text-sm text-text-muted leading-relaxed font-medium">
              Adjust sliders to preview carbon reductions, trees saved, and financial gains instantly in real-time, before making changes.
            </p>
          </Card>

          <Card className="hover:border-accent-lime/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent-lime/10 flex items-center justify-center text-accent-lime mb-4">
              <Leaf size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">3. gamification</h3>
            <p className="text-sm text-text-muted leading-relaxed font-medium">
              Build streaks, unlock carbon badges, and compete in daily and weekly eco-challenges that reward sustainable choices.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-500/10 py-8 text-center text-xs font-semibold text-text-muted/50 z-10">
        <p>© 2026 EcoWise AI Platform. All rights reserved. Deployed for PromptWars.</p>
      </footer>
    </div>
  );
};
export default Landing;
