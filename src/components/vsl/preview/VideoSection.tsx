import { useVSL } from '@/contexts/vsl/VSLContext';
import { useEffect, useRef } from 'react';

export function VideoSection() {
  const { config } = useVSL();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config.vturbEmbedCode || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const temp = document.createElement('div');
    temp.innerHTML = config.vturbEmbedCode;

    const scripts = temp.querySelectorAll('script');
    const nonScriptContent = config.vturbEmbedCode.replace(/<script[\s\S]*?<\/script>/gi, '');

    containerRef.current.innerHTML = nonScriptContent;

    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = true;
      } else {
        newScript.textContent = oldScript.textContent;
      }
      document.head.appendChild(newScript);
    });

    return () => {
      scripts.forEach((oldScript) => {
        if (oldScript.src) {
          const existingScript = document.querySelector(`script[src="${oldScript.src}"]`);
          if (existingScript) existingScript.remove();
        }
      });
    };
  }, [config.vturbEmbedCode]);

  return (
    <section className="py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 
          className="text-lg md:text-xl font-bold mb-1"
          style={{ color: config.colors.headlineColor }}
        >
          {config.headline}
        </h1>
        <h2 className="text-lg md:text-xl font-bold mb-6">
          <span 
            className="px-2 py-1"
            style={{ backgroundColor: config.colors.subheadlineColor, color: '#ffffff' }}
          >
            {config.subheadline}
          </span>
        </h2>

        <div className="relative">
          {config.vturbEmbedCode ? (
            <div ref={containerRef} className="w-full" />
          ) : (
            <div 
              className="w-full aspect-video flex items-center justify-center"
              style={{ backgroundColor: config.colors.subheadlineColor }}
            >
              <p className="text-white text-lg">Cole o código embed do Vturb no painel admin</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
