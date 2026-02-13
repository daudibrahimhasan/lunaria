import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../utils/supabase';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 border border-[#D4C8E8]/30">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#9B7BB5" strokeWidth="1.5" fill="none" />
              <ellipse cx="20" cy="20" rx="12" ry="8" fill="#D4C8E8" opacity="0.5" />
              <circle cx="20" cy="20" r="4" fill="#9B7BB5" />
              <path d="M20 8 L20 12 M20 28 L20 32 M8 20 L12 20 M28 20 L32 20" stroke="#9B7BB5" strokeWidth="1" />
            </svg>
            <span className="font-tan-grandeur text-2xl text-[#9B7BB5]">LUNARIA</span>
          </div>
          <h1 className="font-display text-2xl text-gray-900">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">Order Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9B7BB5] focus:ring-2 focus:ring-[#9B7BB5]/20 outline-none transition-all"
              placeholder="admin@lunaria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9B7BB5] focus:ring-2 focus:ring-[#9B7BB5]/20 outline-none transition-all pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9B7BB5] text-white py-3 rounded-lg font-medium hover:bg-[#8A6AA4] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
