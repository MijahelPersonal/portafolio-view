import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// A quiet galaxy surrounds the progress bar; no central model.
export default function LoaderScene({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mount = ref.current;
    let renderer;
    try { const canvas = document.createElement('canvas'); const context = canvas.getContext('webgl2', { alpha: true, antialias: true }); if (!context) { state.current.sceneReady = true; return; } renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true }); }
    catch { state.current.sceneReady = true; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1 : 1.5)); mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(45, 1, .1, 150);
    camera.position.z = 8;
    const galaxy = new THREE.Group(); scene.add(galaxy);
    const count = innerWidth < 760 ? 550 : 1600, positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { const y = 1 - i / count * 2, angle = i * 2.399963, distance = 14 + (i % 31) * .7, radial = Math.sqrt(1 - y * y); positions.set([Math.cos(angle) * radial * distance, y * distance, Math.sin(angle) * radial * distance], i * 3); }
    const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)), new THREE.PointsMaterial({ color: 0xe3deee, size: .075, transparent: true, opacity: .65, depthWrite: false })); galaxy.add(stars);
    let disposed = false, frame = 0, time = 0, last = 0, mx = 0, my = 0;
    function draw(now) {
      frame = 0; if (disposed || document.hidden) return;
      const dt = Math.min((now-last)/1000 || .016, .05); last = now; time += dt;
      const pointer = window.__motionState || {}; const factor = 1 - Math.exp(-dt * 4);
      mx += ((pointer.pointerX || 0) - mx) * factor; my += ((pointer.pointerY || 0) - my) * factor;
      galaxy.rotation.y = time * .04; galaxy.rotation.x = time * .015;
      camera.position.set(mx * .16, -my * .12, 8 - (state.current.exit || 0) * 2);
      renderer.render(scene, camera); state.current.sceneReady = true; mount.classList.add('loader-scene-ready'); frame = requestAnimationFrame(draw);
    }
    const resize = new ResizeObserver(() => { const w=mount.clientWidth,h=mount.clientHeight; if(w&&h){renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();} }); resize.observe(mount);
    const visibility = () => { cancelAnimationFrame(frame); frame=0; if(!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);} };
    document.addEventListener('visibilitychange',visibility); frame=requestAnimationFrame(draw);
    return () => { disposed=true;cancelAnimationFrame(frame);resize.disconnect();document.removeEventListener('visibilitychange',visibility);scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.dispose();renderer.domElement.remove(); };
  }, [state]);
  return <div className="loader-scene" ref={ref} aria-hidden="true"></div>;
}




