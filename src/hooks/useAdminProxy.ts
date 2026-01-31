import { useAuth } from '@/contexts/AuthContext';

const DEV_ADMIN_PHONE = '9989835113';

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
  const { isDevAdmin, isAdmin, user } = useAuth();

  const adminRequest = async <T>(request: AdminProxyRequest): Promise<AdminProxyResponse<T>> => {
    // If dev admin, use the proxy edge function
    if (isDevAdmin) {
      return executeProxyRequest<T>(request);
    }

    // Otherwise return error - regular admin should use supabase directly
    return { data: null, error: new Error('Dev admin proxy only') };
  };

  const executeProxyRequest = async <T>(request: AdminProxyRequest): Promise<AdminProxyResponse<T>> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-proxy`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-dev-admin-key': DEV_ADMIN_PHONE,
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

  return { adminRequest, isDevAdmin, isAdmin };
};
