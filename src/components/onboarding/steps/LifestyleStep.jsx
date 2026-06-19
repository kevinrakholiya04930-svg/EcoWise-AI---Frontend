import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../ui/Input';

const dietTypes = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'meat-heavy', label: 'Meat heavy' },
];

export const lifestyleStepSchema = z.object({
  dietType: z.enum(['vegan', 'vegetarian', 'balanced', 'meat-heavy'], {
    required_error: 'Please choose the diet type closest to your routine.',
    invalid_type_error: 'Please choose a valid diet type.',
  }),
  screenTimeHours: z.coerce
    .number({
      required_error: 'Please add your daily screen time.',
      invalid_type_error: 'Please enter screen time as a number.',
    })
    .min(0, 'Screen time cannot be negative.')
    .max(24, 'Daily screen time must be 24 hours or less.'),
});

const DietTypeCard = ({ diet, selected, register }) => (
  <label
    className={[
      'flex min-h-24 cursor-pointer flex-col justify-between rounded-xl border p-4 transition-all duration-200',
      'focus-within:ring-2 focus-within:ring-accent-green/50',
      selected
        ? 'border-accent-green bg-accent-green/10 text-text-primary shadow-lg shadow-green-500/10'
        : 'border-green-500/10 bg-bg-primary/70 text-text-muted hover:border-green-500/30 hover:bg-bg-elevated/70',
    ].join(' ')}
  >
    <input
      type="radio"
      value={diet.id}
      className="sr-only"
      {...register('dietType')}
    />
    <span className="text-base font-black">{diet.label}</span>
    <span className="mt-3 h-2 w-2 rounded-full bg-current opacity-70" aria-hidden="true" />
  </label>
);

export const LifestyleStep = ({
  defaultValues = {},
  onChange,
  onSubmit,
  submitLabel = 'Save lifestyle details',
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(lifestyleStepSchema),
    defaultValues: {
      dietType: defaultValues.dietType || '',
      screenTimeHours: defaultValues.screenTimeHours ?? '',
    },
    mode: 'onChange',
  });

  const selectedDietType = watch('dietType');

  const handleValidSubmit = (values) => {
    onSubmit?.(values);
  };

  const handleFieldChange = (fieldName, event) => {
    onChange?.(fieldName, event.target.value);
  };

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={handleSubmit(handleValidSubmit)}
      noValidate
    >
      <div>
        <h2 className="text-2xl font-black text-text-primary">Daily lifestyle</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-text-muted">
          A few everyday habits help EcoWise estimate your footprint more fairly.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-text-secondary">
          Diet type
        </legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dietTypes.map((diet) => (
            <DietTypeCard
              key={diet.id}
              diet={diet}
              selected={selectedDietType === diet.id}
              register={register}
            />
          ))}
        </div>
        {errors.dietType?.message && (
          <p className="text-xs font-semibold text-red-400" role="alert">
            {errors.dietType.message}
          </p>
        )}
      </fieldset>

      <Input
        label="Daily screen time in hours"
        type="number"
        min="0"
        max="24"
        step="0.5"
        inputMode="decimal"
        placeholder="e.g. 5"
        aria-invalid={Boolean(errors.screenTimeHours)}
        {...register('screenTimeHours', {
          onChange: (event) => handleFieldChange('screenTimeHours', event),
        })}
        error={errors.screenTimeHours?.message}
      />

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

export default LifestyleStep;
