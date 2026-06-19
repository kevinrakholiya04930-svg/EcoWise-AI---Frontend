import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ProgressBar from '../../components/onboarding/ProgressBar';
import NavigationButtons from '../../components/onboarding/NavigationButtons';
import {
  completeOnboardingProgress,
  getOnboardingProgress,
  saveOnboardingProgress,
} from '../../api/auth.api';

const STEP_PLACEHOLDERS = [
  {
    id: 'personal',
    label: 'Personal',
    title: 'Personal details',
    description: 'The personal step form will be added here.',
  },
  {
    id: 'transport',
    label: 'Transport',
    title: 'Transport habits',
    description: 'The transport step form will be added here.',
  },
  {
    id: 'electricity',
    label: 'Electricity',
    title: 'Electricity usage',
    description: 'The electricity step form will be added here.',
  },
  {
    id: 'lifestyle',
    label: 'Lifestyle',
    title: 'Lifestyle choices',
    description: 'The lifestyle step form will be added here.',
  },
  {
    id: 'goal',
    label: 'Goal',
    title: 'Climate goal',
    description: 'The goal step form will be added here.',
  },
];

const STORAGE_KEY = 'ecowise:onboarding-progress';

const getInitialData = () => ({
  fullName: '',
  city: '',
  transportMode: '',
  dailyDistanceKm: '',
  monthlyElectricityKwh: 100,
  dietType: '',
  screenTimeHours: '',
  goal: '',
});

const restoreDataFromProfile = (profile = {}) => ({
  ...getInitialData(),
  fullName: profile.fullName || '',
  city: profile.city || '',
  transportMode: profile.transportation?.mode || profile.transportMode || '',
  dailyDistanceKm: profile.transportation?.dailyDistanceKm ?? profile.dailyTravelKm ?? '',
  monthlyElectricityKwh: profile.electricity?.monthlyUsage ?? profile.monthlyElectricityKwh ?? 100,
  dietType: profile.lifestyle?.dietType || profile.dietType || '',
  screenTimeHours: profile.lifestyle?.screenTime ?? profile.dailyDigitalHours ?? '',
  goal: profile.sustainabilityGoal || profile.goalType || '',
});

export const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState(getInitialData);
  const [isRestoring, setIsRestoring] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveError, setSaveError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeStep = STEP_PLACEHOLDERS[currentStep];

  const stepTitleId = useMemo(
    () => `onboarding-step-title-${activeStep.id}`,
    [activeStep.id]
  );

  useEffect(() => {
    const restoreProgress = async () => {
      try {
        const localProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

        if (localProgress?.data) {
          setOnboardingData((data) => ({ ...data, ...localProgress.data }));
          setCurrentStep(localProgress.currentStep || 0);
        }

        const response = await getOnboardingProgress();
        const profile = response.data?.profile || {};
        setOnboardingData(restoreDataFromProfile(profile));
        setCurrentStep(Math.min(profile.onboardingStep || 0, STEP_PLACEHOLDERS.length - 1));
        setSaveError('');
      } catch (error) {
        setSaveError('Using saved browser progress until we can reconnect.');
      } finally {
        setIsRestoring(false);
      }
    };

    restoreProgress();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentStep, data: onboardingData })
    );
  }, [currentStep, onboardingData]);

  const persistProgress = useCallback(async (nextStep = currentStep) => {
    setSaveStatus('saving');
    setSaveError('');

    try {
      const response = await saveOnboardingProgress({
        ...onboardingData,
        onboardingStep: nextStep,
      });
      const profile = response.data?.profile;

      if (profile) {
        setOnboardingData(restoreDataFromProfile(profile));
      }

      setSaveStatus('saved');
      return response;
    } catch (error) {
      setSaveStatus('error');
      setSaveError('Progress is saved in this browser and will sync when the connection works.');
      throw error;
    }
  }, [currentStep, onboardingData]);

  const handleStepChange = (fieldName, value) => {
    setOnboardingData((data) => ({
      ...data,
      [fieldName]: value,
    }));
  };

  const handleBack = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const handleNext = async () => {
    const nextStep = Math.min(currentStep + 1, STEP_PLACEHOLDERS.length - 1);
    try {
      await persistProgress(nextStep);
      setCurrentStep(nextStep);
    } catch (error) {
      setCurrentStep(nextStep);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboardingProgress({
        ...onboardingData,
        onboardingStep: currentStep,
      });
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRestoring) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg-primary px-4 text-text-primary">
        <p className="text-sm font-bold text-text-secondary" role="status">
          Restoring onboarding progress...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary px-4 py-6 text-text-primary sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col justify-center">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-wider text-accent-green">
            EcoWise setup
          </p>
          <h1 className="mt-2 text-3xl font-black text-text-primary sm:text-4xl">
            Build your carbon profile
          </h1>
          <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-text-muted">
            Complete a few short steps so EcoWise can personalize your dashboard.
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/10 bg-bg-surface p-5 shadow-2xl shadow-black/20 sm:p-6">
          <ProgressBar steps={STEP_PLACEHOLDERS} currentStep={currentStep} />

          <section
            className="my-8 rounded-xl border border-dashed border-green-500/20 bg-bg-primary/60 p-6 sm:p-8"
            aria-labelledby={stepTitleId}
            tabIndex={-1}
          >
            <p className="mb-2 text-sm font-bold text-text-secondary">
              {activeStep.label}
            </p>
            <h2 id={stepTitleId} className="text-2xl font-black text-text-primary">
              {activeStep.title}
            </h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-text-muted">
              {activeStep.description}
            </p>
            <p className="sr-only" aria-live="polite">
              {saveStatus === 'saving' ? 'Saving onboarding progress.' : ''}
              {saveStatus === 'saved' ? 'Onboarding progress saved.' : ''}
              {saveStatus === 'error' ? saveError : ''}
            </p>
          </section>

          <div className="mb-5 min-h-5">
            {saveStatus === 'saving' && (
              <p className="text-xs font-semibold text-text-muted" role="status">
                Saving progress...
              </p>
            )}
            {saveStatus === 'saved' && (
              <p className="text-xs font-semibold text-text-secondary" role="status">
                Progress saved
              </p>
            )}
            {saveError && (
              <p className="text-xs font-semibold text-red-400" role="alert">
                {saveError}
              </p>
            )}
          </div>

          <NavigationButtons
            currentStep={currentStep}
            totalSteps={STEP_PLACEHOLDERS.length}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || saveStatus === 'saving'}
          />
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;
