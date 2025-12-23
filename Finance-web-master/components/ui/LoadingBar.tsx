'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading
    setLoading(true);
    setProgress(20);

    // Simulate progress
    const timer1 = setTimeout(() => setProgress(40), 100);
    const timer2 = setTimeout(() => setProgress(60), 200);
    const timer3 = setTimeout(() => setProgress(80), 300);

    // Complete loading
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(completeTimer);
    };
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <>
      {/* Loading Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 transition-all duration-300 ease-out z-[9999]"
        style={{
          width: `${progress}%`,
          opacity: loading ? 1 : 0,
        }}
      >
        {/* Glow effect */}
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-blue-400 to-transparent" />
      </div>

      {/* Full page overlay loader for slower transitions */}
      {loading && progress < 100 && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[9998] pointer-events-none transition-opacity duration-200">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {/* Spinning loader */}
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              {/* Inner pulse */}
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-100 rounded-full animate-ping opacity-20" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
