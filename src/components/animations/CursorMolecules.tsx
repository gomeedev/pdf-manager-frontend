import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CursorMolecules() {
  const containerRef = useRef<HTMLDivElement>(null);
  const moleculesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const count = 12;
    const molecules: HTMLDivElement[] = [];

    // Create molecule elements
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'fixed top-0 left-0 w-2 h-2 rounded-full border border-foreground/20 pointer-events-none z-[9999]';
      el.style.opacity = (1 - i / count).toString();
      container.appendChild(el);
      molecules.push(el);
    }
    moleculesRef.current = molecules;

    const xTo = molecules.map((el) => gsap.quickTo(el, 'x', { duration: 0.2 + molecules.indexOf(el) * 0.05, ease: 'power3' }));
    const yTo = molecules.map((el) => gsap.quickTo(el, 'y', { duration: 0.2 + molecules.indexOf(el) * 0.05, ease: 'power3' }));

    const handleMouseMove = (e: MouseEvent) => {
      xTo.forEach((to) => to(e.clientX - 4));
      yTo.forEach((to) => to(e.clientY - 4));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      molecules.forEach((el) => el.remove());
    };
  }, []);

  return <div ref={containerRef} />;
}
