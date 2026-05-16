-- Fix profiles: restrict full profile access to owner only
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;
CREATE POLICY "Users can view own full profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

-- Create public profile function for safe donor info (non-sensitive fields only)
CREATE OR REPLACE FUNCTION public.get_public_profile(_user_id uuid)
RETURNS TABLE(full_name text, avatar_url text, verified boolean, org_name text)
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.full_name, p.avatar_url, p.verified, p.org_name
  FROM public.profiles p
  WHERE p.id = _user_id;
$$;

-- Add explicit INSERT policy on user_roles for defense-in-depth
-- The existing ALL policy already requires admin, but this makes the intent explicit
CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy on bookings so booking parties can cancel/remove their own bookings
CREATE POLICY "Booking parties can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (
  (auth.uid() = recipient_id) OR (auth.uid() = volunteer_id) OR public.is_food_donor(food_item_id, auth.uid())
);

-- Add DELETE policy on avatars storage so users can remove their own avatars
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
);