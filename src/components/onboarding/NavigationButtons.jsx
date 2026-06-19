import React from 'react';

export const NavigationButtons = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isSubmitting = false,
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <nav
      className="flex flex-col-reverse gap-3 border-t border-green-500/10 pt-5 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Onboarding navigation"
    >
      <button
        type="button"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-green-500/20 bg-bg-elevated px-5 py-2.5 text-base font-semibold text-text-primary transition-all duration-200 hover:bg-bg-elevated/80 focus:outline-none focus:ring-2 focus:ring-accent-green/50 disabled:pointer-events-none disabled:opacity-40"
      >
        Back
      </button>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent-green px-6 py-2.5 text-base font-bold text-bg-primary shadow-lg shadow-green-500/20 transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-accent-green/50 disabled:pointer-events-none disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Complete onboarding'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-accent-green px-6 py-2.5 text-base font-bold text-bg-primary shadow-lg shadow-green-500/20 transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-accent-green/50 disabled:pointer-events-none disabled:opacity-50"
        >
          Next
        </button>
      )}
    </nav>
  );
};

export default NavigationButtons;
