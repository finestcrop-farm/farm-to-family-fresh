import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface AdminProxyRequest {
  action: 'select' | 'insert' | 'update' | 'delete' | 'upsert';
  table: string;
  data?: Record<string, unknown>;
  id?: string;
  filters?: Record<string, unknown>;
}

interface AdminProxyResponse<T> {
  data: T | null;
  error: Error | null;
}

export const useAdminProxy = () => {
  const { isAdmin } = useAuth();

  const adminRequest = async <T>(request: AdminProxyRequest): Promise<AdminProxyResponse<T>> => {
    if (!isAdmin) {
      return { data: null, error: new Error('Admin access required') };
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        return { data: null, error: new Error('No active session') };
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify(request),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }

      return { data: result.data as T, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  return { adminRequest, isAdmin };
};
