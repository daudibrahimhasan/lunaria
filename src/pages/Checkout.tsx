import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ShieldCheck, RotateCcw, Truck, ChevronDown, ChevronUp, Minus, Plus, Tag, Phone, MapPin, User, Mail, Check, AlertCircle } from 'lucide-react';
import { submitOrder, checkStoreSettings, checkCustomerPhone } from '../utils/supabase';

// ============================================================
// TYPES & CONSTANTS
// ============================================================
interface PackOption {
  qty: number;
  price: number;
  perPack: number;
  label: string;
  badge?: string;
  badgeColor?: string;
  savings?: number;
}

const PACKS: PackOption[] = [
  { qty: 1, price: 300, perPack: 300, label: '1 Pack', badge: 'TRIAL', badgeColor: 'bg-gray-100 text-gray-600' },
  { qty: 3, price: 900, perPack: 300, label: '3 Packs', badge: 'MOST POPULAR', badgeColor: 'bg-purple-100 text-purple-700' },
  { qty: 5, price: 1500, perPack: 300, label: '5 Packs', badge: 'BEST VALUE', badgeColor: 'bg-amber-100 text-amber-700', savings: 0 },
];

const STANDARD_DELIVERY_FEE = 60;

// ============================================================
// PROGRESS BAR COMPONENT
// ============================================================
const ProgressBar = () => (
  <div className="flex items-center justify-center gap-0 mb-8 px-4">
    {/* Step 1 - Cart */}
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-[#9B7BB5] flex items-center justify-center text-white text-xs font-bold shadow-md">✓</div>
      <span className="ml-2 text-sm font-medium text-[#9B7BB5] hidden sm:inline">Cart</span>
    </div>
    <div className="w-12 sm:w-20 h-0.5 bg-[#9B7BB5] mx-2" />
    {/* Step 2 - Checkout (Active) */}
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-[#9B7BB5] flex items-center justify-center text-white text-xs font-bold shadow-md ring-4 ring-[#9B7BB5]/20">2</div>
      <span className="ml-2 text-sm font-bold text-[#9B7BB5] hidden sm:inline">Checkout</span>
    </div>
    <div className="w-12 sm:w-20 h-0.5 bg-gray-200 mx-2" />
    {/* Step 3 - Confirmation */}
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs font-bold">3</div>
      <span className="ml-2 text-sm font-medium text-gray-400 hidden sm:inline">Confirmation</span>
    </div>
  </div>
);

// ============================================================
// CHECKOUT COMPONENT
// ============================================================
export const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQty = location.state?.quantity || 1;
  const initialPack = PACKS.find(p => p.qty === initialQty) ? initialQty : 1;

  // -- State --
  const [selectedPack, setSelectedPack] = useState(initialPack);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cod',
  });
  
  // Settings & Logic
  const [storeSettings, setStoreSettings] = useState({
    orders_enabled: true,
    repeat_discount: 0,
    free_delivery: false,
  });
  const [isRepeatCustomer, setIsRepeatCustomer] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);
  
  const [promoCode, setPromoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);

  // -- Load Settings --
  useEffect(() => {
    const init = async () => {
      const s = await checkStoreSettings();
      setStoreSettings(s);
      setSettingsLoaded(true);
    };
    init();
  }, []);

  // -- Calculations --
  const currentPack = PACKS.find(p => p.qty === selectedPack) || PACKS[0];
  const deliveryFee = storeSettings.free_delivery ? 0 : STANDARD_DELIVERY_FEE;
  
  // Calculate potential discount
  const discountAmount = isRepeatCustomer ? Number(storeSettings.repeat_discount) : 0;
  
  const subtotal = currentPack.price;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  // -- Handlers --
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Check phone for repeat customer
  const handlePhoneBlur = async () => {
    try {
      // Sanitize phone input
      const cleanPhone = formData.phone.replace(/\D/g, '');
      // Only check if phone is valid length (10+ digits)
      if (cleanPhone.length >= 10) {
        setCheckingPhone(true);
        try {
          const isRepeat = await checkCustomerPhone(cleanPhone);
          setIsRepeatCustomer(isRepeat);
        } catch (error) {
          console.error("Phone check error:", error);
        } finally {
          setCheckingPhone(false);
        }
      }
    } catch (err) {
      console.error("Unexpected error in handlePhoneBlur:", err);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please enter your full name';
    if (!formData.phone.trim()) {
      errors.phone = 'Please enter your phone number';
    } else if (!/^01\d{9}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      errors.phone = 'Phone must be 11 digits starting with 01';
    }
    if (!formData.address.trim()) errors.address = 'Please enter your delivery address';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');

    try {
      const { orderId } = await submitOrder({
        name: formData.name.trim(),
        phone: formData.phone.replace(/[-\s]/g, ''),
        email: formData.email.trim(),
        address: formData.address.trim(),
        quantity: selectedPack,
        price: currentPack.price,
        deliveryFee: deliveryFee,
        total,
        paymentMethod: formData.paymentMethod,
        customerType: isRepeatCustomer ? 'Repeat' : 'New',
        specialInstructions: '',
      });
      navigate('/success', { state: { orderId, total, paymentMethod: formData.paymentMethod } });
    } catch (err: any) {
      console.error('Checkout Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ═══ STORE CLOSED ═══
  if (settingsLoaded && !storeSettings.orders_enabled) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] pt-32 pb-12 px-4 flex items-center justify-center font-sans">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md shadow-xl border border-[#D4C8E8]/30">
          <div className="text-5xl mb-6">🌙</div>
          <h1 className="font-display text-2xl text-gray-900 mb-3">Orders Temporarily Closed</h1>
          <p className="text-gray-500 mb-6">We're not accepting orders right now. Please check back soon!</p>
          <Link to="/" className="inline-block px-6 py-3 bg-[#9B7BB5] text-white rounded-xl font-medium hover:bg-[#8A6AA4] transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ═══ LOADING ═══
  if (!settingsLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] pt-32 pb-12 px-4 flex items-center justify-center font-sans">
        <div className="animate-pulse text-gray-400 flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-[#9B7BB5] border-t-transparent rounded-full animate-spin" />
          Loading checkout...
        </div>
      </div>
    );
  }

  // ═══ MAIN CHECKOUT ═══
  return (
    <div className="min-h-screen bg-[#FAF9F7] pt-24 sm:pt-28 pb-32 sm:pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl sm:text-4xl text-gray-900">Secure Checkout</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">Complete your order in under a minute</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* ═══════ LEFT: FORM (3 cols) ═══════ */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* ── Contact & Delivery ────────────────────── */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-display text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#9B7BB5] text-white font-sans flex items-center justify-center text-xs font-bold shadow-sm">1</span>
                Contact & Delivery
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Full Name */}
                <div>
                  <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#9B7BB5] transition-colors" />
                    <input
                      id="checkout-name"
                      type="text"
                      name="name"
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 ${
                        fieldErrors.name
                          ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#9B7BB5] focus:ring-4 focus:ring-[#9B7BB5]/10 hover:border-gray-300'
                      }`}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  {fieldErrors.name && <p id="name-error" className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {fieldErrors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#9B7BB5] transition-colors" />
                    <input
                      id="checkout-phone"
                      type="tel"
                      name="phone"
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 ${
                        fieldErrors.phone
                          ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#9B7BB5] focus:ring-4 focus:ring-[#9B7BB5]/10 hover:border-gray-300'
                      }`}
                      placeholder="01712345678"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handlePhoneBlur}
                    />
                    {/* Phone check feedback */}
                    {checkingPhone && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm">Checking...</span>
                    )}
                    {isRepeatCustomer && !checkingPhone && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#E2136E] bg-pink-50 px-2 py-1 rounded-md border border-pink-100">
                         Loyalty customer!
                      </span>
                    )}
                  </div>
                  {fieldErrors.phone && <p id="phone-error" className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {fieldErrors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-gray-400 text-xs font-normal ml-1">(optional)</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#9B7BB5] transition-colors" />
                    <input
                      id="checkout-email"
                      type="email"
                      name="email"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#9B7BB5] focus:ring-4 focus:ring-[#9B7BB5]/10 hover:border-gray-300 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400 group-focus-within:text-[#9B7BB5] transition-colors" />
                    <textarea
                      id="checkout-address"
                      name="address"
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.address}
                      aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                      rows={3}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 resize-none ${
                        fieldErrors.address
                          ? 'border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                          : 'border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#9B7BB5] focus:ring-4 focus:ring-[#9B7BB5]/10 hover:border-gray-300'
                      }`}
                      placeholder="House No, Road No, Area, City"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  {fieldErrors.address && <p id="address-error" className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {fieldErrors.address}</p>}
                </div>
              </form>
            </div>

            {/* ── Payment Method ────────────────────── */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-display text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#9B7BB5] text-white font-sans flex items-center justify-center text-xs font-bold shadow-sm">2</span>
                Payment Method
              </h2>
              <div className="space-y-3">
                {/* bKash */}
                <label
                  className={`block cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 relative group ${
                    formData.paymentMethod === 'bkash'
                      ? 'border-[#E2136E] bg-[#FFF0F5] shadow-lg shadow-pink-100'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                  }`}
                  role="radio"
                  aria-checked={formData.paymentMethod === 'bkash'}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { setFormData(prev => ({ ...prev, paymentMethod: 'bkash' })); }}}
                >
                  <input type="radio" name="paymentMethod" value="bkash" checked={formData.paymentMethod === 'bkash'} onChange={handleInputChange} className="sr-only" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white border border-gray-100 overflow-hidden">
                      <img src="/icons/bkash.jpg" alt="bKash" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-lg">bKash</span>
                        {formData.paymentMethod === 'bkash' && (
                          <div className="w-6 h-6 rounded-full bg-[#E2136E] flex items-center justify-center text-white shadow-sm">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Instant payment via bKash app</p>
                      {formData.paymentMethod === 'bkash' && (
                        <p className="text-xs font-semibold text-[#E2136E] mt-3 pt-3 border-t border-[#E2136E]/10">
                          ✓ Instructions sent after order
                        </p>
                      )}
                    </div>
                  </div>
                </label>

                {/* COD */}
                <label
                  className={`block cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-0.5 relative group ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#9B7BB5] bg-[#F5F1FA] shadow-lg shadow-purple-100'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                  }`}
                  role="radio"
                  aria-checked={formData.paymentMethod === 'cod'}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { setFormData(prev => ({ ...prev, paymentMethod: 'cod' })); }}}
                >
                  <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="sr-only" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white border border-gray-100 overflow-hidden">
                      <img src="/icons/cod.png" alt="Cash on Delivery" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 text-lg">Cash on Delivery</span>
                        {formData.paymentMethod === 'cod' && (
                          <div className="w-6 h-6 rounded-full bg-[#9B7BB5] flex items-center justify-center text-white shadow-sm">
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Pay when you receive your order</p>
                      {formData.paymentMethod === 'cod' && (
                        <p className="text-xs font-semibold text-[#9B7BB5] mt-3 pt-3 border-t border-[#9B7BB5]/10">
                          ✓ Pay ৳{total} cash on delivery
                        </p>
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ═══════ RIGHT: ORDER SUMMARY (2 cols) ═══════ */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-28 overflow-hidden">
              {/* Collapsible header (mobile) */}
              <button
                type="button"
                onClick={() => setSummaryExpanded(!summaryExpanded)}
                className="w-full flex items-center justify-between p-5 sm:p-6 lg:cursor-default bg-gray-50/50"
                aria-expanded={summaryExpanded}
              >
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                <span className="lg:hidden text-gray-400">
                  {summaryExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              <div className={`${summaryExpanded ? 'block' : 'hidden lg:block'}`}>
                {/* Pack Selection */}
                <div className="px-5 sm:px-6 pb-5 pt-5 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Select Pack</span>
                  </div>

                  {PACKS.map((pack) => (
                    <button
                      key={pack.qty}
                      type="button"
                      onClick={() => setSelectedPack(pack.qty)}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 relative group hover:-translate-y-0.5 ${
                        selectedPack === pack.qty
                          ? 'border-[#9B7BB5] bg-[#F5F1FA] shadow-md shadow-purple-50'
                          : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}
                      aria-pressed={selectedPack === pack.qty}
                    >
                      {/* Badge */}
                      {pack.badge && (
                        <span className={`absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm ${pack.badgeColor}`}>
                          {pack.badge}
                        </span>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Radio indicator */}
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedPack === pack.qty ? 'border-[#9B7BB5] bg-white' : 'border-gray-300'
                          }`}>
                            {selectedPack === pack.qty && (
                              <div className="w-2 h-2 rounded-full bg-[#9B7BB5]" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{pack.label}</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">৳{pack.perPack}/pack</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#9B7BB5] text-base">৳{pack.price}</p>
                          {pack.savings !== undefined && pack.savings > 0 && (
                            <p className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">Save ৳{pack.savings}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Quantity Adjuster */}
                <div className="px-5 sm:px-6 pb-5">
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <span className="text-sm text-gray-700 font-medium">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const prev = PACKS.findIndex(p => p.qty === selectedPack);
                          if (prev > 0) setSelectedPack(PACKS[prev - 1].qty);
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#9B7BB5] hover:text-[#9B7BB5] transition-all shadow-sm"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-900">{selectedPack}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = PACKS.findIndex(p => p.qty === selectedPack);
                          if (next < PACKS.length - 1) setSelectedPack(PACKS[next + 1].qty);
                        }}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#9B7BB5] hover:text-[#9B7BB5] transition-all shadow-sm"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="px-5 sm:px-6 pb-5 border-b border-gray-100">
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#9B7BB5] transition-colors" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#9B7BB5] focus:ring-4 focus:ring-[#9B7BB5]/10 hover:border-gray-300 transition-all duration-200 outline-none text-sm placeholder-gray-400 font-medium"
                        placeholder="Discount code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        aria-label="Discount code"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="px-5 sm:px-6 py-5 bg-gray-50/30">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({selectedPack} pack{selectedPack > 1 ? 's' : ''})</span>
                      <span className="font-medium text-gray-900">৳{currentPack.price}</span>
                    </div>

                    {isRepeatCustomer && discountAmount > 0 && (
                      <div className="flex justify-between text-sm font-medium text-[#E2136E] bg-pink-50 p-2 rounded-lg border border-pink-100">
                        <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Loyalty Discount</span>
                        <span>-৳{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Delivery Fee</span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs uppercase tracking-wide">FREE</span>
                      ) : (
                        <span className="font-medium text-gray-900">৳{deliveryFee}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-gray-200">
                      <span className="text-gray-900 font-bold text-lg">Total</span>
                      <div className="text-right">
                         <span className="text-2xl font-bold text-[#9B7BB5] leading-none block">৳{total}</span>
                         <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Includes VAT</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mx-5 sm:mx-6 mb-5 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-3" role="alert">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                {/* CTA Button */}
                <div className="px-5 sm:px-6 pb-6">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-[#4c1d95] to-[#3b0764] text-white py-3.5 px-6 rounded-xl font-bold font-sans text-lg hover:from-[#3b0764] hover:to-[#2e054e] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-between relative overflow-hidden group"
                    style={{ minHeight: '56px' }}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>Confirm Order</span>
                        <span className="text-white/80 text-base font-medium">৳{total}</span>
                      </>
                    )}
                  </button>
                  <div className="mt-4 space-y-2">
                    <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Guaranteed safe & secure checkout
                    </p>
                    <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Fast delivery within 24–48 hours
                    </p>
                    <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" /> Money-back guarantee
                    </p>
                  </div>
                </div>

                {/* NO Trust Indicators Footer as requested */}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ═══════ MOBILE STICKY CTA ═══════ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 sm:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-[#9B7BB5]">৳{total}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            Secure
          </div>
        </div>
        <button
          type="submit"
          form="checkout-form"
          disabled={loading}
          className="w-full bg-linear-to-r from-[#4c1d95] to-[#3b0764] text-white py-4 px-6 rounded-xl font-semibold font-sans text-base hover:from-[#3b0764] hover:to-[#2e054e] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-between"
          style={{ minHeight: '52px' }}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span>Confirm Order</span>
              <span className="text-white/80 text-sm font-medium">৳{total}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
