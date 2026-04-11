import { useVSL } from '@/contexts/vsl/VSLContext';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LiveBadge() {
  const { config } = useVSL();
  const [displayCount, setDisplayCount] = useState(config.viewerCount);

  useEffect(() => {
    setDisplayCount(config.viewerCount);
  }, [config.viewerCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 11) - 5;
      setDisplayCount(prev => {
        const min = Math.floor(config.viewerCount * 0.8);
        const max = Math.floor(config.viewerCount * 1.2);
        return Math.max(min, Math.min(max, prev + fluctuation));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [config.viewerCount]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-card rounded-lg shadow-lg border border-border p-3 flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center animate-pulse"
          style={{ backgroundColor: config.colors.liveBadgeBg }}
        >
          <Play className="w-5 h-5" style={{ color: config.colors.liveBadgeText, fill: config.colors.liveBadgeText }} />
        </div>
        <div className="text-sm">
          <div className="font-bold text-foreground">
            <span style={{ color: config.colors.liveBadgeBg }}>{displayCount.toLocaleString()}</span> {config.liveBadgeText1}
          </div>
          <div className="text-foreground font-medium">{config.liveBadgeText2}</div>
          <div className="text-muted-foreground text-xs">{config.liveBadgeText3}</div>
        </div>
      </div>
    </div>
  );
}
