import { useVSL } from '@/contexts/vsl/VSLContext';
import { UrgencyBanner } from './UrgencyBanner';
import { VideoSection } from './VideoSection';
import { CommentsSection } from './CommentsSection';
import { LiveBadge } from './LiveBadge';
import { VSLFooter } from './VSLFooter';

export function VSLPreview() {
  const { config } = useVSL();

  return (
    <div
      className="min-h-full"
      style={{
        background: `linear-gradient(180deg, ${config.colors.gradientStart} 0%, ${config.colors.gradientEnd} 100%)`,
      }}
    >
      <UrgencyBanner />
      <VideoSection />
      <CommentsSection />
      <VSLFooter />
    </div>
  );
}
