import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api';

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedEmail = form.email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: trimmedEmail,
          newPassword: form.newPassword,
        }),
      });

      setSuccess(data.message || 'Password updated successfully. Please sign in.');
      setForm({ email: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Unable to reset password right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-50 overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-md px-6 py-12 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="group relative mb-6">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 opacity-30 blur transition duration-300 group-hover:opacity-50"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-gray-200/50">
              <span className="text-4xl">RP</span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Password <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Reset</span>
          </h1>
          <p className="mt-3 text-base text-gray-500 font-medium text-center">
            Enter your email and set a new password.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-white">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-100">
              <span className="mt-0.5">!</span>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 border border-emerald-100">
              <span className="mt-0.5">OK</span>
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={form.newPassword}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-4 py-3.5 text-gray-900 transition-all focus:bg-white focus:ring-4 focus:ring-emerald-100/50 focus:border-emerald-500 outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
