import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { getPersonaDetails } from '../../utils/personas';
import { getEquivalents } from '../../utils/equivalents';
import { getBenchmarkForCountry } from '../../utils/benchmarks';
import { calculateEmissions } from '../../utils/carbonEngine';
import EmissionsDonut from '../../components/charts/EmissionsDonut';
import TrendArea from '../../components/charts/TrendArea';
import CategoryBar from '../../components/charts/CategoryBar';
import GaugeChart from '../../components/charts/GaugeChart';
import ProjectionChart from '../../components/charts/ProjectionChart';
import AppLayout from '../../components/layout/AppLayout';
import { Calendar, Plus, Trophy, Flame, Zap, ArrowDown, Info, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Dashboard = () => {
  const { user } = useAuth();
  const { summary, history, projections, addWeeklyLog, loading } = useApp();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      week: '',
      transportMode: 'walking',
      dailyTravelKm: 5,
      monthlyElectricityKwh: 100,
      dietType: 'vegetarian',
      dailyDigitalHours: 4,
    }
  });

  const modalFormValues = watch();

  const handleOpenModal = () => {
    // Autopopulate week with current ISO week or defaults
    const today = new Date();
    const year = today.getFullYear();
    const oneJan = new Date(year, 0, 1);
    const numberOfDays = Math.floor((today - oneJan) / (24 * 60 * 60 * 1000));
    const weekNum = Math.ceil((today.getDay() + 1 + numberOfDays) / 7);
    const defaultWeek = `${year}-W${weekNum < 10 ? '0' + weekNum : weekNum}`;
    
    reset({
      week: defaultWeek,
      transportMode: user?.profile?.transportMode || 'walking',
      dailyTravelKm: user?.profile?.dailyTravelKm || 5,
      monthlyElectricityKwh: user?.profile?.monthlyElectricityKwh || 100,
      dietType: user?.profile?.dietType || 'vegetarian',
      dailyDigitalHours: user?.profile?.dailyDigitalHours || 4,
    });
    setIsLogModalOpen(true);
  };

  const handleLogSubmit = async (data) => {
    try {
      await addWeeklyLog(data.week, {
        transportMode: data.transportMode,
        dailyTravelKm: Number(data.dailyTravelKm),
        monthlyElectricityKwh: Number(data.monthlyElectricityKwh),
        dietType: data.dietType,
        dailyDigitalHours: Number(data.dailyDigitalHours),
      });
      setIsLogModalOpen(false);
      setLogSuccess(true);
      setTimeout(() => setLogSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  const profile = user.profile || {};

  // Persona Details
  const personaDetails = getPersonaDetails(user.persona);

  // Active Carbon Metrics
  const activeEmissions = summary ? summary.emissions : null;
  const carbonScore = summary ? summary.carbonScore : 50;
  const totalEmissions = activeEmissions ? activeEmissions.total : 0;
  const treesRequired = summary ? summary.treesRequired : 0;

  // Emotional Equivalents
  const equivalents = getEquivalents(totalEmissions);

  // Benchmarks comparison
  const benchmark = getBenchmarkForCountry(profile.country || 'IN');
  const userPercentOfNational = benchmark.national > 0 ? Math.round((totalEmissions / benchmark.national) * 100) : 0;

  // Today's Action Card
  let todaysAction = {
    title: "Switch off standby power today",
    saving: "0.4 kg CO₂",
    description: "Leaving computer monitors or TVs on standby draws trickle power. Switch off at the wall."
  };
  if (user.persona === 'daily-commuter') {
    todaysAction = {
      title: "Walk or cycle for a trip under 3km",
      saving: "1.2 kg CO₂",
      description: "Avoid taking the car out for quick neighborhood errands. Go analog instead."
    };
  } else if (user.persona === 'meat-lover') {
    todaysAction = {
      title: "Enjoy a plant-based dinner",
      saving: "2.3 kg CO₂",
      description: "Replace chicken/beef with lentils or mushrooms tonight. Healthy and green!"
    };
  }

  // Calculate live emissions inside log modal
  const liveModalEmissions = calculateEmissions(modalFormValues);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        
        {/* Top welcome row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-primary">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm font-semibold text-text-muted mt-1">
              Here is your sustainability footprint analysis and companion progress.
            </p>
          </div>
          <Button variant="primary" onClick={handleOpenModal} className="flex items-center gap-2">
            <Plus size={18} />
            Log Weekly Emissions
          </Button>
        </div>

        {logSuccess && (
          <div className="bg-green-500/10 border border-green-500/25 text-accent-green px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
            <span>🎉 Weekly log entry registered! Streaks updated, green points awarded!</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Carbon Persona Summary */}
          <Card className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-6 border border-green-500/10 bg-gradient-to-r from-bg-surface to-bg-elevated/40">
            <span className="text-7xl sm:text-8xl">{personaDetails.emoji}</span>
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-black tracking-widest text-accent-green uppercase">
                Carbon Twin Identity
              </span>
              <h2 className="text-2xl font-black text-text-primary mt-1">
                {personaDetails.name}
              </h2>
              <p className="text-sm text-text-muted mt-2 leading-relaxed font-semibold">
                {personaDetails.description}
              </p>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-bold text-text-secondary">RECOMMENDED FOCUS:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold bg-accent-green/10 text-accent-green border border-accent-green/20">
                  {personaDetails.primaryTip}
                </span>
              </div>
            </div>
          </Card>

          {/* Today's Action Card */}
          <Card className="border border-amber-500/15 bg-gradient-to-br from-bg-surface to-amber-500/5 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 right-3 text-amber-500/20">
              <Trophy size={48} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                <span>Today's Eco Action</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mt-3">
                {todaysAction.title}
              </h3>
              <p className="text-xs text-text-muted font-semibold mt-2 leading-relaxed">
                {todaysAction.description}
              </p>
            </div>
            <div className="mt-6 flex justify-between items-center border-t border-green-500/5 pt-4">
              <span className="text-xs font-bold text-amber-500">
                Saves ~{todaysAction.saving}
              </span>
              <Button variant="secondary" size="sm" className="!py-1.5 !px-3.5 border-amber-500/25 hover:bg-amber-500/10 text-amber-500 font-bold text-xs">
                Mark Completed (+50 pts)
              </Button>
            </div>
          </Card>

        </div>

        {/* Core Metrics Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="flex flex-col gap-1 border border-green-500/5 hover:border-green-500/10">
            <span className="text-xs font-bold text-text-muted uppercase">Total Footprint</span>
            <span className="text-3xl font-black font-mono text-text-primary my-1">
              {totalEmissions} kg
            </span>
            <span className="text-[10px] font-bold text-text-muted/60">CO₂ Emissions / Month</span>
          </Card>

          <Card className="flex flex-col gap-1 border border-green-500/5 hover:border-green-500/10">
            <span className="text-xs font-bold text-text-muted uppercase">Carbon Score</span>
            <span className="text-3xl font-black font-mono text-accent-lime my-1">
              {carbonScore}
            </span>
            <span className="text-[10px] font-bold text-text-muted/60">Lower Score = Better</span>
          </Card>

          <Card className="flex flex-col gap-1 border border-green-500/5 hover:border-green-500/10">
            <span className="text-xs font-bold text-text-muted uppercase">Offsets Needed</span>
            <span className="text-3xl font-black font-mono text-accent-green my-1">
              {treesRequired} trees
            </span>
            <span className="text-[10px] font-bold text-text-muted/60">To neutralize 1 month</span>
          </Card>

          <Card className="flex flex-col gap-1 border border-green-500/5 hover:border-green-500/10">
            <span className="text-xs font-bold text-text-muted uppercase">vs. Region Average</span>
            <span className="text-3xl font-black font-mono text-text-secondary my-1">
              {userPercentOfNational}%
            </span>
            <span className="text-[10px] font-bold text-text-muted/60">Relative to national baseline</span>
          </Card>
        </div>

        {/* Visual Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carbon Score Gauge */}
          <Card className="flex flex-col justify-between items-center border border-green-500/5">
            <div className="w-full text-left">
              <h3 className="text-lg font-bold text-text-primary">Carbon Footprint Rating</h3>
              <p className="text-xs text-text-muted mt-0.5 font-semibold">Scale compared to target metrics</p>
            </div>
            <GaugeChart score={carbonScore} />
            <div className="text-xs font-semibold text-text-muted text-center max-w-xs mt-2">
              Based on calculations, you emit less carbon than the average {benchmark.name} resident. Good work!
            </div>
          </Card>

          {/* Category breakdown donut */}
          <Card className="flex flex-col border border-green-500/5">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Emissions Breakdown</h3>
              <p className="text-xs text-text-muted mt-0.5 font-semibold">distribution across activities</p>
            </div>
            <div className="flex-1 mt-4">
              {activeEmissions ? (
                <EmissionsDonut data={activeEmissions} />
              ) : (
                <div className="h-48 flex items-center justify-center text-xs text-text-muted font-bold">
                  No emissions logged yet
                </div>
              )}
            </div>
          </Card>

          {/* Regional Benchmarks */}
          <Card className="flex flex-col border border-green-500/5">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Peer Benchmarks Comparison</h3>
              <p className="text-xs text-text-muted mt-0.5 font-semibold">Your footprint vs averages (kg CO₂/mo)</p>
            </div>
            
            <div className="flex-1 mt-6 flex flex-col gap-4">
              {[
                { label: 'Your Footprint', value: totalEmissions, color: 'bg-accent-green', max: 500 },
                { label: `${benchmark.name} average`, value: benchmark.national, color: 'bg-bg-elevated border border-green-500/25', max: 500 },
                { label: 'Global average', value: benchmark.global, color: 'bg-bg-elevated border border-green-500/25', max: 500 },
                { label: 'Green Leader (Top 10%)', value: benchmark.top10pct, color: 'bg-accent-lime', max: 500 },
              ].map((bar, idx) => {
                const pct = Math.min(100, (bar.value / 500) * 100);
                return (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-secondary">{bar.label}</span>
                      <span className="font-bold text-text-primary font-mono">{bar.value} kg</span>
                    </div>
                    <div className="w-full h-3 bg-bg-primary rounded-lg overflow-hidden">
                      <div 
                        className={`h-full rounded-lg transition-all duration-500 ${bar.color}`} 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Equivalents row */}
        <Card className="border border-green-500/5">
          <h3 className="text-lg font-bold text-text-primary mb-5">
            Environmental Impact Real-World Equivalents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equivalents.map((eq) => (
              <div 
                key={eq.id} 
                className={`bg-gradient-to-br ${eq.color} border border-green-500/10 p-5 rounded-2xl flex flex-col justify-between gap-4`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-4xl">{eq.icon}</span>
                  <span className="text-2xl font-black font-mono text-text-primary">{eq.value}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-primary">{eq.label}</h4>
                  <p className="text-[10px] font-semibold text-text-muted mt-1">{eq.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Future Projection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projection chart */}
          <Card className="lg:col-span-2 border border-green-500/5">
            <div>
              <h3 className="text-lg font-bold text-text-primary">3-Month Future Projections</h3>
              <p className="text-xs text-text-muted mt-0.5 font-semibold">Estimated carbon projection trajectory (kg CO₂/mo)</p>
            </div>
            <div className="mt-6">
              {projections ? (
                <ProjectionChart projections={projections} />
              ) : (
                <div className="h-56 flex items-center justify-center text-xs text-text-muted font-bold">
                  Insufficient data points to forecast.
                </div>
              )}
            </div>
          </Card>

          {/* History / Recent Logs list */}
          <Card className="border border-green-500/5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Recent Logs</h3>
              <p className="text-xs text-text-muted mt-0.5 font-semibold">Weekly entries recorded</p>
            </div>
            
            <div className="flex-1 mt-6 flex flex-col gap-3 overflow-y-auto max-h-[220px] no-scrollbar">
              {history.length > 0 ? (
                history.map((hist, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-bg-elevated/20 border border-green-500/5 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-accent-green" />
                      <span className="text-xs font-bold text-text-secondary">{hist.week}</span>
                    </div>
                    <span className="text-xs font-bold font-mono text-text-primary">{Math.round(hist.emissions.total)} kg CO₂</span>
                  </div>
                ))
              ) : (
                <div className="h-28 flex items-center justify-center text-xs text-text-muted font-bold">
                  No weekly logs submitted.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Weekly Log Modal */}
        <Modal 
          isOpen={isLogModalOpen} 
          onClose={() => setIsLogModalOpen(false)}
          title="Log Weekly Emissions"
        >
          <form onSubmit={handleSubmit(handleLogSubmit)} className="flex flex-col gap-4">
            <Input
              label="Select Week"
              type="text"
              placeholder="e.g. 2026-W25"
              error={errors.week?.message}
              {...register('week', { required: 'Week code is required' })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Primary Transit Mode</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'car', label: 'Car 🚗' },
                  { id: 'bike', label: 'Bike 🚴' },
                  { id: 'public', label: 'Transit 🚌' },
                  { id: 'walking', label: 'Walk 🚶' },
                  { id: 'wfh', label: 'WFH 🏠' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setValue('transportMode', mode.id)}
                    className={`py-2 text-center rounded-xl border text-[10px] font-black transition-all duration-200 ${
                      modalFormValues.transportMode === mode.id
                        ? 'border-accent-green bg-accent-green/10 text-text-primary'
                        : 'border-green-500/10 hover:bg-bg-elevated text-text-muted'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {modalFormValues.transportMode !== 'wfh' && (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium text-text-secondary">
                  <span>Daily Travel Distance</span>
                  <span className="font-bold text-accent-green font-mono">{modalFormValues.dailyTravelKm} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
                  {...register('dailyTravelKm')}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-medium text-text-secondary">
                <span>Monthly Grid Electricity Usage</span>
                <span className="font-bold text-accent-green font-mono">{modalFormValues.monthlyElectricityKwh} kWh</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
                {...register('monthlyElectricityKwh')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Diet Preferences</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'vegan', label: 'Vegan 🌿' },
                  { id: 'vegetarian', label: 'Veg 🥗' },
                  { id: 'omnivore', label: 'Omnivore 🍳' },
                  { id: 'meat-heavy', label: 'Carnivore 🥩' }
                ].map(diet => (
                  <button
                    key={diet.id}
                    type="button"
                    onClick={() => setValue('dietType', diet.id)}
                    className={`py-2 text-center rounded-xl border text-[10px] font-black transition-all duration-200 ${
                      modalFormValues.dietType === diet.id
                        ? 'border-accent-green bg-accent-green/10 text-text-primary'
                        : 'border-green-500/10 hover:bg-bg-elevated text-text-muted'
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-medium text-text-secondary">
                <span>Daily Digital Screen Time</span>
                <span className="font-bold text-accent-green font-mono">{modalFormValues.dailyDigitalHours} hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
                {...register('dailyDigitalHours')}
              />
            </div>

            {/* Live calculation result within the modal */}
            <div className="bg-bg-primary/50 border border-green-500/10 p-3.5 rounded-xl flex justify-between items-center text-xs font-semibold text-text-muted">
              <span>Estimated week total:</span>
              <span className="font-bold text-text-primary font-mono">{liveModalEmissions.total} kg CO₂</span>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2 font-black">
              Register Weekly Log
            </Button>
          </form>
        </Modal>

      </div>
    </AppLayout>
  );
};
export default Dashboard;
