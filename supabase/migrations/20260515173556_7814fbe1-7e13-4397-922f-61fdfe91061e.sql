
CREATE OR REPLACE FUNCTION public.freshness_score(_prepared_at TIMESTAMPTZ, _expires_at TIMESTAMPTZ)
RETURNS INTEGER
LANGUAGE SQL IMMUTABLE
SET search_path = public
AS $$
  SELECT GREATEST(0, LEAST(100, ROUND(
    100.0 * EXTRACT(EPOCH FROM (_expires_at - now())) / NULLIF(EXTRACT(EPOCH FROM (_expires_at - _prepared_at)), 0)
  )::INTEGER))
$$;
