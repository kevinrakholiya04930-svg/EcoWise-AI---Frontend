import React from 'react';

export const ProgressBar = ({ steps, currentStep }) => {
  const totalSteps = steps.length;
  const currentStepNumber = currentStep + 1;
  const progress = (currentStepNumber / totalSteps) * 100;

  return (
    <section
      className="w-full"
      aria-label="Onboarding progress"
      aria-describedby="onboarding-progress-status"
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <p
          id="onboarding-progress-status"
          className="text-sm font-bold text-text-secondary"
          aria-live="polite"
        >
          Step {currentStepNumber} of {totalSteps}
        </p>
        <p className="text-sm font-semibold text-text-muted">
          {steps[currentStep]?.label}
        </p>
      </div>

      <div
        className="h-2 w-full overflow-hidden rounded-full border border-green-500/10 bg-bg-elevated"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStepNumber}
        aria-valuetext={`Step ${currentStepNumber} of ${totalSteps}: ${steps[currentStep]?.label}`}
      >
        <div
          className="h-full rounded-full bg-accent-green transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-4 grid grid-cols-5 gap-2" aria-label="Onboarding steps">
        {steps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <li key={step.id} className="min-w-0">
              <span
                className={[
                  'block h-1.5 rounded-full transition-colors duration-200',
                  isComplete || isCurrent ? 'bg-accent-green' : 'bg-bg-elevated',
                ].join(' ')}
                aria-hidden="true"
              />
              <span className="sr-only">
                {step.label}
                {isCurrent ? ', current step' : ''}
                {isComplete ? ', completed' : ''}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

export default ProgressBar;
