import { supabase } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export const getOrCreateDefaultPortfolio = async (userId: string) => {
  try {
    // Get the user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, organization_id')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    if (!profile?.organization_id) {
      throw new Error('User has no organization');
    }
    
    // Get portfolios for the organization
    const { data: portfolios, error: portfoliosError } = await supabase
      .from('portfolios')
      .select('id, name, description')
      .eq('organization_id', profile.organization_id);
      
    if (portfoliosError) throw portfoliosError;
    
    // Return first portfolio if exists
    if (portfolios && portfolios.length > 0) {
      return portfolios[0];
    }
    
    // Create default portfolio if none exists
    const { data: newPortfolio, error: createError } = await supabase
      .from('portfolios')
      .insert({
        name: 'Default Portfolio',
        description: 'Default portfolio created automatically',
        organization_id: profile.organization_id
      })
      .select()
      .single();
      
    if (createError) throw createError;
    return newPortfolio;
  } catch (error) {
    console.error('Error in getOrCreateDefaultPortfolio:', error);
    throw error;
  }
};

export async function createNewPortfolio(name: string, description: string, userId: string) {
  try {
    // Use the shared supabase instance
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', userId)
      .single();

    if (!profile?.organization_id) {
      throw new Error('No organization found');
    }

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert({
        name,
        description,
        organization_id: profile.organization_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return portfolio;
  } catch (error) {
    console.error('Error creating new portfolio:', error);
    throw error;
  }
} 