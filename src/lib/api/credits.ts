import { supabase } from '../supabase';
import { CreditPurchaseRequest, Credit, Project } from '@/types/credit';

export const creditApi = {
  getProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    return data as Project[];
  },

  getCredits: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('credits')
      .select('*')
      .eq('user_id', user.user.id);
    
    if (error) throw error;
    return data as Credit[];
  },

  getCreditSummary: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('credits')
      .select('quantity, transaction_type, status')
      .eq('user_id', user.user.id);
    
    if (error) throw error;

    const summary = {
      available: 0,
      used: 0,
      pending: 0
    };

    data.forEach(credit => {
      if (credit.status === 'completed') {
        if (credit.transaction_type === 'purchase') {
          summary.available += credit.quantity;
        } else if (credit.transaction_type === 'use') {
          summary.used += credit.quantity;
        }
      } else if (credit.status === 'pending') {
        summary.pending += credit.quantity;
      }
    });

    return summary;
  },

  purchaseCredits: async (request: CreditPurchaseRequest) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Not authenticated');

    const totalAmount = request.quantity * request.price_per_credit;
    
    const { data, error } = await supabase
      .from('credits')
      .insert({
        user_id: user.user.id,
        project_id: request.project_id,
        quantity: request.quantity,
        price_per_credit: request.price_per_credit,
        total_amount: totalAmount,
        transaction_type: 'purchase',
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Create notification for purchase
    await supabase.from('notifications').insert({
      user_id: user.user.id,
      title: 'Credit Purchase Initiated',
      message: `Purchase of ${request.quantity} credits is being processed`,
      type: 'purchase',
      created_at: new Date().toISOString()
    });
    
    return data as Credit;
  }
};