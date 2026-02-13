import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// ORDER FUNCTIONS
// ============================================================

/**
 * Generate Order ID in format: DDMMYY[Qty2digits][N/R]
 * Example: 13022605N
 */
export const generateOrderId = (quantity: number, customerType: string): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const qty = String(quantity).padStart(2, '0');
  const type = customerType === 'Repeat' ? 'R' : 'N';
  return `${dd}${mm}${yy}${qty}${type}`;
};

/**
 * Submit a new order to Supabase
 */
export const submitOrder = async (orderData: {
  name: string;
  phone: string;
  email: string;
  address: string;
  quantity: number;
  price: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  customerType: string;
  specialInstructions?: string;
}) => {
  const orderId = generateOrderId(orderData.quantity, orderData.customerType);

  const { data, error } = await supabase
    .from('orders')
    .insert([{
      order_id: orderId,
      full_name: orderData.name,
      phone: orderData.phone,
      email: orderData.email || null,
      address: orderData.address,
      quantity: orderData.quantity,
      price: orderData.price,
      delivery_charge: orderData.deliveryFee,
      total: orderData.total,
      payment_method: orderData.paymentMethod,
      payment_status: 'unpaid',
      customer_type: orderData.customerType === 'Repeat' ? 'R' : 'N',
      status: 'pending',
      special_instructions: orderData.specialInstructions || null,
    }])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(error.message || 'Failed to save order');
  }

  return { orderId, data };
};

// ============================================================
// ADMIN FUNCTIONS
// ============================================================

/**
 * Admin sign in with email and password
 */
export const adminLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

/**
 * Admin sign out
 */
export const adminLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get current auth session
 */
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Fetch all orders, newest first
 */
export const fetchOrders = async (filters?: {
  status?: string;
  search?: string;
}) => {
  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      const s = filters.search;
      query = query.or(`order_id.ilike.%${s}%,full_name.ilike.%${s}%,phone.ilike.%${s}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('fetchOrders error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('fetchOrders exception:', err);
    return [];
  }
};

/**
 * Fetch a single order by its uuid
 */
export const fetchOrderById = async (id: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

/**
 * Update order status
 */
export const updateOrderStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (id: string, paymentStatus: string) => {
  const { error } = await supabase
    .from('orders')
    .update({ payment_status: paymentStatus })
    .eq('id', id);
  if (error) throw error;
};

/**
 * Delete order
 */
export const deleteOrder = async (id: string) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

/**
 * Check store settings (status, discounts, delivery)
 */
export const checkStoreSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('orders_enabled, repeat_discount, free_delivery')
      .limit(1);

    if (error) {
      console.warn('Could not fetch store settings:', error);
      return { 
        orders_enabled: true, 
        repeat_discount: 0, 
        free_delivery: false 
      };
    }
    
    if (!data || data.length === 0) {
      console.warn('Settings table empty, defaulting to enabled');
      return { 
        orders_enabled: true, 
        repeat_discount: 0, 
        free_delivery: false 
      };
    }
    
    return {
      orders_enabled: data[0].orders_enabled ?? true,
      repeat_discount: data[0].repeat_discount || 0,
      free_delivery: data[0].free_delivery || false
    };
  } catch (err) {
    console.warn('checkStoreSettings exception:', err);
    return { 
      orders_enabled: true, 
      repeat_discount: 0, 
      free_delivery: false 
    };
  }
};

/**
 * Check if a phone number belongs to a previous customer
 */
export const checkCustomerPhone = async (phone: string): Promise<boolean> => {
  try {
    // Normalize phone: remove non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return false;

    const { count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('phone', cleanPhone);

    if (error) {
      console.warn('Error checking customer phone:', error);
      return false;
    }
    
    return (count || 0) > 0;
  } catch (err) {
    console.warn('checkCustomerPhone exception:', err);
    return false;
  }
};

/**
 * Update store settings
 */
export const updateStoreSettings = async (settings: { 
  orders_enabled?: boolean;
  repeat_discount?: number;
  free_delivery?: boolean;
}) => {
  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    const { error } = await supabase
      .from('settings')
      .update({ 
        ...settings, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', existing[0].id);
    if (error) throw error;
  }
};

/**
 * Toggle store status (wrapper for backward compatibility or simple toggles in existing code)
 */
export const toggleStoreStatus = async (enabled: boolean) => {
  await updateStoreSettings({ orders_enabled: enabled });
};

/**
 * Fetch today's stats for admin dashboard
 */
export const fetchTodayStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('fetchTodayStats error:', error);
      return { totalOrders: 0, totalRevenue: 0, bkashOrders: 0, codOrders: 0, pendingOrders: 0, unpaidBkash: 0 };
    }

    const orders = data || [];
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
    const bkashOrders = orders.filter((o: any) => o.payment_method === 'bkash').length;
    const codOrders = orders.filter((o: any) => o.payment_method === 'cod').length;
    const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
    const unpaidBkash = orders.filter((o: any) => o.payment_method === 'bkash' && o.payment_status === 'unpaid').length;

    return { totalOrders, totalRevenue, bkashOrders, codOrders, pendingOrders, unpaidBkash };
  } catch (err) {
    console.error('fetchTodayStats exception:', err);
    return { totalOrders: 0, totalRevenue: 0, bkashOrders: 0, codOrders: 0, pendingOrders: 0, unpaidBkash: 0 };
  }
};
