import React, { useState, useEffect } from 'react';
import { ClipboardList, RefreshCw, Database, Trash2, Edit, Plus, Eye, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminProxy } from '@/hooks/useAdminProxy';
import { cn } from '@/lib/utils';

interface AuditLog {
  id: string;
  created_at: string;
  action: string;
  table_name: string;
  record_id: string | null;
  admin_identifier: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  request_id: string | null;
  duration_ms: number | null;
}

const actionIcons: Record<string, React.ElementType> = {
  select: Eye,
  insert: Plus,
  update: Edit,
  delete: Trash2,
  upsert: Database,
};

const actionColors: Record<string, string> = {
  select: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  insert: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  update: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  upsert: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const AuditLogList: React.FC = () => {
  const { isDevAdmin } = useAuth();
  const { adminRequest } = useAdminProxy();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      if (isDevAdmin) {
        const { data, error } = await adminRequest<AuditLog[]>({
          action: 'select',
          table: 'admin_audit_logs',
          data: {
            order: { column: 'created_at', ascending: false },
            limit: 100,
          },
        });

        if (error) throw error;
        setLogs(data || []);
      } else {
        const { data, error } = await supabase
          .from('admin_audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        setLogs((data as AuditLog[]) || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [isDevAdmin]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.table_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.record_id && log.record_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = filterAction === 'all' || log.action === filterAction;

    return matchesSearch && matchesAction;
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Activity Audit Log</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchLogs}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {['all', 'select', 'insert', 'update', 'delete'].map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-colors capitalize',
                filterAction === action
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {['insert', 'update', 'delete', 'select'].map((action) => {
          const count = logs.filter((l) => l.action === action).length;
          const Icon = actionIcons[action] || Database;
          return (
            <div key={action} className="bg-card rounded-lg p-3 border border-border text-center">
              <Icon className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground capitalize">{action}s</p>
            </div>
          );
        })}
      </div>

      {/* Log List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No audit logs found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Actions will be logged here as they occur
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredLogs.map((log) => {
            const Icon = actionIcons[log.action] || Database;
            const colorClass = actionColors[log.action] || 'bg-muted text-muted-foreground';
            
            return (
              <div
                key={log.id}
                className="bg-card rounded-lg p-3 border border-border hover:border-primary/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', colorClass)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium uppercase', colorClass)}>
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-foreground">{log.table_name}</span>
                      {log.record_id && (
                        <span className="text-xs text-muted-foreground font-mono truncate max-w-[100px]">
                          #{log.record_id.slice(0, 8)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatTimestamp(log.created_at)}</span>
                      <span>•</span>
                      <span className="font-mono">{log.admin_identifier}</span>
                      {log.duration_ms && (
                        <>
                          <span>•</span>
                          <span>{log.duration_ms}ms</span>
                        </>
                      )}
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs text-primary cursor-pointer hover:underline">
                          View details
                        </summary>
                        <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto text-foreground">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AuditLogList;
