import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// Documentation: https://supabase.com/docs/reference/javascript/installing

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          user_type: 'client' | 'partenaire' | 'actionnaire';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          user_type?: 'client' | 'partenaire' | 'actionnaire';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          user_type?: 'client' | 'partenaire' | 'actionnaire';
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          type: 'fashion' | 'atrium';
          stock: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description: string;
          price: number;
          image: string;
          category: string;
          type: 'fashion' | 'atrium';
          stock?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          price?: number;
          image?: string;
          category?: string;
          type?: 'fashion' | 'atrium';
          stock?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          stripe_payment_intent_id: string | null;
          shipping_address: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total_amount: number;
          stripe_payment_intent_id?: string | null;
          shipping_address?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total_amount?: number;
          stripe_payment_intent_id?: string | null;
          shipping_address?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: number;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: number;
          quantity: number;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: number;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: number;
          quantity?: number;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'basic' | 'premium' | 'vip';
          status: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_type: 'basic' | 'premium' | 'vip';
          status?: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string | null;
          current_period_start: string;
          current_period_end: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_type?: 'basic' | 'premium' | 'vip';
          status?: 'active' | 'cancelled' | 'expired';
          stripe_subscription_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
        };
      };
      shares: {
        Row: {
          id: string;
          user_id: string;
          quantity: number;
          purchase_price: number;
          purchase_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quantity: number;
          purchase_price: number;
          purchase_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quantity?: number;
          purchase_price?: number;
          purchase_date?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Helper functions for common operations

// User operations
export async function getUserByClerkId(clerkId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createUser(userData: Database['public']['Tables']['users']['Insert']) {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Product operations
export async function getProducts(type?: 'fashion' | 'atrium') {
  let query = supabase.from('products').select('*');
  
  if (type) {
    query = query.eq('type', type);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

// Cart operations
export async function getCartItems(userId: string) {
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
}

export async function addToCart(userId: string, productId: number, quantity: number) {
  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();
  
  if (existingItem) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({ user_id: userId, product_id: productId, quantity })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

// Order operations
export async function createOrder(orderData: Database['public']['Tables']['orders']['Insert']) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        *,
        product:products(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
