
-- Enums
CREATE TYPE public.food_category AS ENUM ('veg', 'non_veg', 'vegan');
CREATE TYPE public.food_status AS ENUM ('available', 'reserved', 'picked_up', 'expired', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'ready', 'picked_up', 'cancelled');

-- food_items
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  category public.food_category NOT NULL DEFAULT 'veg',
  cuisine TEXT,
  quantity_servings INTEGER NOT NULL DEFAULT 1 CHECK (quantity_servings > 0),
  prepared_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  pickup_address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  instructions TEXT,
  status public.food_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_food_items_status ON public.food_items(status);
CREATE INDEX idx_food_items_donor ON public.food_items(donor_id);
CREATE INDEX idx_food_items_expires ON public.food_items(expires_at);

ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_food_items_updated_at
BEFORE UPDATE ON public.food_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pickup_window_start TIMESTAMPTZ,
  pickup_window_end TIMESTAMPTZ,
  status public.booking_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_recipient ON public.bookings(recipient_id);
CREATE INDEX idx_bookings_volunteer ON public.bookings(volunteer_id);
CREATE INDEX idx_bookings_food ON public.bookings(food_item_id);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (booking_id, reviewer_id)
);

CREATE INDEX idx_reviews_reviewee ON public.reviews(reviewee_id);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS: food_items
CREATE POLICY "Authenticated users can view food items"
  ON public.food_items FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Donors can insert own food"
  ON public.food_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update own food"
  ON public.food_items FOR UPDATE
  TO authenticated USING (auth.uid() = donor_id);

CREATE POLICY "Donors can delete own food"
  ON public.food_items FOR DELETE
  TO authenticated USING (auth.uid() = donor_id);

-- RLS: bookings (need security definer to check related food donor without recursion)
CREATE OR REPLACE FUNCTION public.is_food_donor(_food_item_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.food_items WHERE id = _food_item_id AND donor_id = _user_id)
$$;

CREATE POLICY "Booking parties can view bookings"
  ON public.bookings FOR SELECT
  TO authenticated USING (
    auth.uid() = recipient_id
    OR auth.uid() = volunteer_id
    OR public.is_food_donor(food_item_id, auth.uid())
  );

CREATE POLICY "Recipients create bookings"
  ON public.bookings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Booking parties update bookings"
  ON public.bookings FOR UPDATE
  TO authenticated USING (
    auth.uid() = recipient_id
    OR auth.uid() = volunteer_id
    OR public.is_food_donor(food_item_id, auth.uid())
  );

-- RLS: reviews
CREATE POLICY "Reviews viewable by all authenticated"
  ON public.reviews FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Reviewer can insert own review"
  ON public.reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = reviewer_id);

-- RLS: notifications
CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id);

-- Freshness scoring function
CREATE OR REPLACE FUNCTION public.freshness_score(_prepared_at TIMESTAMPTZ, _expires_at TIMESTAMPTZ)
RETURNS INTEGER
LANGUAGE SQL IMMUTABLE
AS $$
  SELECT GREATEST(0, LEAST(100, ROUND(
    100.0 * EXTRACT(EPOCH FROM (_expires_at - now())) / NULLIF(EXTRACT(EPOCH FROM (_expires_at - _prepared_at)), 0)
  )::INTEGER))
$$;

-- Nearby food using Haversine
CREATE OR REPLACE FUNCTION public.nearby_food(_lat DOUBLE PRECISION, _lng DOUBLE PRECISION, _radius_km DOUBLE PRECISION DEFAULT 10)
RETURNS TABLE (
  id UUID,
  donor_id UUID,
  title TEXT,
  description TEXT,
  photo_url TEXT,
  category public.food_category,
  cuisine TEXT,
  quantity_servings INTEGER,
  prepared_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  pickup_address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status public.food_status,
  distance_km DOUBLE PRECISION,
  freshness INTEGER
)
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT
    f.id, f.donor_id, f.title, f.description, f.photo_url, f.category, f.cuisine,
    f.quantity_servings, f.prepared_at, f.expires_at, f.pickup_address, f.lat, f.lng, f.status,
    CASE
      WHEN f.lat IS NULL OR f.lng IS NULL OR _lat IS NULL OR _lng IS NULL THEN NULL
      ELSE 6371 * 2 * asin(sqrt(
        power(sin(radians((f.lat - _lat) / 2)), 2)
        + cos(radians(_lat)) * cos(radians(f.lat))
        * power(sin(radians((f.lng - _lng) / 2)), 2)
      ))
    END AS distance_km,
    public.freshness_score(f.prepared_at, f.expires_at) AS freshness
  FROM public.food_items f
  WHERE f.status = 'available' AND f.expires_at > now()
    AND (
      _lat IS NULL OR _lng IS NULL OR f.lat IS NULL OR f.lng IS NULL
      OR (6371 * 2 * asin(sqrt(
          power(sin(radians((f.lat - _lat) / 2)), 2)
          + cos(radians(_lat)) * cos(radians(f.lat))
          * power(sin(radians((f.lng - _lng) / 2)), 2)
        ))) <= _radius_km
    )
  ORDER BY distance_km NULLS LAST, f.created_at DESC
$$;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('food-photos', 'food-photos', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Food photos publicly readable"
  ON storage.objects FOR SELECT USING (bucket_id = 'food-photos');

CREATE POLICY "Authenticated upload food photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners update own food photos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners delete own food photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'food-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Avatars publicly readable"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated upload avatar"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners update avatar"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.food_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Notification triggers
CREATE OR REPLACE FUNCTION public.notify_on_booking_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _donor UUID;
  _title TEXT;
BEGIN
  SELECT donor_id, title INTO _donor, _title FROM public.food_items WHERE id = NEW.food_item_id;
  IF _donor IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (_donor, 'booking_request', 'New booking request',
      'Someone wants to pick up "' || _title || '"',
      jsonb_build_object('booking_id', NEW.id, 'food_item_id', NEW.food_item_id));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_insert
AFTER INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_on_booking_insert();

CREATE OR REPLACE FUNCTION public.notify_on_booking_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _title TEXT;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    SELECT title INTO _title FROM public.food_items WHERE id = NEW.food_item_id;
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (NEW.recipient_id, 'booking_status', 'Booking ' || NEW.status,
      'Your booking for "' || _title || '" is now ' || NEW.status,
      jsonb_build_object('booking_id', NEW.id));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_update
AFTER UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.notify_on_booking_update();
