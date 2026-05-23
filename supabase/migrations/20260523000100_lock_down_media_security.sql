-- Lock down previously open media/admin policies and move admin access to Supabase Auth.
-- Before applying this migration, create an admin user in Supabase Auth.
-- After applying it, add that user's UUID to public.admins:
-- INSERT INTO public.admins (user_id, email) VALUES ('<auth-user-uuid>', '<admin-email>');

CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admins DROP COLUMN IF EXISTS password_hash;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.admins ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Remove legacy password-only admin rows. Recreate admins by inserting Supabase Auth user IDs.
DELETE FROM public.admins WHERE user_id IS NULL OR email IS NULL;

ALTER TABLE public.admins ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.admins ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.admins DROP COLUMN IF EXISTS username;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_media_view(media_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.media
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = media_id
    AND is_published = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_media_download(media_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.media
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = media_id
    AND is_published = true;
END;
$$;

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins are readable for login verification" ON public.admins;
DROP POLICY IF EXISTS "Admins can read admin records" ON public.admins;
CREATE POLICY "Admins can read admin records"
ON public.admins FOR SELECT
TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Media is publicly readable" ON public.media;
DROP POLICY IF EXISTS "All media readable for admin operations" ON public.media;
DROP POLICY IF EXISTS "Media can be inserted" ON public.media;
DROP POLICY IF EXISTS "Media can be updated" ON public.media;
DROP POLICY IF EXISTS "Media can be deleted" ON public.media;
DROP POLICY IF EXISTS "Published media is publicly readable" ON public.media;
DROP POLICY IF EXISTS "Admins can insert media" ON public.media;
DROP POLICY IF EXISTS "Admins can update media" ON public.media;
DROP POLICY IF EXISTS "Admins can delete media" ON public.media;

CREATE POLICY "Published media is publicly readable"
ON public.media FOR SELECT
TO anon, authenticated
USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can insert media"
ON public.media FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update media"
ON public.media FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete media"
ON public.media FOR DELETE
TO authenticated
USING (public.is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Media files are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Media files are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media files" ON storage.objects;

CREATE POLICY "Media files are publicly readable"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

CREATE POLICY "Admins can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admins can update media files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin())
WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admins can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin());

GRANT EXECUTE ON FUNCTION public.increment_media_view(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_media_download(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
