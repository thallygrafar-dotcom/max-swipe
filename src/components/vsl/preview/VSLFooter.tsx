import { useVSL } from '@/contexts/vsl/VSLContext';

export function VSLFooter() {
  const { config } = useVSL();

  return (
    <footer 
      className="py-6 px-4 text-center"
      style={{ backgroundColor: config.colors.footerBg }}
    >
      <p className="font-semibold text-sm" style={{ color: config.colors.footerText }}>
        {config.footerText}
      </p>
      <p className="text-sm mt-2 opacity-70" style={{ color: config.colors.footerText }}>
        {config.footerCountry}
      </p>
    </footer>
  );
}
