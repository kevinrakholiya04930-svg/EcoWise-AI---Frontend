import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import AppLayout from '../../components/layout/AppLayout';
import { Trophy, Flame, Leaf, Zap, Check, Lock } from 'lucide-react';

export const Achievements = () => {
  const { user, refreshUser } = useAuth();
  const { challenges, enrollInChallenge, finishChallenge, loading } = useApp();

  if (!user) return null;

  const profile = user.profile || {};
  const earnedBadges = user.gamification?.earnedBadges || [];
  const earnedIds = earnedBadges.map(b => b.id);

  // 12 Badges definitions
  const badgeDefinitions = [
    { id: 'first-steps', name: 'First Steps', emoji: '🌱', desc: 'Completed the EcoWise onboarding process.' },
    { id: 'data-driven', name: 'Data Driven', emoji: '📊', desc: 'Registered your first weekly footprint entry.' },
    { id: 'curious-mind', name: 'Curious Mind', emoji: '💬', desc: 'Held your first query session with the AI Coach.' },
    { id: 'week-warrior', name: 'Week Warrior', emoji: '🔥', desc: 'Maintained a 7-day sustainable logging streak.' },
    { id: 'month-master', name: 'Month Master', emoji: '🏆', desc: 'Maintained a 30-day logging streak.' },
    { id: 'carbon-cutter-25', name: 'Carbon Cutter 25%', emoji: '✂️', desc: 'Reduced footprint emissions by 25%.' },
    { id: 'carbon-cutter-50', name: 'Carbon Cutter 50%', emoji: '🌳', desc: 'Reduced footprint emissions by 50%.' },
    { id: 'plant-curious', name: 'Plant Curious', emoji: '🥗', desc: 'Set your profile preference to Vegetarian/Vegan.' },
    { id: 'energy-saver', name: 'Energy Saver', emoji: '⚡', desc: 'Logged energy consumption below 100 kWh.' },
    { id: 'pedal-power', name: 'Pedal Power', emoji: '🚴', desc: 'Selected Bike/Walk as primary transportation mode.' },
    { id: 'eco-pioneer', name: 'Eco Pioneer', emoji: '🌿', desc: 'Emitted less than 150 kg total CO₂ this month.' },
    { id: 'eco-guardian', name: 'Eco Guardian', emoji: '⭐', desc: 'Reached Level 5 in EcoWise.' }
  ];

  const handleJoin = async (id) => {
    try {
      await enrollInChallenge(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleComplete = async (id) => {
    try {
      await finishChallenge(id);
      await refreshUser(); // refresh user gamification stats
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        
        {/* Header summary widget */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-bg-surface to-bg-elevated/40 border border-green-500/10 p-6 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent-green/10 border border-accent-green/20 rounded-xl flex items-center justify-center text-accent-green">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-text-primary">Eco Accomplishments</h1>
              <p className="text-xs text-text-muted mt-0.5 font-bold uppercase tracking-wider">
                Earn Green Points, level up, and unlock companion badges.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="text-center">
              <span className="text-xs font-semibold text-text-muted">Badges Earned</span>
              <p className="text-2xl font-black font-mono text-text-primary mt-1">
                {earnedBadges.length} / {badgeDefinitions.length}
              </p>
            </div>
            <div className="text-center">
              <span className="text-xs font-semibold text-text-muted">Total Points</span>
              <p className="text-2xl font-black font-mono text-accent-green mt-1">
                {user.gamification?.greenPoints}
              </p>
            </div>
          </div>
        </div>

        {/* Badges Grid section */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-text-primary">Companion Badges</h2>
            <p className="text-xs text-text-muted font-semibold mt-0.5">Achievements unlocked based on habits</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badgeDefinitions.map((badge) => {
              const isEarned = earnedIds.includes(badge.id) || (badge.id === 'plant-curious' && (profile.dietType === 'vegan' || profile.dietType === 'vegetarian')) || (badge.id === 'pedal-power' && (profile.transportMode === 'bike' || profile.transportMode === 'walking')) || (badge.id === 'energy-saver' && profile.monthlyElectricityKwh <= 100);
              return (
                <Card 
                  key={badge.id} 
                  className={`flex flex-col items-center justify-between text-center p-4 h-40 border transition-all duration-300 ${
                    isEarned
                      ? 'border-accent-green/30 bg-accent-green/5'
                      : 'border-green-500/5 bg-bg-surface/20 opacity-50'
                  }`}
                >
                  <span className={`text-4xl ${isEarned ? '' : 'filter grayscale'}`}>
                    {badge.emoji}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary truncate max-w-full">
                      {badge.name}
                    </h4>
                    <p className="text-[9px] font-semibold text-text-muted mt-1 leading-snug">
                      {badge.desc}
                    </p>
                  </div>
                  {isEarned ? (
                    <Badge variant="success" className="text-[8px] py-0 px-1.5 font-black uppercase">Earned</Badge>
                  ) : (
                    <div className="text-text-muted/40 flex items-center gap-1 text-[8px] font-black uppercase">
                      <Lock size={10} />
                      <span>Locked</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* Challenges Grid section */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-text-primary">Eco Challenges</h2>
            <p className="text-xs text-text-muted font-semibold mt-0.5">Participate in daily and weekly missions to scale points</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {challenges.map((ch) => (
              <Card 
                key={ch._id}
                className={`border relative flex flex-col justify-between h-64 ${
                  ch.isFinished 
                    ? 'border-green-500/10 bg-gradient-to-br from-bg-surface to-green-500/5' 
                    : ch.isJoined 
                      ? 'border-accent-green/30 bg-gradient-to-br from-bg-surface to-accent-green/5' 
                      : 'border-green-500/5'
                }`}
              >
                <div>
                  {/* Category chip */}
                  <div className="flex justify-between items-start">
                    <Badge variant={ch.category === 'transport' ? 'info' : ch.category === 'energy' ? 'warning' : 'success'}>
                      {ch.category.toUpperCase()}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-text-secondary">
                      +{ch.pointsReward} pts
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary mt-3">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed font-semibold">
                    {ch.description}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex justify-between text-[10px] font-bold text-text-muted/60">
                    <span>Saves: {ch.estimatedSavingKg} kg CO₂</span>
                    <span>Saves: ${ch.estimatedMoneySaved}</span>
                  </div>

                  {ch.isFinished ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 w-full border border-green-500/20 rounded-xl text-xs font-black text-accent-green bg-green-500/10">
                      <Check size={14} />
                      <span>Completed!</span>
                    </div>
                  ) : ch.isJoined ? (
                    <Button 
                      variant="primary" 
                      onClick={() => handleComplete(ch._id)}
                      className="w-full text-xs py-2 bg-gradient-to-r from-accent-green to-accent-emerald text-bg-primary font-black"
                    >
                      Complete Challenge
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary" 
                      onClick={() => handleJoin(ch._id)}
                      className="w-full text-xs py-2 border-green-500/25 hover:bg-green-500/10 text-text-primary font-bold"
                    >
                      Join Challenge
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </AppLayout>
  );
};
export default Achievements;
