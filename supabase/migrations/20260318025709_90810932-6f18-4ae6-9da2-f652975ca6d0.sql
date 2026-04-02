CREATE TABLE public.terms_analyses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Análise de Termos',
  result text NOT NULL,
  script_preview text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.terms_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own terms analyses" ON public.terms_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own terms analyses" ON public.terms_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own terms analyses" ON public.terms_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);