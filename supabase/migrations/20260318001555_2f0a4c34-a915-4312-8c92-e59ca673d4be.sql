CREATE TABLE public.allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can check allowed emails"
ON public.allowed_emails
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Authenticated users can manage allowed emails"
ON public.allowed_emails
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

INSERT INTO public.allowed_emails (email) VALUES ('admin@pressel.com');