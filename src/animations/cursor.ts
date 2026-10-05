import gsap from 'gsap';
import { motion } from './timelines';
export function setupCursor() {
  const mm = gsap.matchMedia();
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    const cursor = document.querySelector<HTMLElement>('#cursor-glow')!;
    let x = -100, y = -100, targetX = -100, targetY = -100, previousX = x, previousY = y;
    let active: HTMLElement | null = null;
    const move = (event: PointerEvent) => {
      targetX = event.clientX; targetY = event.clientY;
      motion.pointerX = event.clientX / innerWidth * 2 - 1; motion.pointerY = event.clientY / innerHeight * 2 - 1;
      const target = (event.target as Element).closest<HTMLElement>('[data-cursor]');
      cursor.textContent = target?.dataset.cursor || ''; cursor.classList.toggle('cursor-active', !!target); cursor.classList.add('cursor-visible');
      const visual = (event.target as Element).closest<HTMLElement>('[data-tilt]');
      if (active !== visual) { if (active) { gsap.to(active, { rotationX: 0, rotationY: 0, duration: .6 }); gsap.to(active.querySelector('img,video'), { x: 0, y: 0, duration: .6 }); } active = visual; }
      if (visual) { const rect = visual.getBoundingClientRect(); const media = visual.querySelector('img,video'); if (media) gsap.to(media, { x: (event.clientX - rect.left - rect.width / 2) / rect.width * 10, y: (event.clientY - rect.top - rect.height / 2) / rect.height * 8, duration: .7, overwrite: 'auto' }); gsap.to(visual, { rotationX: -(event.clientY - rect.top - rect.height / 2) / rect.height * 5, rotationY: (event.clientX - rect.left - rect.width / 2) / rect.width * 5, transformPerspective: 1000, duration: .7, overwrite: 'auto' }); }
    };
    const tick = (_time: number, delta: number) => {
      if (document.hidden) return;
      const factor = 1 - Math.exp(-Math.min(delta, 50) / 65);
      x += (targetX - x) * factor; y += (targetY - y) * factor;
      const dx = x - previousX, dy = y - previousY, speed = Math.min(Math.hypot(dx, dy) / 100, .17);
      cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${1 + speed},${1 - speed})`;
      previousX = x; previousY = y;
    };
    const leave = () => { cursor.classList.remove('cursor-visible'); if (active) gsap.to(active, { rotationX: 0, rotationY: 0, duration: .5 }); active = null; };
    const magnets = [...document.querySelectorAll<HTMLElement>('.button')];
    const cleanup: (() => void)[] = [];
    magnets.forEach(button => {
      const generated: HTMLSpanElement[] = [];
      [...button.childNodes].forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          const label = document.createElement('span'); label.className = 'button-label'; node.replaceWith(label); label.appendChild(node); generated.push(label);
        }
      });
      const magnet = (event: PointerEvent) => { const rect = button.getBoundingClientRect(); gsap.to(button.querySelectorAll('.button-label'), { x: (event.clientX-rect.left-rect.width/2)*.025, duration:.4, overwrite:'auto' }); gsap.to(button, { x: (event.clientX - rect.left - rect.width / 2) * .08, y: (event.clientY - rect.top - rect.height / 2) * .12, duration: .45, overwrite: 'auto' }); };
      const reset = () => { gsap.to(button, { x: 0, y: 0, duration: .6, overwrite:'auto' }); gsap.to(button.querySelectorAll('.button-label'), { x:0, duration:.5, overwrite:'auto' }); };
      button.addEventListener('pointermove', magnet); button.addEventListener('pointerleave', reset);
      cleanup.push(() => { button.removeEventListener('pointermove', magnet); button.removeEventListener('pointerleave', reset); gsap.set(button, { clearProps: 'transform' }); generated.forEach(label => label.replaceWith(...label.childNodes)); });
    });
    window.addEventListener('pointermove', move, { passive: true }); document.addEventListener('mouseleave', leave); gsap.ticker.add(tick);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('mouseleave', leave); gsap.ticker.remove(tick); cleanup.forEach(fn => fn()); leave(); motion.pointerX = 0; motion.pointerY = 0; };
  });
  return () => mm.revert();
}



