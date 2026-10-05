import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export const motion = { intro: 0, velocity: 0, pointerX: 0, pointerY: 0 };
declare global { interface Window { __motionState?: typeof motion; __heroReady?: boolean; __loaderRevealed?: boolean } }
window.__motionState = motion;
export function setupTimelines() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const heroTimeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 1 } });
    const originals = new Map<HTMLElement, string>();
    document.querySelectorAll<HTMLElement>('h1[data-reveal],h2[data-reveal]').forEach(heading => {
      originals.set(heading, heading.innerHTML);
      const groups: Node[][] = [[]];
      [...heading.childNodes].forEach(node => { if (node.nodeName === 'BR') groups.push([]); else groups[groups.length-1].push(node); });
      heading.replaceChildren();
      groups.forEach(nodes => {
        const mask = document.createElement('span'), line = document.createElement('span');
        mask.className = 'text-line-mask'; line.className = 'text-line';
        nodes.forEach(node => line.appendChild(node)); mask.appendChild(line); heading.appendChild(mask);
      });
    });
    heroTimeline.from('.hero-copy .eyebrow', { y: 10, opacity: 0, duration: .5, clearProps: 'opacity,transform' }, 0)
      .from('.hero-copy .text-line', { yPercent: 110, skewY: 3, stagger: .12, duration: 1.1, clearProps: 'transform' }, .08)
      .from('.hero-description', { y: 18, opacity: 0, filter: 'blur(3px)', duration: .85, clearProps: 'opacity,transform,filter' }, .32)
      .from('.hero-copy .button', { y: 15, opacity: 0, duration: .65, clearProps: 'opacity,transform' }, .48)
      .from('.globe-stage', { scale: .82, opacity: 0, duration: 1.3, clearProps: 'opacity,transform' }, .08);
    const reveal = () => heroTimeline.play();
    window.addEventListener('loader:reveal', reveal, { once: true });
    if (window.__loaderRevealed) reveal();
    const recovery = setTimeout(reveal, 6000);
    const introTimeline = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .7 } });
    introTimeline.to('.hero-copy', { y: 100, opacity: .3, ease: 'none' }, 0).to('.globe-stage', { y: 65, scale: 1.13, ease: 'none' }, 0);
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
      if (element.closest('.hero') || element.classList.contains('technology-group')) return;
      const entry = gsap.timeline({ scrollTrigger: { trigger: element, start: 'top 92%', toggleActions: 'play none none none' } });
      if (element.matches('h2')) {
        entry.from(element.querySelectorAll('.text-line'), { yPercent: 105, skewY: 2, duration: .85, stagger: .12, ease: 'power3.out', clearProps: 'transform' });
      } else if (element.matches('.about-copy')) {
        entry.from(element.children, { y: 16, opacity: 0, filter: 'blur(2px)', duration: .7, stagger: .14, ease: 'power2.out', clearProps: 'opacity,transform,filter' });
      } else if (element.matches('.eyebrow')) {
        entry.from(element, { x: -10, opacity: 0, duration: .5, ease: 'power2.out', clearProps: 'opacity,transform' });
      } else {
        entry.from(element, { y: 18, opacity: 0, duration: .7, ease: 'power2.out', clearProps: 'opacity,transform' });
      }
    });
    document.querySelectorAll('.technology-group').forEach(group => {
      gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 86%', toggleActions: 'play none none none' } })
        .from(group.querySelectorAll('h3,p'), { y: 14, clipPath: 'inset(0 0 100% 0)', duration: .65, stagger: .08, ease: 'power3.out', clearProps: 'transform,clipPath' })
        .from(group.querySelectorAll('li'), { x: -9, opacity: 0, duration: .45, stagger: .045, clearProps: 'opacity,transform' }, .18);
    });
    document.querySelectorAll('.project-card').forEach(card => {
      const entry = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 82%', toggleActions: 'play none none none' } });
      entry
        .from(card.querySelector('h3'), { y: 18, clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'power3.out', clearProps: 'transform,clipPath' })
        .from(card.querySelectorAll('.project-info p'), { y: 10, opacity: 0, duration: .6, stagger: .07, clearProps: 'opacity,transform' }, .12);
      const tags = card.querySelectorAll('.tags li');
      if(tags.length) entry.from(tags, { y: 7, opacity: 0, duration: .4, stagger: .035, clearProps: 'opacity,transform' }, .24);
    });
    gsap.from('.contact > .button', { scrollTrigger: { trigger: '.contact > .button', start: 'top 94%', toggleActions: 'play none none none' }, scale: .96, y: 14, opacity: 0, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity' });
    const technologyTimeline = gsap.timeline({ scrollTrigger: { trigger: '.technology-grid', start: 'top 88%', end: 'top 35%', scrub: .55 } });
    technologyTimeline.from('.technology-group', { y: 65, rotationX: 8, opacity: .15, stagger: .12, ease: 'power2.out' });
    const frame = document.querySelector<HTMLElement>('.intro-frame')!;
    const mobile = innerWidth < 760;
    const videoTimeline = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '.video-journey', start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true, onUpdate: self => { motion.intro = self.progress; } } });
    videoTimeline.fromTo(frame, { clipPath: mobile ? 'inset(17% 5% 14% round 22px)' : 'inset(19% 20% 14% round 32px)', rotationX: mobile ? 0 : 8, y: 45 }, { clipPath: 'inset(0% 0% 0% round 0px)', rotationX: 0, y: 0, duration: 2.2 }, 0)
      .to('.intro-placeholder', { opacity: 0, scale: 1.1, duration: .6 }, 1.8)
      .to('#navbar', { autoAlpha: 0, duration: .35 }, 1.6);
    document.querySelectorAll('.intro-word').forEach((word, i) => {
      const at = 2.4 + i * .8;
      videoTimeline.fromTo(word, { opacity: 0, y: 55, scale: .92 }, { opacity: 1, y: 0, scale: 1, duration: .3 }, at)
        .to(word, { opacity: 0, y: -45, duration: .3 }, at + .5);
    });
    videoTimeline.to('.intro-narrative', { opacity: 0, duration: .3 }, 5.6).to('#navbar', { autoAlpha: 1, duration: .35 }, 5.8).to(frame, { opacity: .25, duration: .5 }, 5.9);
    const projectsTimeline = gsap.timeline({ scrollTrigger: { trigger: '.projects-grid', start: 'top 90%', end: 'top 35%', scrub: .6 } });
    projectsTimeline.from('.project-card:nth-child(-n+2)', { y: 85, rotationX: 5, opacity: .1, stagger: .15, ease: 'power2.out' });
    document.querySelectorAll('.project-card:nth-child(n+3)').forEach(card => {
      gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 92%', toggleActions: 'play none none none' } }).from(card, { y: 65, opacity: 0, duration: .9, ease: 'power3.out' });
    });
    const velocityTrigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { motion.velocity = gsap.utils.clamp(-1, 1, self.getVelocity() / 2500); } });
    let previous = 0;
    const decay = (_time: number, delta: number) => { motion.velocity *= Math.exp(-delta / 150); if (Math.abs(motion.velocity - previous) > .001) { document.documentElement.style.setProperty('--scroll-energy', String(motion.velocity)); previous = motion.velocity; } };
    gsap.ticker.add(decay);
    return () => { originals.forEach((html, heading) => heading.innerHTML = html); clearTimeout(recovery); window.removeEventListener('loader:reveal', reveal); gsap.ticker.remove(decay); velocityTrigger.kill(); motion.intro = 0; motion.velocity = 0; };
  });
  return () => mm.revert();
}






