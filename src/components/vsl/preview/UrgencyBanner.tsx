import { useVSL } from '@/contexts/vsl/VSLContext';
import { useMemo } from 'react';

export function useTodayFormatted() {
  return useMemo(() => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);
}

export function UrgencyBanner() {
  const { config } = useVSL();
  const todayFormatted = useTodayFormatted();

  return (
    <div
      className="py-4 px-4 text-center"
      style={{ backgroundColor: config.colors.urgencyBg }}
    >
      <p
        className="font-semibold text-sm md:text-base max-w-4xl mx-auto"
        style={{ color: config.colors.urgencyText }}
      >
        <span
          className="px-2 py-1 rounded mr-2 font-bold"
          style={{
            backgroundColor: config.colors.urgencyText,
            color: config.colors.urgencyBg,
          }}
        >
          {config.urgencyText}
        </span>
        <span className="underline decoration-2">
          {config.urgencyDatePrefix} {todayFormatted}
        </span>
      </p>
    </div>
  );
}
