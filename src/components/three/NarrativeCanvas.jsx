import { useEffect, useRef } from 'react';
import * as THREE from 'three';
// An optical portal: the same scroll that opens the HTML frame advances its camera.
export default function NarrativeCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const mount = ref.current;
    let renderer;
    try { const canvas = document.createElement('canvas'); const context = canvas.getContext('webgl2', { alpha: true, antialias: innerWidth > 760 }); if (!context) return; renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: innerWidth > 760, powerPreference: 'low-power' }); }
    catch { return; }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const small = innerWidth < 760 || (navigator.hardwareConcurrency || 4) <= 4;
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1 : 1.5));
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, .1, 50);
    camera.position.z = 8;
    const group = new THREE.Group(); scene.add(group);
    const material = new THREE.MeshStandardMaterial({ color: 0x73737d, metalness: .85, roughness: .28 });
    const rings = [];
    for (let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4 + i * .12, .025 + i * .01, 8, small ? 64 : 100), material);
      ring.position.z = -i * .6; group.add(ring); rings.push(ring);
    }
    const glow = new THREE.Mesh(new THREE.TorusGeometry(2.4, .014, 6, 100), new THREE.MeshBasicMaterial({ color: 0x9b6dff }));
    group.add(glow);
    scene.add(new THREE.AmbientLight(0xeeeeff, 1.2));
    const light = new THREE.PointLight(0x8b5cf6, 35, 20); light.position.set(2, 2, 4); scene.add(light);
    const white = new THREE.PointLight(0xffffff, 30, 20); white.position.set(-3, -1, 3); scene.add(white);
    const positions = new Float32Array((small ? 100 : 300) * 3);
    for (let i = 0; i < positions.length; i += 3) {
      const angle = i * 2.399963, distance = 2.7 + (i % 17) / 10;
      positions.set([Math.cos(angle) * distance, Math.sin(angle) * distance, -(i % 29) / 5], i);
    }
    const particles = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(positions, 3)), new THREE.PointsMaterial({ color: 0xb6a2dc, size: .018, transparent: true, opacity: .5 }));
    group.add(particles);
    let frame = 0, visible = false, disposed = false, last = 0, time = 0;
    let progress = 0, velocity = 0, x = 0, y = 0;
    const journey = mount.closest('.video-journey');
    function render(now) {
      frame = 0; if (!visible || document.hidden || disposed) return;
      const dt = Math.min((now - last) / 1000 || .016, .05); last = now; time += dt;
      const state = window.__motionState || {};
      const damp = 1 - Math.exp(-dt * 5);
      progress += ((state.intro || 0) - progress) * damp;
      velocity += ((state.velocity || 0) - velocity) * damp;
      x += ((state.pointerX || 0) - x) * damp; y += ((state.pointerY || 0) - y) * damp;
      if (!reduced.matches) {
        camera.position.z = 8 - progress * 4;
        group.rotation.set(y * .1 + progress * .2, x * .15, time * .025 + velocity * .025);
        rings.forEach((ring, i) => { ring.rotation.x = Math.sin(time * .2 + i * .5) * .17 + progress * i * .09; ring.rotation.y = Math.cos(time * .15 + i) * .1; });
        particles.rotation.z = -time * .025;
      }
      renderer.render(scene, camera);
      if (!reduced.matches) frame = requestAnimationFrame(render);
    }
    function schedule() { if (!frame && visible && !disposed && !document.hidden) frame = requestAnimationFrame(render); }
    const resize = new ResizeObserver(() => { const w = mount.clientWidth, h = mount.clientHeight; if (!w || !h) return; renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); schedule(); });
    resize.observe(mount);
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) { last = performance.now(); schedule(); } else { cancelAnimationFrame(frame); frame = 0; } }); observer.observe(journey);
    const visibility = () => { cancelAnimationFrame(frame); frame = 0; schedule(); };
    const lost = event => { event.preventDefault(); visible = false; cancelAnimationFrame(frame); frame = 0; };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', schedule);
    return () => { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', schedule); renderer.domElement.removeEventListener('webglcontextlost', lost); scene.traverse(object => { object.geometry?.dispose(); }); material.dispose(); glow.material.dispose(); particles.material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div ref={ref} className="narrative-canvas" aria-hidden="true" />;
}

