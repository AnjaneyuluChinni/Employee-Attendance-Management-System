-- Fix search_path for calculate_attendance_hours function
CREATE OR REPLACE FUNCTION public.calculate_attendance_hours()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.check_in_time IS NOT NULL AND NEW.check_out_time IS NOT NULL THEN
    NEW.total_hours := ROUND(EXTRACT(EPOCH FROM (NEW.check_out_time - NEW.check_in_time)) / 3600, 2);
  END IF;
  RETURN NEW;
END;
$$;