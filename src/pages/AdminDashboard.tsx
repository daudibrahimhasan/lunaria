import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LogOut, Search, Package, DollarSign, Clock, CreditCard,
  ToggleLeft, ToggleRight, Phone, Eye, RefreshCw, AlertTriangle,
  Settings
} from 'lucide-react';
import {
  getSession, adminLogout, fetchOrders, fetchTodayStats,
  checkStoreSettings, updateStoreSettings
} from '../utils/supabase';

// ============================================================
// STATUS BADGE COMPONENT
// ============================================================
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending:   'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped:   'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const isPaid = status === 'paid';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${isPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
      {status}
    </span>
  );
};

// ============================================================
// ADMIN DASHBOARD
// ============================================================
export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    orders_enabled: true,
    repeat_discount: 0,
    free_delivery: false
  });
  const [updatingSetting, setUpdatingSetting] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Auth check - runs once
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      setAuthed(true);
    };
    checkAuth();
  }, [navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersData, statsData, settingsData] = await Promise.all([
        fetchOrders({ search, status: statusFilter }),
        fetchTodayStats(),
        checkStoreSettings(),
      ]);
      setOrders(ordersData);
      setStats(statsData);
      setStoreSettings(settingsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  // Load data once authed, and reload when filters change
  useEffect(() => {
    if (!authed) return;
    const timer = setTimeout(() => {
      loadData();
    }, 300); // debounce search
    return () => clearTimeout(timer);
  }, [authed, search, statusFilter, loadData]);

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  // Generic setting update handler
  const handleSettingUpdate = async (key: string, value: any) => {
    setUpdatingSetting(key);
    // Optimistic UI update
    setStoreSettings(prev => ({ ...prev, [key]: value }));
    try {
      await updateStoreSettings({ [key]: value });
    } catch (err) {
      console.error(`Failed to update ${key}:`, err);
      // Revert/Reload on error
      loadData();
    } finally {
      setUpdatingSetting('');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                <circle cx="20" cy="20" r="18" stroke="#9B7BB5" strokeWidth="1.5" fill="none" />
                <ellipse cx="20" cy="20" rx="12" ry="8" fill="#D4C8E8" opacity="0.5" />
                <circle cx="20" cy="20" r="4" fill="#9B7BB5" />
                <path d="M20 8 L20 12 M20 28 L20 32 M8 20 L12 20 M28 20 L32 20" stroke="#9B7BB5" strokeWidth="1" />
              </svg>
              <span className="font-tan-grandeur text-xl text-[#9B7BB5]">LUNARIA</span>
            </div>
            <span className="text-xs bg-[#9B7BB5]/10 text-[#9B7BB5] px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadData} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Package className="w-3.5 h-3.5" /> Today's Orders</div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><DollarSign className="w-3.5 h-3.5" /> Revenue</div>
              <p className="text-2xl font-bold text-gray-900">৳{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><CreditCard className="w-3.5 h-3.5" /> bKash</div>
              <p className="text-2xl font-bold text-gray-900">{stats.bkashOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><DollarSign className="w-3.5 h-3.5" /> COD</div>
              <p className="text-2xl font-bold text-gray-900">{stats.codOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Clock className="w-3.5 h-3.5" /> Pending</div>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><AlertTriangle className="w-3.5 h-3.5" /> Unpaid bKash</div>
              <p className="text-2xl font-bold text-orange-600">{stats.unpaidBkash}</p>
            </div>
          </div>
        )}

        {/* ── Settings Panel ── */}
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mb-6">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" /> Store Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Store Status Toggle */}
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-700">Accepting Orders</span>
                {storeSettings.orders_enabled ? (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">OPEN</span>
                ) : (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold">CLOSED</span>
                )}
              </div>
              <button
                onClick={() => handleSettingUpdate('orders_enabled', !storeSettings.orders_enabled)}
                disabled={updatingSetting === 'orders_enabled'}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border transition-all text-xs font-semibold ${
                  storeSettings.orders_enabled 
                    ? 'border-green-200 text-green-700 hover:bg-green-50' 
                    : 'border-red-200 text-red-700 hover:bg-red-50'
                }`}
              >
                {storeSettings.orders_enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {storeSettings.orders_enabled ? 'Store Open' : 'Store Closed'}
              </button>
            </div>

            {/* Repeat Customer Discount */}
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-700">Discount (৳)</label>
                <span className="text-[10px] text-gray-400">Repeat Orders</span>
              </div>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                <input
                  type="number"
                  min="0"
                  className="w-full pl-6 pr-2 py-1.5 rounded-md border border-gray-200 focus:border-[#9B7BB5] focus:ring-1 focus:ring-[#9B7BB5]/20 outline-none transition-all text-gray-900 font-medium text-xs"
                  value={storeSettings.repeat_discount}
                  onChange={(e) => setStoreSettings(prev => ({ ...prev, repeat_discount: Number(e.target.value) }))}
                  onBlur={(e) => handleSettingUpdate('repeat_discount', Number(e.target.value))}
                />
              </div>
            </div>

            {/* Free Delivery Toggle */}
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-700">Free Delivery</span>
                {storeSettings.free_delivery ? (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
                ) : (
                  <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-bold">OFF</span>
                )}
              </div>
              <button
                onClick={() => handleSettingUpdate('free_delivery', !storeSettings.free_delivery)}
                disabled={updatingSetting === 'free_delivery'}
                className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border transition-all text-xs font-semibold ${
                  storeSettings.free_delivery
                    ? 'border-green-200 text-green-700 hover:bg-green-50' 
                    : 'border-gray-200 text-gray-600 hover:bg-white'
                }`}
              >
                {storeSettings.free_delivery ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {storeSettings.free_delivery ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, order ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#9B7BB5] focus:ring-2 focus:ring-[#9B7BB5]/20 outline-none transition-all text-sm shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#9B7BB5] outline-none text-sm bg-white shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 animate-pulse">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Order ID</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Qty</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Total</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Payment</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Paid</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-[#9B7BB5]">{order.order_id}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <div>{formatDate(order.created_at)}</div>
                        <div className="text-xs text-gray-400">{formatTime(order.created_at)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{order.full_name}</div>
                        <a href={`tel:${order.phone}`} className="text-xs text-gray-400 hover:text-[#9B7BB5] flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {order.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{order.quantity}pc</td>
                      <td className="px-4 py-3 font-medium text-gray-900">৳{order.total}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{order.payment_method}</td>
                      <td className="px-4 py-3"><PaymentBadge status={order.payment_status} /></td>
                      <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="p-2 hover:bg-[#9B7BB5]/10 rounded-lg text-[#9B7BB5] transition-colors inline-flex"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order count */}
        {!loading && orders.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">{orders.length} order(s) found</p>
        )}
      </main>
    </div>
  );
};
