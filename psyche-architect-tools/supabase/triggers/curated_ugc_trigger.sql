-- SQL Trigger for Curated UGC Webhook

CREATE OR REPLACE FUNCTION public.handle_curated_ugc()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Curated' AND OLD.status IS DISTINCT FROM 'Curated' THEN
    PERFORM net.http_post(
      url     := 'http://localhost:54321/functions/v1/curated-ugc-webhook', -- Supabase Functions URL
      headers := '{"Content-Type": "application/json"}',
      body    := jsonb_build_object('record', NEW, 'type', TG_OP)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_ugc_update
AFTER INSERT OR UPDATE ON public.ugc_submissions
FOR EACH ROW EXECUTE FUNCTION public.handle_curated_ugc();

-- Note: Please execute this SQL in your Supabase instance to set up the trigger.
-- Ensure that the 'net' extension is enabled in your Supabase project.
