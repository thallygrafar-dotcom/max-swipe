CREATE TABLE public.bridge_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Bridge Page',
  script_preview TEXT,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bridge_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bridge analyses"
  ON public.bridge_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bridge analyses"
  ON public.bridge_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bridge analyses"
  ON public.bridge_analyses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);