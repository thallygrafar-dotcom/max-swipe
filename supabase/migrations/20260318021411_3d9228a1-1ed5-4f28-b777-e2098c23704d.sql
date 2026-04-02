
CREATE TABLE public.cluster_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Cluster sem título',
  script_preview text,
  result text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.cluster_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cluster analyses"
  ON public.cluster_analyses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cluster analyses"
  ON public.cluster_analyses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cluster analyses"
  ON public.cluster_analyses FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
