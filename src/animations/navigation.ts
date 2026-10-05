import gsap from 'gsap';

let tween: gsap.core.Tween | undefined;
export function scrollToAnchor(hash: string, updateHistory = true) {
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return;
  tween?.kill();
  const offset = target.id === 'inicio' ? 0 : 100;
  const y = Math.max(0, Math.min(target.getBoundingClientRect().top + scrollY - offset, document.documentElement.scrollHeight - innerHeight));
  const distance = Math.abs(y - scrollY);
  if (updateHistory && location.hash !== hash) history.pushState(null, '', hash);
  const finish = () => {
    const previous = target.getAttribute('tabindex');
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', () => { if (previous === null) target.removeAttribute('tabindex'); else target.setAttribute('tabindex', previous); }, { once: true });
    tween = undefined;
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || distance < 2) { window.scrollTo(0, y); finish(); return; }
  const position = { y: scrollY };
  tween = gsap.to(position, { y, duration: gsap.utils.clamp(.6, 1.2, .6 + distance / 6500), ease: 'power3.inOut', onUpdate: () => window.scrollTo(0, position.y), onComplete: finish });
}
export function setupNavigation() {
  const click = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.target === '_blank' || !link.hash || !document.getElementById(decodeURIComponent(link.hash.slice(1)))) return;
    event.preventDefault(); scrollToAnchor(link.hash);
  };
  const cancel = () => { tween?.kill(); tween = undefined; };
  const key = (event: KeyboardEvent) => { if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) cancel(); };
  const back = () => { if (location.hash) scrollToAnchor(location.hash, false); else { cancel(); window.scrollTo(0,0); } };
  history.scrollRestoration = 'manual';
  document.addEventListener('click', click);
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', key);
  window.addEventListener('popstate', back);
  return () => {
    cancel();
    document.removeEventListener('click', click); window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel); window.removeEventListener('keydown', key); window.removeEventListener('popstate', back);
  };
}

