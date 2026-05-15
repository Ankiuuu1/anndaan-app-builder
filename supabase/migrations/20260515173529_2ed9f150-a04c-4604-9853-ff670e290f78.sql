
-- Revoke EXECUTE from anon on internal helpers
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_food_donor(uuid, uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_on_booking_insert() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_on_booking_update() FROM anon, public, authenticated;
REVOKE EXECUTE ON FUNCTION public.nearby_food(double precision, double precision, double precision) FROM anon, public;

-- Allow only authenticated for the user-facing ones
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_food_donor(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.nearby_food(double precision, double precision, double precision) TO authenticated;

-- Tighten storage list policies: drop broad SELECT, add path-scoped SELECT for direct file URLs (still works publicly)
-- Public read by file path still works on public buckets via the storage CDN regardless of these policies.
DROP POLICY IF EXISTS "Food photos publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Avatars publicly readable" ON storage.objects;

CREATE POLICY "Owners can list own food photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can list own avatars"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
