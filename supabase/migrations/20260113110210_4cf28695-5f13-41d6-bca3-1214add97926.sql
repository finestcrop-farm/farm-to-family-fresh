-- Create table to track promotional notification history
CREATE TABLE public.promotional_notification_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  push_sent BOOLEAN NOT NULL DEFAULT false,
  push_success_count INTEGER DEFAULT 0,
  push_failure_count INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.promotional_notification_history ENABLE ROW LEVEL SECURITY;

-- Only admins can view and manage notification history
CREATE POLICY "Admins can view notification history"
ON public.promotional_notification_history
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert notification history"
ON public.promotional_notification_history
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notification history"
ON public.promotional_notification_history
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_promo_history_sent_at ON public.promotional_notification_history(sent_at DESC);