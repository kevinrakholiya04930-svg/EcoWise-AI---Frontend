import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const goals = [
  {
    id: 'transportation',
    label: 'Reduce transportation emissions',
  },
  {
    id: 'electricity',
    label: 'Reduce electricity consumption',
  },
  {
    id: 'lifestyle',
    label: 'Live a greener lifestyle',
  },
  {
    id: 'sustainability',
    label: 'Learn about sustainability',
  },
];

export const goalStepSchema = z.object({
  goal: z.enum(['transportation', 'electricity', 'lifestyle', 'sustainability'], {
    required_error: 'Please choose the goal that matters most to you.',
    invalid_type_error: 'Please choose a valid onboarding goal.',
  }),
});

const GoalCard = ({ goal, selected, registration }) => (
  <label
    className={[
      'flex min-h-28 cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200',
      'focus-within:ring-2 focus-within:ring-accent-green/50',
      selected
        ? 'border-accent-green bg-accent-green/10 text-text-primary shadow-lg shadow-green-500/10'
        : 'border-green-500/10 bg-bg-primary/70 text-text-muted hover:border-green-500/30 hover:bg-bg-elevated/70',
    ].join(' ')}
  >
    <input
      type="radio"
      value={goal.id}
      className="sr-only"
      {...registration}
    />
    <span className="text-base font-black leading-6">{goal.label}</span>
    <span className="mt-4 h-2 w-2 rounded-full bg-current opacity-70" aria-hidden="true" />
  </label>
);

export const GoalStep = ({
  defaultValues = {},
  onChange,
  onSubmit,
  submitLabel = 'Save goal',
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(goalStepSchema),
    defaultValues: {
      goal: defaultValues.goal || '',
    },
    mode: 'onChange',
  });

  const selectedGoal = watch('goal');

  const handleValidSubmit = (values) => {
    onSubmit?.(values);
  };

  const goalRegister = register('goal', {
    onChange: (event) => onChange?.('goal', event.target.value),
  });

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={handleSubmit(handleValidSubmit)}
      noValidate
    >
      <div>
        <h2 className="text-2xl font-black text-text-primary">Choose your first goal</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-text-muted">
          Pick one focus area. You can change it later as your habits evolve.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-text-secondary">
          Primary goal
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              selected={selectedGoal === goal.id}
              registration={goalRegister}
            />
          ))}
        </div>
        {errors.goal?.message && (
          <p className="text-xs font-semibold text-red-400" role="alert">
            {errors.goal.message}
          </p>
        )}
      </fieldset>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent-green px-5 py-2.5 text-base font-bold text-bg-primary shadow-lg shadow-green-500/20 transition-all duration-200 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-accent-green/50 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default GoalStep;
