import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { calculateEmissions } from '../../utils/carbonEngine';
import { PERSONAS } from '../../utils/personas';
import { getPersonaDetails } from '../../utils/personas';
import { getBenchmarkForCountry } from '../../utils/benchmarks';
import { motion, AnimatePresence } from 'framer-motion';

export const Onboarding = () => {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      city: '',
      country: 'IN',
      transportMode: 'walking',
      dailyTravelKm: 5,
      monthlyElectricityKwh: 100,
      dietType: 'vegetarian',
      dailyDigitalHours: 4,
      householdSize: 1,
      goalType: 'awareness'
    }
  });

  const formValues = watch();

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      // Cast values to appropriate types
      const payload = {
        ...data,
        dailyTravelKm: Number(data.dailyTravelKm),
        monthlyElectricityKwh: Number(data.monthlyElectricityKwh),
        dailyDigitalHours: Number(data.dailyDigitalHours),
        householdSize: Number(data.householdSize)
      };
      await completeOnboarding(payload);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Live calculation preview
  const liveEmissions = calculateEmissions(formValues);
  const tempPersona = liveEmissions.score < 25 ? 'green-pioneer' : 
                      formValues.monthlyElectricityKwh > 240 ? 'energy-consumer' :
                      formValues.transportMode === 'car' && formValues.dailyTravelKm > 10 ? 'daily-commuter' :
                      formValues.dailyDigitalHours > 6 ? 'digital-nomad' :
                      formValues.dietType === 'meat-heavy' ? 'meat-lover' : 'green-pioneer';

  const personaDetails = getPersonaDetails(tempPersona);

  const stepsCount = 5;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-accent-green/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-lime/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl flex flex-col gap-6 relative z-10">
        
        {/* Onboarding Header / Step Progress */}
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-sm font-bold text-text-secondary">
            <span>EcoWise Onboarding</span>
            <span>Step {step} of {stepsCount}</span>
          </div>
          <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden border border-green-500/5">
            <div 
              className="h-full bg-accent-green transition-all duration-300"
              style={{ width: `${(step / stepsCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Multi-step form box */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">Where are you located?</h2>
                    <p className="text-sm text-text-muted mt-1 font-semibold">
                      This allows us to calibrate local grid benchmarks and transport factors.
                    </p>
                  </div>

                  <Input
                    label="Current City"
                    placeholder="e.g. Mumbai, New York"
                    {...register('city', { required: 'City name is required' })}
                    error={errors.city?.message}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Country / Region</label>
                    <select
                      className="bg-bg-primary border border-green-500/20 rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-green"
                      {...register('country')}
                    >
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="DEFAULT">Other / Global</option>
                    </select>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="primary" onClick={handleNext}>Next Step &rarr;</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">Transportation Habits</h2>
                    <p className="text-sm text-text-muted mt-1 font-semibold">
                      How do you usually commute, and what is your average travel distance?
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Primary Transit Mode</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                          className={`py-3.5 px-2 text-center rounded-xl border text-sm font-bold transition-all duration-200 ${
                            formValues.transportMode === mode.id
                              ? 'border-accent-green bg-accent-green/10 text-text-primary'
                              : 'border-green-500/10 hover:bg-bg-elevated text-text-muted'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formValues.transportMode !== 'wfh' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm font-medium text-text-secondary">
                        <span>Daily Travel Distance</span>
                        <span className="font-bold text-accent-green font-mono">{formValues.dailyTravelKm} km</span>
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

                  <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={handlePrev}>&larr; Back</Button>
                    <Button variant="primary" onClick={handleNext}>Next Step &rarr;</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">Home & Utility Energy</h2>
                    <p className="text-sm text-text-muted mt-1 font-semibold">
                      Your home electricity consumption is a primary source of grid emissions.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-medium text-text-secondary">
                      <span>Monthly Grid Electricity Usage</span>
                      <span className="font-bold text-accent-green font-mono">{formValues.monthlyElectricityKwh} kWh</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1000"
                      step="10"
                      className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
                      {...register('monthlyElectricityKwh')}
                    />
                    <div className="flex justify-between text-[10px] font-bold text-text-muted/40">
                      <span>10 kWh (Low)</span>
                      <span>500 kWh (Avg)</span>
                      <span>1000 kWh (High)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-medium text-text-secondary">
                      <span>Household Size</span>
                      <span className="font-bold text-accent-green font-mono">{formValues.householdSize} People</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
                      {...register('householdSize')}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={handlePrev}>&larr; Back</Button>
                    <Button variant="primary" onClick={handleNext}>Next Step &rarr;</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">Diet & Digital Footprint</h2>
                    <p className="text-sm text-text-muted mt-1 font-semibold">
                      Your meals and data usage carry hidden environmental costs.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-secondary">Diet Preferences</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                          className={`py-3 px-1.5 text-center rounded-xl border text-sm font-bold transition-all duration-200 ${
                            formValues.dietType === diet.id
                              ? 'border-accent-green bg-accent-green/10 text-text-primary'
                              : 'border-green-500/10 hover:bg-bg-elevated text-text-muted'
                          }`}
                        >
                          {diet.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm font-medium text-text-secondary">
                      <span>Daily Digital Device Screen Time</span>
                      <span className="font-bold text-accent-green font-mono">{formValues.dailyDigitalHours} hours</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="16"
                      className="w-full accent-accent-green bg-bg-elevated h-2 rounded-lg"
                      {...register('dailyDigitalHours')}
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={handlePrev}>&larr; Back</Button>
                    <Button variant="primary" onClick={handleNext}>Next Step &rarr;</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-text-primary">Onboarding Result</h2>
                    <p className="text-sm text-text-muted mt-1 font-semibold">
                      Review your calculated environmental profile persona and set goals.
                    </p>
                  </div>

                  {/* Calculated Persona Badge */}
                  <div className="flex items-center gap-4 bg-bg-primary/50 border border-green-500/10 p-5 rounded-2xl">
                    <span className="text-5xl">{personaDetails.emoji}</span>
                    <div>
                      <span className="text-xs font-black tracking-widest text-accent-green uppercase">YOUR PERSONA</span>
                      <h4 className="text-lg font-bold text-text-primary mt-0.5">{personaDetails.name}</h4>
                      <p className="text-xs font-semibold text-text-muted mt-0.5">{personaDetails.description}</p>
                    </div>
                  </div>

                  {/* Initial Emissions Results Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-bg-elevated/40 border border-green-500/5 p-4 rounded-xl">
                      <span className="text-xs font-bold text-text-muted uppercase">Total Monthly</span>
                      <p className="text-2xl font-black font-mono text-text-primary mt-1">{liveEmissions.total} kg</p>
                      <p className="text-[10px] font-semibold text-text-muted/60 mt-0.5">CO₂ Emissions</p>
                    </div>
                    <div className="bg-bg-elevated/40 border border-green-500/5 p-4 rounded-xl">
                      <span className="text-xs font-bold text-text-muted uppercase">Carbon Score</span>
                      <p className="text-2xl font-black font-mono text-accent-lime mt-1">{liveEmissions.score}/100</p>
                      <p className="text-[10px] font-semibold text-text-muted/60 mt-0.5">Lower score is better</p>
                    </div>
                  </div>

                  {/* Goal Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-secondary">Reduction Target</label>
                    <select
                      className="bg-bg-primary border border-green-500/20 rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-accent-green"
                      {...register('goalType')}
                    >
                      <option value="awareness">Awareness Only (Track footprint first)</option>
                      <option value="reduce25">Moderate Reducer (Cut emissions 25%)</option>
                      <option value="reduce50">Eco Pioneer (Cut emissions 50% target)</option>
                      <option value="offset">Neutralizer (Target 100% Tree Offset)</option>
                    </select>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={handlePrev}>&larr; Back</Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={submitting}
                      className="!px-8 bg-gradient-to-r from-accent-green to-accent-lime text-bg-primary font-black text-base"
                    >
                      {submitting ? 'Calibrating...' : 'Complete & Generate Dashboard'}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};
export default Onboarding;
