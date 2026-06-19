import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../ui/Input';

const transportModes = [
  { id: 'car', label: 'Car' },
  { id: 'bike', label: 'Bike' },
  { id: 'bus', label: 'Bus' },
  { id: 'metro', label: 'Metro' },
  { id: 'walking', label: 'Walking' },
  { id: 'mixed', label: 'Mixed' },
];

export const transportStepSchema = z.object({
  transportMode: z.enum(['car', 'bike', 'bus', 'metro', 'walking', 'mixed'], {
    required_error: 'Please choose your main transport mode.',
    invalid_type_error: 'Please choose a valid transport mode.',
  }),
  dailyDistanceKm: z.coerce
    .number({
      required_error: 'Please enter your daily travel distance.',
      invalid_type_error: 'Please enter distance as a number.',
    })
    .min(0, 'Distance cannot be negative.')
    .max(500, 'Please enter a daily distance under 500 km.'),
});

const TransportModeCard = ({ mode, selected, register }) => (
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
      value={mode.id}
      className="sr-only"
      {...register('transportMode')}
    />
    <span className="text-base font-black">{mode.label}</span>
    <span className="mt-3 h-2 w-2 rounded-full bg-current opacity-70" aria-hidden="true" />
  </label>
);

export const TransportStep = ({
  defaultValues = {},
  onChange,
  onSubmit,
  submitLabel = 'Save transport details',
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(transportStepSchema),
    defaultValues: {
      transportMode: defaultValues.transportMode || '',
      dailyDistanceKm: defaultValues.dailyDistanceKm ?? '',
    },
    mode: 'onChange',
  });

  const selectedMode = watch('transportMode');

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
        <h2 className="text-2xl font-black text-text-primary">How do you get around?</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-text-muted">
          Choose your usual transport mode and average daily travel distance.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-text-secondary">
          Transport mode
        </legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {transportModes.map((mode) => (
            <TransportModeCard
              key={mode.id}
              mode={mode}
              selected={selectedMode === mode.id}
              register={register}
            />
          ))}
        </div>
        {errors.transportMode?.message && (
          <p className="text-xs font-semibold text-red-400" role="alert">
            {errors.transportMode.message}
          </p>
        )}
      </fieldset>

      <Input
        label="Daily distance in km"
        type="number"
        min="0"
        max="500"
        step="0.1"
        inputMode="decimal"
        placeholder="e.g. 12"
        aria-invalid={Boolean(errors.dailyDistanceKm)}
        {...register('dailyDistanceKm', {
          onChange: (event) => handleFieldChange('dailyDistanceKm', event),
        })}
        error={errors.dailyDistanceKm?.message}
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

export default TransportStep;
