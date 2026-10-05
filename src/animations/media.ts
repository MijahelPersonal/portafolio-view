export function setupMedia() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const cleanup: (() => void)[] = [];
  document.querySelectorAll<HTMLVideoElement>('video').forEach(video => {
    const card = video.closest('article'); let visible = false, hovered = false;
    const sync = () => { if (!visible || document.hidden || reduced.matches) video.pause(); else if (card && (!fine.matches || hovered || card.contains(document.activeElement))) video.play().catch(() => {}); else if (card) video.pause(); };
    const enter = () => { hovered = true; sync(); }; const leave = () => { hovered = false; sync(); };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .25 }); observer.observe(video);
    card?.addEventListener('pointerenter', enter); card?.addEventListener('pointerleave', leave); card?.addEventListener('focusin', sync); card?.addEventListener('focusout', sync);
    document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', sync); fine.addEventListener('change', sync);
    cleanup.push(() => { observer.disconnect(); video.pause(); card?.removeEventListener('pointerenter', enter); card?.removeEventListener('pointerleave', leave); card?.removeEventListener('focusin', sync); card?.removeEventListener('focusout', sync); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); fine.removeEventListener('change', sync); });
  });
  return () => cleanup.forEach(fn => fn());
}
