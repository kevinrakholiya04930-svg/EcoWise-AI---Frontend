import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../../ui/Input';

export const personalStepSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(80, 'Please keep your name under 80 characters.'),
  city: z
    .string()
    .trim()
    .min(2, 'Please enter your city.')
    .max(80, 'Please keep your city under 80 characters.'),
});

const FieldGroup = ({ children }) => (
  <div className="grid gap-4 sm:grid-cols-2">{children}</div>
);

export const PersonalStep = ({
  defaultValues = {},
  onChange,
  onSubmit,
  submitLabel = 'Save personal details',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(personalStepSchema),
    defaultValues: {
      fullName: defaultValues.fullName || '',
      city: defaultValues.city || '',
    },
    mode: 'onChange',
  });

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
        <h2 className="text-2xl font-black text-text-primary">Tell us about you</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-text-muted">
          We use this to personalize your EcoWise profile.
        </p>
      </div>

      <FieldGroup>
        <Input
          label="Full Name"
          autoComplete="name"
          placeholder="e.g. Another One"
          aria-invalid={Boolean(errors.fullName)}
          {...register('fullName', {
            onChange: (event) => handleFieldChange('fullName', event),
          })}
          error={errors.fullName?.message}
        />

        <Input
          label="City"
          autoComplete="address-level2"
          placeholder="e.g. Mumbai"
          aria-invalid={Boolean(errors.city)}
          {...register('city', {
            onChange: (event) => handleFieldChange('city', event),
          })}
          error={errors.city?.message}
        />
      </FieldGroup>

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

export default PersonalStep;
