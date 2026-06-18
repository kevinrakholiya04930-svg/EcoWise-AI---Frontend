import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export const Register = () => {
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoading(true);
    try {
      await authRegister(data.name, data.email, data.password);
      navigate('/onboarding');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-green/5 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md border border-green-500/15">
        <div className="text-center mb-8">
          <span className="text-4xl">🌿</span>
          <h2 className="text-2xl font-black mt-3 text-text-primary">Get Started</h2>
          <p className="text-sm font-semibold text-text-muted mt-1">
            Create your account to unlock personalized insights
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold mb-6">
            <ShieldAlert size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Your Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register('password', { 
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', { 
              required: 'Confirm password is required',
              validate: (val) => val === passwordVal || 'Passwords do not match'
            })}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs font-semibold text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-green hover:underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
};
export default Register;
