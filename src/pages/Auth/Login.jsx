import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      if (user.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-green/5 blur-[100px] pointer-events-none" />

      <Card className="w-full max-w-md border border-green-500/15">
        <div className="text-center mb-8">
          <span className="text-4xl" role="img" aria-label="EcoWise logo">🌿</span>
          <h2 className="text-2xl font-black mt-3 text-text-primary">Welcome Back</h2>
          <p className="text-sm font-semibold text-text-muted mt-1">
            Access your EcoWise companion
          </p>
        </div>

        {errorMsg && (
          <div role="alert" aria-live="assertive" className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold mb-6">
            <ShieldAlert size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate aria-label="Login Form">
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
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          <Button type="submit" aria-busy={loading} aria-disabled={loading} variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs font-semibold text-text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-green hover:underline">
            Create Account
          </Link>
        </p>
      </Card>
    </main>
  );
};
export default Login;
