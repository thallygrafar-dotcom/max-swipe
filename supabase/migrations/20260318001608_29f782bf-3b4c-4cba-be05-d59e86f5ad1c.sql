DROP POLICY "Authenticated users can manage allowed emails" ON public.allowed_emails;

CREATE POLICY "Authenticated users can insert allowed emails"
ON public.allowed_emails
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.allowed_emails ae
    WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

CREATE POLICY "Authenticated users can delete allowed emails"
ON public.allowed_emails
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.allowed_emails ae
    WHERE ae.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);