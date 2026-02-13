import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, MapPin, Package, CreditCard,
  Trash2, CheckCircle, Truck, XCircle, Clock
} from 'lucide-react';
import {
  getSession, fetchOrderById, updateOrderStatus,
  updatePaymentStatus, deleteOrder
} from '../utils/supabase';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending:   'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped:   'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize border ${colors[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  const icons: Record<string, JSX.Element> = {
    pending: <Clock className="w-5 h-5 text-amber-500" />,
    confirmed: <CheckCircle className="w-5 h-5 text-blue-500" />,
    shipped: <Truck className="w-5 h-5 text-purple-500" />,
    delivered: <Package className="w-5 h-5 text-green-500" />,
    cancelled: <XCircle className="w-5 h-5 text-red-500" />,
  };
  return icons[status] || <Clock className="w-5 h-5 text-gray-400" />;
};

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      const session = await getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      if (!id) return;
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      setOrder((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentToggle = async () => {
    if (!id || !order) return;
    setUpdating(true);
    const newStatus = order.payment_status === 'paid' ? 'unpaid' : 'paid';
    try {
      await updatePaymentStatus(id, newStatus);
      setOrder((prev: any) => ({ ...prev, payment_status: newStatus }));
    } catch (err) {
      console.error('Failed to update payment:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteOrder(id);
      navigate('/admin');
    } catch (err) {
      console.error('Failed to delete:', err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Order not found</p>
          <Link to="/admin" className="text-[#9B7BB5] hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <span className="font-mono text-sm text-[#9B7BB5] font-medium">#{order.order_id}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <StatusIcon status={order.status} />
                  <div>
                    <h2 className="font-display text-xl text-gray-900">Order #{order.order_id}</h2>
                    <p className="text-xs text-gray-400">
                      {orderDate.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })} at {orderDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Status Update */}
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    disabled={updating || order.status === s}
                    className={`px-4 py-2 text-xs rounded-lg capitalize font-medium transition-all border ${
                      order.status === s
                        ? 'bg-[#9B7BB5] text-white border-[#9B7BB5]'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#9B7BB5] hover:text-[#9B7BB5]'
                    } disabled:opacity-50`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Customer</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9B7BB5]/10 flex items-center justify-center text-[#9B7BB5] font-bold text-sm">
                    {order.full_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.full_name}</p>
                    <span className="text-xs text-gray-400">Customer Type: {order.customer_type === 'R' ? 'Repeat' : 'New'}</span>
                  </div>
                </div>

                <a href={`tel:${order.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9B7BB5] transition-colors group">
                  <Phone className="w-4 h-4 text-gray-400 group-hover:text-[#9B7BB5]" />
                  <span>{order.phone}</span>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Call</span>
                </a>

                {order.email && (
                  <a href={`mailto:${order.email}`} className="flex items-center gap-3 text-gray-700 hover:text-[#9B7BB5] transition-colors">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{order.email}</span>
                  </a>
                )}

                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span>{order.address}</span>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {order.special_instructions && (
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
                <h3 className="text-sm font-medium text-amber-700 mb-2">📝 Special Instructions</h3>
                <p className="text-amber-800 text-sm">{order.special_instructions}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Details Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Product</span>
                  <span className="font-medium text-gray-900">7-in-1 Capsule</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium text-gray-900">{order.quantity} pc</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price</span>
                  <span className="text-gray-700">৳{order.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-gray-700">৳{order.delivery_charge}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-100">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#9B7BB5]">৳{order.total}</span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Payment</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900 capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePaymentToggle}
                disabled={updating}
                className={`w-full mt-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                  order.payment_status === 'paid'
                    ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                } disabled:opacity-50`}
              >
                <CreditCard className="w-4 h-4 inline mr-2" />
                {order.payment_status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border border-red-100 p-6">
              <h3 className="text-sm font-medium text-red-400 uppercase tracking-wider mb-3">Danger Zone</h3>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Order
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-red-600">Are you sure? This cannot be undone.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Confirm'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
