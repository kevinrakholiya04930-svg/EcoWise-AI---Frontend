import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { getSummary, getHistory, getProjection, logEntry } from '../api/carbon.api';
import { getChallenges, joinChallenge as apiJoinChallenge, completeChallenge as apiCompleteChallenge } from '../api/gamification.api';
import confetti from 'canvas-confetti';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [projections, setProjections] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#10b981', '#84cc16']
    });
  };

  const loadAllData = async () => {
    if (!token || !user || !user.onboardingCompleted) return;
    setLoading(true);
    try {
      const [sumRes, histRes, projRes, chalRes] = await Promise.all([
        getSummary(),
        getHistory(),
        getProjection(),
        getChallenges()
      ]);
      setSummary(sumRes.data);
      setHistory(histRes.data);
      setProjections(projRes.data);
      setChallenges(chalRes.data);
    } catch (err) {
      console.error('Failed to load application data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [token, user?.onboardingCompleted]);

  const addWeeklyLog = async (week, profile) => {
    try {
      const res = await logEntry(week, profile);
      // Refresh user context and local data
      await loadAllData();
      triggerConfetti();
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const enrollInChallenge = async (challengeId) => {
    try {
      await apiJoinChallenge(challengeId);
      const chalRes = await getChallenges();
      setChallenges(chalRes.data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const finishChallenge = async (challengeId) => {
    try {
      const res = await apiCompleteChallenge(challengeId);
      const chalRes = await getChallenges();
      setChallenges(chalRes.data);
      triggerConfetti();
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      summary,
      history,
      projections,
      challenges,
      loading,
      refreshData: loadAllData,
      addWeeklyLog,
      enrollInChallenge,
      finishChallenge,
      triggerConfetti
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
