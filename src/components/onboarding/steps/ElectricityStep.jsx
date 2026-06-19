import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const MIN_ELECTRICITY_KWH = 0;
const MAX_ELECTRICITY_KWH = 1000;

export const electricityStepSchema = z.object({
  monthlyElectricityKwh: z.coerce
    .number({
      required_error: 'Please add your monthly electricity usage.',
      invalid_type_error: 'Please enter electricity usage as a number.',
    })
    .min(MIN_ELECTRICITY_KWH, 'Electricity usage cannot be negative.')
    .max(MAX_ELECTRICITY_KWH, 'Please enter a value under 1000 kWh.'),
});

const getUsageLevel = (value) => {
  if (value < 150) return 'Low';
  if (value <= 400) return 'Medium';
  return 'High';
};

const UsageIndicator = ({ active, label, range }) => (
  <div
    className={[
      'rounded-xl border p-3 transition-all duration-200',
      active
        ? 'border-accent-green bg-accent-green/10 text-text-primary'
        : 'border-green-500/10 bg-bg-primary/60 text-text-muted',
    ].join(' ')}
  >
    <p className="text-sm font-black">{label}</p>
    <p className="mt-1 text-xs font-semibold">{range}</p>
  </div>
);

export const ElectricityStep = ({
  defaultValues = {},
  onChange,
  onSubmit,
  submitLabel = 'Save electricity details',
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(electricityStepSchema),
    defaultValues: {
      monthlyElectricityKwh: defaultValues.monthlyElectricityKwh ?? 100,
    },
    mode: 'onChange',
  });

  const monthlyElectricityKwh = Number(watch('monthlyElectricityKwh') || 0);
  const usageLevel = getUsageLevel(monthlyElectricityKwh);

  const handleValidSubmit = (values) => {
    onSubmit?.(values);
  };

  const handleFieldChange = (event) => {
    onChange?.('monthlyElectricityKwh', event.target.value);
  };

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={handleSubmit(handleValidSubmit)}
      noValidate
    >
      <div>
        <h2 className="text-2xl font-black text-text-primary">Home electricity</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-text-muted">
          Use your monthly bill if you have it nearby. An estimate is fine too.
        </p>
      </div>

      <div className="rounded-xl border border-green-500/10 bg-bg-primary/60 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <label
              htmlFor="monthlyElectricityKwh"
              className="text-sm font-medium text-text-secondary"
            >
              Monthly electricity usage
            </label>
            <p className="mt-1 text-xs font-semibold leading-5 text-text-muted">
              Measured in kilowatt-hours, usually shown as kWh on your bill.
            </p>
          </div>
          <output
            htmlFor="monthlyElectricityKwh"
            className="font-mono text-2xl font-black text-accent-green"
          >
            {monthlyElectricityKwh} kWh
          </output>
        </div>

        <input
          id="monthlyElectricityKwh"
          type="range"
          min={MIN_ELECTRICITY_KWH}
          max={MAX_ELECTRICITY_KWH}
          step="10"
          className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-bg-elevated accent-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/50"
          aria-invalid={Boolean(errors.monthlyElectricityKwh)}
          aria-describedby="electricity-helper electricity-error"
          {...register('monthlyElectricityKwh', {
            onChange: handleFieldChange,
          })}
        />

        <div className="mt-2 flex justify-between text-xs font-bold text-text-muted/70">
          <span>0</span>
          <span>500</span>
          <span>1000</span>
        </div>

        <p id="electricity-helper" className="mt-4 text-sm font-semibold text-text-muted">
          Current estimate: <span className="text-text-secondary">{usageLevel} usage</span>
        </p>

        {errors.monthlyElectricityKwh?.message && (
          <p
            id="electricity-error"
            className="mt-3 text-xs font-semibold text-red-400"
            role="alert"
          >
            {errors.monthlyElectricityKwh.message}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <UsageIndicator
          label="Low"
          range="0-149 kWh"
          active={usageLevel === 'Low'}
        />
        <UsageIndicator
          label="Medium"
          range="150-400 kWh"
          active={usageLevel === 'Medium'}
        />
        <UsageIndicator
          label="High"
          range="401+ kWh"
          active={usageLevel === 'High'}
        />
      </div>

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

export default ElectricityStep;
