-- Create admin audit logs table
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  admin_identifier TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  request_id TEXT,
  duration_ms INTEGER
);

-- Enable RLS
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- No one can modify audit logs through client (insert only via edge function with service role)
-- This ensures audit log integrity

-- Create index for faster queries
CREATE INDEX idx_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON public.admin_audit_logs(table_name);
CREATE INDEX idx_audit_logs_action ON public.admin_audit_logs(action);