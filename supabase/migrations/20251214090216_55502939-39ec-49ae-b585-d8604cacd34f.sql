-- Create admin users table with hardcoded credentials
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the admin user
INSERT INTO public.admins (username, password_hash) 
VALUES ('removed-admin', 'removed-password');

-- Create media types enum
CREATE TYPE public.media_type AS ENUM ('audio', 'video', 'document', 'note');

-- Create media table
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type media_type NOT NULL,
  file_url TEXT,
  thumbnail_url TEXT,
  content TEXT, -- For notes (WYSIWYG content)
  file_size BIGINT,
  duration INTEGER, -- For audio/video in seconds
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Admin table policies (read-only for verification)
CREATE POLICY "Admins are readable for login verification"
ON public.admins FOR SELECT
USING (true);

-- Media policies (public read, admin write via edge function)
CREATE POLICY "Media is publicly readable"
ON public.media FOR SELECT
USING (is_published = true);

CREATE POLICY "All media readable for admin operations"
ON public.media FOR SELECT
USING (true);

CREATE POLICY "Media can be inserted"
ON public.media FOR INSERT
WITH CHECK (true);

CREATE POLICY "Media can be updated"
ON public.media FOR UPDATE
USING (true);

CREATE POLICY "Media can be deleted"
ON public.media FOR DELETE
USING (true);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true);

-- Storage policies
CREATE POLICY "Media files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Anyone can upload media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media');

CREATE POLICY "Anyone can update media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media');

CREATE POLICY "Anyone can delete media"
ON storage.objects FOR DELETE
USING (bucket_id = 'media');

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_updated_at
BEFORE UPDATE ON public.media
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();