-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" 
ON public.favorites FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create contact_messages table for Help & Support
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view own messages" 
ON public.contact_messages FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all messages" 
ON public.contact_messages FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Create user_locations table for persistent location storage
CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  location_name TEXT NOT NULL,
  address TEXT,
  lat NUMERIC,
  lng NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own location" 
ON public.user_locations FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add trigger for updated_at on user_locations
CREATE TRIGGER update_user_locations_updated_at
BEFORE UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();