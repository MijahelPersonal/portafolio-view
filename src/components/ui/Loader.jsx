import { useEffect, useRef, useState } from 'react';
import LoaderScene from '../three/LoaderScene';
export default function Loader() {
  const [phase, setPhase] = useState('loading');
  const state = useRef({ sceneReady: false, exit: 0 });
  const percent = useRef(null), bar = useRef(null);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, elapsed = 0, last = performance.now(), exitStarted = false, disposed = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const finish = () => { document.body.style.overflow = previousOverflow; setPhase('done'); };
    function tick(now) {
      frame=0;if(disposed||document.hidden)return;
      // Keep the initial viewport at the Hero until the exit mask begins.
      if (!exitStarted && (window.scrollX || window.scrollY)) window.scrollTo(0, 0);
      const dt=Math.max(0,Math.min(now-last,100));last=now;elapsed+=dt;
      const duration=reduced.matches ? 0 : 3000;
      const ready=state.current.sceneReady || elapsed>=3000 || reduced.matches;
      const progress=ready ? Math.min(100,elapsed/Math.max(duration,1)*100) : Math.min(94,elapsed/3000*94);
      if(!exitStarted&&percent.current)percent.current.textContent=`${Math.floor(progress)}%`;
      if(!exitStarted&&bar.current)bar.current.style.transform=`scaleX(${progress/100})`;
      if(progress>=100&&!exitStarted){window.scrollTo(0,0);exitStarted=true;elapsed=0;setPhase('revealing');window.__loaderRevealed=true;window.dispatchEvent(new Event('loader:reveal'));document.body.style.overflow=previousOverflow;}
      else if(exitStarted){state.current.exit=Math.min(elapsed/850,1);if(reduced.matches||elapsed>=900){finish();return;}}
      frame=requestAnimationFrame(tick);
    }
    const visibility=()=>{cancelAnimationFrame(frame);frame=0;last=performance.now();if(!document.hidden)frame=requestAnimationFrame(tick);};
    document.addEventListener('visibilitychange',visibility);frame=requestAnimationFrame(tick);
    return()=>{disposed=true;cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);document.body.style.overflow=previousOverflow;};
  }, []);
  if(phase==='done')return null;
  return <div className={`welcome welcome-${phase}`} aria-hidden="true"><LoaderScene state={state}/><div className="loader-interface"><div><span>BIENVENIDO AL PORTAFOLIO</span><span ref={percent} className="loader-percentage">0%</span></div><div className="loader-track"><div ref={bar} className="loader-bar"/></div></div></div>;
}





