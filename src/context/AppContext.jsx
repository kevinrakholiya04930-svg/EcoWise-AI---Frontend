import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
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

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#10b981', '#84cc16'],
    });
  }, []);

  const loadAllData = useCallback(async () => {
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
  }, [token, user]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const addWeeklyLog = useCallback(async (week, profile) => {
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
  }, [loadAllData, triggerConfetti]);

  const enrollInChallenge = useCallback(async (challengeId) => {
    try {
      await apiJoinChallenge(challengeId);
      const chalRes = await getChallenges();
      setChallenges(chalRes.data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  const finishChallenge = useCallback(async (challengeId) => {
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
  }, [triggerConfetti]);

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
