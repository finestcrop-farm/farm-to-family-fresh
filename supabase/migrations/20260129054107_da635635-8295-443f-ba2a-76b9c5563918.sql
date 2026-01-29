-- Create products table for admin management
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  name text NOT NULL,
  name_hindi text,
  name_telugu text,
  price numeric NOT NULL,
  original_price numeric,
  unit text NOT NULL,
  image_url text,
  category text NOT NULL,
  subcategory text NOT NULL,
  description text,
  farm_source text,
  freshness_badge text,
  fssai_license text,
  expiry_days integer,
  storage_tips text,
  in_stock boolean DEFAULT true,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  dietary_tags text[],
  is_subscribable boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can view products
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
USING (true);

-- Only admins can manage products
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create admin_documents table for storing uploaded documents
CREATE TABLE public.admin_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  file_url text NOT NULL,
  file_type text,
  file_size integer,
  category text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_documents ENABLE ROW LEVEL SECURITY;

-- Only admins can manage documents
CREATE POLICY "Admins can manage documents"
ON public.admin_documents
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage bucket for admin documents  
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-documents', 'admin-documents', false);

-- Storage policies for product images (public read, admin write)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND has_role(auth.uid(), 'admin'));

-- Storage policies for admin documents (admin only)
CREATE POLICY "Admins can view documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'admin-documents' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'admin-documents' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update documents"
ON storage.objects FOR UPDATE
USING (bucket_id = 'admin-documents' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'admin-documents' AND has_role(auth.uid(), 'admin'));