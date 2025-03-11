import { supabase } from '../supabase';
import { Profile, Notification } from '@/types/user';

export const userApi = {
  getProfile: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.user.id)
        .single();
      
      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          const newProfile = {
            id: user.user.id,
            email: user.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();
          
          if (createError) throw createError;
          return createdProfile as Profile;
        }
        throw error;
      }
      
      return data as Profile;
    } catch (error) {
      console.error('Error getting profile:', error);
      // Return a default profile to prevent UI errors
      return {
        id: 'unknown',
        email: 'demo@example.com',
        company_name: 'Demo Company',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Profile;
    }
  },

  updateProfile: async (profile: Partial<Profile>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  getNotifications: async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Notification[];
    } catch (error) {
      console.error('Error getting notifications:', error);
      // Return empty array to prevent UI errors
      return [] as Notification[];
    }
  },

  markNotificationRead: async (notificationId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};