import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Flame, Award, Zap } from 'lucide-react';

const LEVEL_THRESHOLDS = {
  1: { name: '🌱 Seedling', min: 0, max: 500 },
  2: { name: '🌿 Sprout', min: 500, max: 1500 },
  3: { name: '🌳 Sapling', min: 1500, max: 3000 },
  4: { name: '🌲 Tree', min: 3000, max: 6000 },
  5: { name: '🌏 Forest', min: 6000, max: 10000 },
  6: { name: '⭐ EcoGuardian', min: 10000, max: 100000 }
};

export const Navbar = ({ title }) => {
  const { user } = useAuth();

  if (!user) return null;

  const { greenPoints = 0, level = 1, currentStreak = 0 } = user.gamification || {};
  const currentLevelInfo = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[1];

  // Calculate level progress percentage
  const range = currentLevelInfo.max - currentLevelInfo.min;
  const progressPoints = greenPoints - currentLevelInfo.min;
  const progressPercent = useMemo(() => {
    const range =
      currentLevelInfo.max - currentLevelInfo.min;

    const progressPoints =
      greenPoints - currentLevelInfo.min;

    return Math.min(
      100,
      Math.max(0, (progressPoints / range) * 100)
    );
  }, [greenPoints, currentLevelInfo]);

  return (
    <header aria-label="Page header" className="h-20 bg-bg-primary border-b border-green-500/10 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-70" role="banner" aria-label="Navigation Bar">
      {/* Title */}
      <h2 className="text-xl font-bold text-text-primary">
        {title}
      </h2>

      {/* Gamification indicators */}
      <nav className="flex items-center gap-6" aria-label="User progress information">
        {/* Streak */}
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-amber-500 font-bold text-sm shadow-sm">
          <Flame size={18} fill="currentColor" />
          <span>{currentStreak} Day Streak</span>
        </div>

        {/* Green Points */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-accent-green font-bold text-sm shadow-sm">
          <Zap size={18} fill="currentColor" />
          <span>{greenPoints.toLocaleString()} Points</span>
        </div>

        {/* Level indicator */}
        <div className="flex flex-col w-44 gap-1">
          <div className="flex justify-between text-xs font-bold text-text-secondary">
            <span>{currentLevelInfo.name}</span>
            <span>Lvl {level}</span>
          </div>
          <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden border border-green-500/5">
            <div
              className="h-full bg-gradient-to-r from-accent-green to-accent-lime transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
