import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { calculateEmissions } from '../../utils/carbonEngine';
import AppLayout from '../../components/layout/AppLayout';
import { Sliders, Sparkles, TrendingDown, DollarSign, ShieldCheck, Leaf } from 'lucide-react';

export const Simulator = () => {
  const { user } = useAuth();
  const { summary } = useApp();

  // Baseline values loaded from summary or defaults
  const baselineTransport = user?.profile?.transportMode || 'walking';
  const baselineDistance = user?.profile?.dailyTravelKm || 5;
  const baselineElectricity = user?.profile?.monthlyElectricityKwh || 100;
  const baselineDiet = user?.profile?.dietType || 'vegetarian';
  const baselineDigital = user?.profile?.dailyDigitalHours || 4;

  const baselineEmissions = summary ? summary.emissions : calculateEmissions({
    transportMode: baselineTransport,
    dailyTravelKm: baselineDistance,
    monthlyElectricityKwh: baselineElectricity,
    dietType: baselineDiet,
    dailyDigitalHours: baselineDigital
  });

  // Simulator slider states initialized to baseline values
  const [transportMode, setTransportMode] = useState(baselineTransport);
  const [dailyTravelKm, setDailyTravelKm] = useState(baselineDistance);
  const [monthlyElectricityKwh, setMonthlyElectricityKwh] = useState(baselineElectricity);
  const [dietType, setDietType] = useState(baselineDiet);
  const [dailyDigitalHours, setDailyDigitalHours] = useState(baselineDigital);

  const simulatedEmissions = calculateEmissions({
    transportMode,
    dailyTravelKm,
    monthlyElectricityKwh,
    dietType,
    dailyDigitalHours
  });

  // Reset simulator to baseline
  const resetToBaseline = () => {
    setTransportMode(baselineTransport);
    setDailyTravelKm(baselineDistance);
    setMonthlyElectricityKwh(baselineElectricity);
    setDietType(baselineDiet);
    setDailyDigitalHours(baselineDigital);
  };

  // Compute impacts: Before vs After
  const beforeTotal = baselineEmissions.total;
  const afterTotal = simulatedEmissions.total;
  const reductionKg = Math.max(0, beforeTotal - afterTotal);
  const reductionPercent = beforeTotal > 0 ? Math.round((reductionKg / beforeTotal) * 100) : 0;
  
  // 12 months offset calculations
  const annualSavedKg = Math.round(reductionKg * 12);
  const treesSaved = Math.ceil(annualSavedKg / 21.77);

  // Financial calculations
  // Electricity: ~$0.15 saved per kWh saved
  const electricitySavedKwh = Math.max(0, baselineElectricity - monthlyElectricityKwh);
  const electricitySavedCash = electricitySavedKwh * 0.15 * 12;

  // Travel fuel/fare: ~$0.10 saved per km saved (or switching to walking/bike)
  const isSmarterTransit = (transportMode === 'walking' || transportMode === 'bike' || transportMode === 'wfh');
  const transitSavedCash = isSmarterTransit && (baselineTransport === 'car') ? (dailyTravelKm * 30 * 0.10 * 12) : 0;
  
  const annualCashSaved = Math.round(electricitySavedCash + transitSavedCash);

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        
        {/* Header summary info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-text-primary">Eco Impact Simulator</h1>
            <p className="text-sm font-semibold text-text-muted mt-1">
              Toggle sliders in real-time to preview carbon score drops, money saved, and trees saved.
            </p>
          </div>
          <Button variant="secondary" onClick={resetToBaseline} className="flex items-center gap-2">
            Reset to Baseline
          </Button>
        </div>

        {/* Live Simulator Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sliders Input Panel */}
          <Card className="lg:col-span-2 border border-green-500/10 flex flex-col gap-6 bg-gradient-to-b from-bg-surface to-bg-primary/20">
            <div>
              <span className="text-[10px] font-black tracking-widest text-accent-green uppercase">Adjust Variables</span>
              <h2 className="text-xl font-bold text-text-primary mt-0.5">Simulation Control Center</h2>
            </div>

            {/* Transport Sliders */}
            <div className="flex flex-col gap-4 border-b border-green-500/10 pb-6">
              <label className="text-sm font-bold text-text-secondary">Transportation adjustments</label>
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
                    onClick={() => setTransportMode(mode.id)}
                    className={`py-3 text-center rounded-xl border text-xs font-bold transition-all duration-200 ${
                      transportMode === mode.id
                        ? 'border-accent-green bg-accent-green/10 text-text-primary'
                        : 'border-green-500/10 hover:bg-bg-elevated text-text-muted'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {transportMode !== 'wfh' && (
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between text-xs font-semibold text-text-secondary">
                    <span>Daily commute distance</span>
                    <span className="font-bold text-accent-green font-mono">{dailyTravelKm} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={dailyTravelKm}
                    onChange={(e) => setDailyTravelKm(Number(e.target.value))}
                    className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Electricity Slider */}
            <div className="flex flex-col gap-4 border-b border-green-500/10 pb-6">
              <div className="flex justify-between text-sm font-bold text-text-secondary">
                <span>Monthly electricity usage</span>
                <span className="font-bold text-accent-green font-mono">{monthlyElectricityKwh} kWh</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={monthlyElectricityKwh}
                onChange={(e) => setMonthlyElectricityKwh(Number(e.target.value))}
                className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
              />
              <div className="flex justify-between text-[9px] font-bold text-text-muted/40">
                <span>10 kWh (Solar/Minimal)</span>
                <span>500 kWh (Standard)</span>
                <span>1000 kWh (High Consumption)</span>
              </div>
            </div>

            {/* Diet Sliders */}
            <div className="flex flex-col gap-4 border-b border-green-500/10 pb-6">
              <label className="text-sm font-bold text-text-secondary">Dietary switches</label>
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
                    onClick={() => setDietType(diet.id)}
                    className={`py-3 text-center rounded-xl border text-xs font-bold transition-all duration-200 ${
                      dietType === diet.id
                        ? 'border-accent-green bg-accent-green/10 text-text-primary'
                        : 'border-green-500/10 hover:bg-bg-elevated text-text-muted'
                    }`}
                  >
                    {diet.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Screen Hours Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm font-bold text-text-secondary">
                <span>Daily screen time & cloud usage</span>
                <span className="font-bold text-accent-green font-mono">{dailyDigitalHours} hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={dailyDigitalHours}
                onChange={(e) => setDailyDigitalHours(Number(e.target.value))}
                className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
              />
            </div>

          </Card>

          {/* Results Preview Card Panel */}
          <div className="flex flex-col gap-6">
            
            {/* Before vs After Impact Box */}
            <Card className="border border-green-500/15 bg-gradient-to-br from-bg-surface to-accent-green/5 text-center flex flex-col gap-4 py-8">
              <span className="text-[10px] font-black tracking-widest text-accent-green uppercase">Simulated Impact</span>
              
              <div className="flex items-center justify-center gap-8 mt-2">
                <div>
                  <span className="text-xs font-bold text-text-muted">BASELINE</span>
                  <p className="text-3xl font-black font-mono text-text-primary mt-1">{beforeTotal} kg</p>
                </div>
                <div className="text-text-muted/40 font-black text-xl">&rarr;</div>
                <div>
                  <span className="text-xs font-bold text-accent-green">SIMULATED</span>
                  <p className="text-3xl font-black font-mono text-accent-green mt-1">{afterTotal} kg</p>
                </div>
              </div>

              {reductionPercent > 0 ? (
                <div className="inline-flex self-center items-center gap-1.5 bg-green-500/10 border border-green-500/25 px-4 py-2 rounded-xl text-accent-green font-bold text-sm">
                  <TrendingDown size={18} />
                  <span>Saves {reductionPercent}% Emissions</span>
                </div>
              ) : (
                <div className="inline-flex self-center items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/25 px-4 py-2 rounded-xl text-yellow-500 font-bold text-sm">
                  <span>No emission reduction</span>
                </div>
              )}
            </Card>

            {/* Impact metric breakdown widgets */}
            <Card className="border border-green-500/5 flex flex-col gap-4">
              <h4 className="text-xs font-black tracking-widest text-text-secondary uppercase">Annual Equivalents Projections</h4>
              
              {/* Money Saved */}
              <div className="flex items-center gap-4 bg-bg-primary/50 border border-green-500/5 p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 font-extrabold text-lg">
                  <DollarSign size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-muted">ANNUAL CASH SAVED</span>
                  <p className="text-lg font-black text-text-primary mt-0.5">${annualCashSaved.toLocaleString()} Saved</p>
                </div>
              </div>

              {/* Trees Saved */}
              <div className="flex items-center gap-4 bg-bg-primary/50 border border-green-500/5 p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-accent-emerald">
                  <Leaf size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-muted">ANNUAL TREES SAVED</span>
                  <p className="text-lg font-black text-text-primary mt-0.5">{treesSaved} Trees Saved</p>
                </div>
              </div>

              {/* Target score rating */}
              <div className="flex items-center gap-4 bg-bg-primary/50 border border-green-500/5 p-4 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm">
                  ★
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-muted">PROJECTED CARBON SCORE</span>
                  <p className="text-lg font-black text-text-primary mt-0.5">{simulatedEmissions.score}/100 Score</p>
                </div>
              </div>

            </Card>

          </div>

        </div>

      </div>
    </AppLayout>
  );
};
export default Simulator;
