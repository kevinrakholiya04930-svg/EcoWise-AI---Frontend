import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword, updateProfile } from '../../api/auth.api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import AppLayout from '../../components/layout/AppLayout';
import { useForm } from 'react-hook-form';
import { ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export const Profile = () => {
  const { user, refreshUser } = useAuth();
  
  // Password Form
  const { register: passRegister, handleSubmit: passSubmit, reset: passReset, formState: { errors: passErrors } } = useForm();
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  // Profile Baseline Form
  const { register: profRegister, handleSubmit: profSubmit, formState: { errors: profErrors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      city: user?.profile?.city || '',
      transportMode: user?.profile?.transportMode || 'walking',
      dailyTravelKm: user?.profile?.dailyTravelKm || 0,
      monthlyElectricityKwh: user?.profile?.monthlyElectricityKwh || 0,
      dietType: user?.profile?.dietType || 'vegetarian',
      dailyDigitalHours: user?.profile?.dailyDigitalHours || 0,
    }
  });
  const [profSuccess, setProfSuccess] = useState('');
  const [profError, setProfError] = useState('');
  const [profLoading, setProfLoading] = useState(false);

  if (!user) return null;

  const handlePasswordSubmit = async (data) => {
    setPassSuccess('');
    setPassError('');
    setPassLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setPassSuccess('Password updated successfully.');
      passReset();
    } catch (err) {
      setPassError(err.response?.data?.message || 'Password update failed.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleProfileSubmit = async (data) => {
    setProfSuccess('');
    setProfError('');
    setProfLoading(true);
    try {
      // Cast numerical inputs
      const profileData = {
        name: data.name,
        city: data.city,
        transportMode: data.transportMode,
        dailyTravelKm: Number(data.dailyTravelKm),
        monthlyElectricityKwh: Number(data.monthlyElectricityKwh),
        dietType: data.dietType,
        dailyDigitalHours: Number(data.dailyDigitalHours),
      };
      await updateProfile(profileData);
      await refreshUser();
      setProfSuccess('Profile variables recalibrated successfully!');
    } catch (err) {
      setProfError(err.response?.data?.message || 'Profile recalibration failed.');
    } finally {
      setProfLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Profile Settings Form */}
        <Card className="border border-green-500/5">
          <h2 className="text-xl font-bold text-text-primary mb-1">Recalibrate Profile</h2>
          <p className="text-xs text-text-muted mb-6 font-semibold">Update your daily defaults and re-evaluate baseline footprint</p>
          
          {profSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-accent-green px-4 py-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
              <UserCheck size={16} />
              <span>{profSuccess}</span>
            </div>
          )}
          {profError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{profError}</span>
            </div>
          )}

          <form onSubmit={profSubmit(handleProfileSubmit)} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              error={profErrors.name?.message}
              {...profRegister('name', { required: 'Name is required' })}
            />
            <Input
              label="City"
              error={profErrors.city?.message}
              {...profRegister('city', { required: 'City is required' })}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-text-secondary">Primary Transit Mode</label>
              <select
                className="bg-bg-primary border border-green-500/10 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-green"
                {...profRegister('transportMode')}
              >
                <option value="car">Car 🚗</option>
                <option value="bike">Bike 🚴</option>
                <option value="public">Transit 🚌</option>
                <option value="walking">Walk 🚶</option>
                <option value="wfh">WFH 🏠</option>
              </select>
            </div>

            <Input
              label="Daily Travel Distance (km)"
              type="number"
              error={profErrors.dailyTravelKm?.message}
              {...profRegister('dailyTravelKm', { required: 'Value required' })}
            />

            <Input
              label="Monthly Grid Energy (kWh)"
              type="number"
              error={profErrors.monthlyElectricityKwh?.message}
              {...profRegister('monthlyElectricityKwh', { required: 'Value required' })}
            />

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-text-secondary">Dietary Habits</label>
              <select
                className="bg-bg-primary border border-green-500/10 rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent-green"
                {...profRegister('dietType')}
              >
                <option value="vegan">Vegan 🌿</option>
                <option value="vegetarian">Vegetarian 🥗</option>
                <option value="omnivore">Omnivore 🍳</option>
                <option value="meat-heavy">Carnivore 🥩</option>
              </select>
            </div>

            <Input
              label="Daily Screen Time (hours)"
              type="number"
              error={profErrors.dailyDigitalHours?.message}
              {...profRegister('dailyDigitalHours', { required: 'Value required' })}
            />

            <Button type="submit" variant="primary" className="mt-4 font-black" disabled={profLoading}>
              {profLoading ? 'Recalibrating...' : 'Recalibrate Profile Defaults'}
            </Button>
          </form>
        </Card>

        {/* Password settings Form */}
        <Card className="border border-green-500/5 flex flex-col justify-between h-fit">
          <div>
            <h2 className="text-xl font-bold text-text-primary mb-1">Change Password</h2>
            <p className="text-xs text-text-muted mb-6 font-semibold">Change your secret authentication key</p>

            {passSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-accent-green px-4 py-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>{passSuccess}</span>
              </div>
            )}
            {passError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-xs font-bold mb-6 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={passSubmit(handlePasswordSubmit)} className="flex flex-col gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                error={passErrors.currentPassword?.message}
                {...passRegister('currentPassword', { required: 'Current password is required' })}
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 6 characters"
                error={passErrors.newPassword?.message}
                {...passRegister('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
              />

              <Button type="submit" variant="primary" className="mt-4 font-black" disabled={passLoading}>
                {passLoading ? 'Updating Key...' : 'Update Password'}
              </Button>
            </form>
          </div>
        </Card>

      </div>
    </AppLayout>
  );
};
export default Profile;
