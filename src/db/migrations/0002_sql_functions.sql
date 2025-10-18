```sql
-- Migration: add SQL helper functions
-- 1) distance_between_zones(a uuid, b uuid) RETURNS double precision
--    -> returns distance in meters using PostGIS ST_DistanceSphere
-- 2) zone_safety_score(z uuid) RETURNS integer
--    -> computes a simple safety score (0-100) from zone_feature_details booleans
-- 3) zone_safety_label(z uuid) RETURNS text
--    -> human label based on score

CREATE OR REPLACE FUNCTION public.distance_between_zones(a uuid, b uuid)
RETURNS double precision AS $$
DECLARE
  pa geometry;
  pb geometry;
BEGIN
  SELECT geom INTO pa FROM zones WHERE id = a LIMIT 1;
  SELECT geom INTO pb FROM zones WHERE id = b LIMIT 1;
  IF pa IS NULL OR pb IS NULL THEN
    RETURN NULL; -- one or both zones missing or without geometry
  END IF;
  RETURN ST_DistanceSphere(pa, pb); -- meters (approx)
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.zone_safety_score(z uuid)
RETURNS integer AS $$
DECLARE
  rec RECORD;
  score integer := 50; -- neutral baseline
BEGIN
  SELECT * INTO rec FROM zone_feature_details WHERE zone_id = z LIMIT 1;
  IF NOT FOUND THEN
    RETURN NULL; -- no details available
  END IF;

  -- Positive contributors
  IF rec.good_lighting THEN
    score := score + 15;
  END IF;
  IF rec.police_presence THEN
    score := score + 15;
  END IF;
  IF rec.public_transport THEN
    score := score + 10;
  END IF;

  -- Negative contributors
  IF rec.insufficient_lighting THEN
    score := score - 15;
  END IF;
  IF rec.lack_of_policing THEN
    score := score - 15;
  END IF;
  IF rec.abandoned_houses THEN
    score := score - 10;
  END IF;

  -- clamp 0..100
  IF score < 0 THEN
    score := 0;
  ELSIF score > 100 THEN
    score := 100;
  END IF;

  RETURN score;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.zone_safety_label(z uuid)
RETURNS text AS $$
DECLARE
  s integer;
BEGIN
  s := zone_safety_score(z);
  IF s IS NULL THEN
    RETURN 'unknown';
  ELSIF s >= 75 THEN
    RETURN 'safe';
  ELSIF s >= 40 THEN
    RETURN 'moderate';
  ELSE
    RETURN 'danger';
  END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- It's safe to re-run this migration: functions are created with CREATE OR REPLACE
```