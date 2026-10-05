import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { countryName, detectCountry } from '../../utils/country';

const radius = 2.35;
export function latLonToVector3(lat, lon, r = radius) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}
function ready() { if (!window.__heroReady) { window.__heroReady = true; window.dispatchEvent(new Event('hero:ready')); } }

export default function HeroCanvas() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [status, setStatus] = useState('Ubicación aproximada por país · sin GPS');
  const [failed, setFailed] = useState(false);
  const [boundaryStatus, setBoundaryStatus] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    let active = true, manual = false;
    const parent = mountRef.current?.parentElement;
    const manualChange = () => { manual = true; controller.abort(); };
    parent?.addEventListener('country:manual', manualChange);
    fetch('/geo/countries.json', { signal: controller.signal }).then(r => {
      if (!r.ok) throw new Error(); return r.json();
    }).then(data => { if (active) setCountries(data.sort((a,b) => countryName(a.code).localeCompare(countryName(b.code), 'es'))); }).catch(() => {});
    const timeout = setTimeout(() => controller.abort(), 4000);
    detectCountry(controller.signal).then(code => {
      if (active && !manual) { setCountry(code); setStatus('País estimado por IP · puedes cambiarlo'); }
    }).catch(() => { if (active && !manual) setStatus('No pudimos estimar tu país. Puedes elegirlo.'); });
    return () => { active = false; clearTimeout(timeout); controller.abort(); parent?.removeEventListener('country:manual', manualChange); };
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer;
    try { const canvas = document.createElement('canvas'); const context = canvas.getContext('webgl2', { alpha: true, antialias: true }); if (!context) { setFailed(true); ready(); return; } renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: true, powerPreference: 'low-power' }); }
    catch { setFailed(true); ready(); return; }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const lowPower = (navigator.hardwareConcurrency || 4) <= 4 || innerWidth < 760;
    renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1.25 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.6);
    const globe = new THREE.Group();
    scene.add(globe);
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0xa3a3ac, shininess: 10 });
    earthMaterial.onBeforeCompile = shader => { shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\nfloat gray=dot(diffuseColor.rgb,vec3(0.299,0.587,0.114)); diffuseColor.rgb=vec3(gray);'); };
    const earth = new THREE.Mesh(new THREE.SphereGeometry(radius, lowPower ? 40 : 64, 40), earthMaterial);
    globe.add(earth);
    let disposed = false, textureSettled = false;
    const texture = new THREE.TextureLoader().load('/textures/earth.webp', loaded => {
      if (disposed) { loaded.dispose(); return; }
      textureSettled = true; loaded.colorSpace = THREE.SRGBColorSpace; earthMaterial.map = loaded; earthMaterial.needsUpdate = true; schedule();
    }, undefined, () => { textureSettled = true; schedule(); });
    scene.add(new THREE.AmbientLight(0x90909d, 2.1));
    const light = new THREE.DirectionalLight(0xeee6ff, 3);
    light.position.set(-4, 3, 5); scene.add(light);
    const rim = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.028, 40, 28), new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, depthWrite: false,
      vertexShader: 'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.0);vPosition=p.xyz;gl_Position=projectionMatrix*p;}',
      fragmentShader: 'varying vec3 vNormal; varying vec3 vPosition; void main(){float intensity=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.0);gl_FragColor=vec4(0.61,0.43,1.0,intensity*0.5);}'
    }));
    globe.add(rim);
    const count = lowPower ? 450 : 1000;
    const flat = new Float32Array(count * 3), sphere = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const y = 1 - i / (count - 1) * 2, angle = Math.PI * (3 - Math.sqrt(5)) * i;
      const r = Math.sqrt(1 - y*y) * radius * 1.045;
      sphere.set([Math.cos(angle)*r, y*radius*1.045, Math.sin(angle)*r], i*3);
      flat.set([(i%40-20)*0.15, -2.4, (Math.floor(i/40)-12)*0.15], i*3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(flat.slice(),3));
    const dust = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xbca4ff, size: 0.025, transparent: true, opacity: 0.55, depthWrite: false }));
    globe.add(dust);
    const outline = new THREE.Group(); globe.add(outline);
    let targetY = -1.3, targetX = -0.15;
    globe.rotation.set(targetX, targetY, 0);
    sceneRef.current = { outline, globe, orient: vector => {
      targetY = -Math.atan2(vector.x, vector.z);
      targetX = Math.atan2(vector.y, Math.hypot(vector.x, vector.z));
      // Choose the nearest equivalent angle rather than spin through a full revolution.
      targetY = globe.rotation.y + THREE.MathUtils.euclideanModulo(targetY - globe.rotation.y + Math.PI, Math.PI * 2) - Math.PI;
      schedule();
    }, schedule };
    let visible = true, frame = 0, last = 0, elapsed = 0;
    let pointer = { x: 0, y: 0 }, dragged = false, dragX = 0;
    const start = performance.now();
    function draw(now) {
      frame = 0;
      if (disposed || document.hidden || !visible) return;
      const dt = Math.min((now-last)/1000 || 0.016, 0.05); last = now; elapsed += dt;
      const progress = reduced.matches ? 1 : Math.min((now-start)/1400, 1);
      const eased = 1 - Math.pow(1-progress,3);
      if (progress < 1 || geometry.userData.formed !== true) {
        const positions = geometry.attributes.position;
        for (let i = 0; i < sphere.length; i++) positions.array[i] = THREE.MathUtils.lerp(flat[i], sphere[i], eased);
        positions.needsUpdate = true; geometry.userData.formed = progress === 1;
      }
      earth.scale.setScalar(0.85 + eased * 0.15);
      dust.material.opacity = 0.5 - eased * 0.35;
      const heroRect = mount.closest('.hero').getBoundingClientRect();
      const scroll = Math.max(0, Math.min(1, -heroRect.top / heroRect.height));
      if (!reduced.matches) {
        const factor = 1 - Math.exp(-dt * 4);
        globe.rotation.y += (targetY + pointer.x * 0.12 + Math.sin(elapsed * 0.18)*0.055 + scroll*0.3 - globe.rotation.y)*factor;
        globe.rotation.x += (targetX + pointer.y * 0.055 - globe.rotation.x)*factor;
        const velocity = window.__motionState?.velocity || 0;
        camera.position.z += (8.6 - scroll * 1.8 - camera.position.z) * factor;
        globe.rotation.z += (velocity * .025 - globe.rotation.z) * factor;
        dust.rotation.y = elapsed * .015 + scroll * .4;
        dust.scale.setScalar(1 + scroll * .45);
        dust.material.opacity = .15 + scroll * .25;
        for (const line of outline.children) line.material.opacity = Math.min(1, line.material.opacity + dt * 1.5);
      } else {
        globe.rotation.set(targetX, targetY, 0); camera.position.z = 8.6; dust.scale.setScalar(1); dust.rotation.y = 0;
        for (const line of outline.children) line.material.opacity = 1;
      }
      renderer.render(scene,camera);
      mount.classList.add('canvas-ready'); if (textureSettled) ready();
      if (!reduced.matches) frame = requestAnimationFrame(draw);
    }
    function schedule() { if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
    const resize = new ResizeObserver(() => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w,h); camera.aspect = w/h; camera.updateProjectionMatrix(); schedule();
    });
    resize.observe(mount);
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) { last = performance.now(); schedule(); } else { cancelAnimationFrame(frame); frame = 0; }
    });
    observer.observe(mount);
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else { last = performance.now(); schedule(); } };
    const move = event => {
      const rect = mount.getBoundingClientRect();
      pointer.x = (event.clientX-rect.left)/rect.width*2-1;
      pointer.y = (event.clientY-rect.top)/rect.height*2-1;
      if (dragged && !reduced.matches) { targetY += (event.clientX-dragX)*0.005; dragX = event.clientX; }
      schedule();
    };
    const down = event => { if (event.pointerType === 'mouse') { dragged = true; dragX = event.clientX; mount.setPointerCapture(event.pointerId); } };
    const up = () => { dragged = false; };
    const leave = () => { pointer = {x:0,y:0}; schedule(); };
    const contextLost = event => { event.preventDefault(); cancelAnimationFrame(frame); frame = 0; visible = false; mount.classList.remove('canvas-ready'); setFailed(true); };
    mount.addEventListener('pointermove',move); mount.addEventListener('pointerdown',down);
    mount.addEventListener('pointerup',up); mount.addEventListener('pointercancel',up); mount.addEventListener('pointerleave',leave);
    renderer.domElement.addEventListener('webglcontextlost',contextLost);
    document.addEventListener('visibilitychange',visibility); reduced.addEventListener('change',schedule);
    schedule();
    return () => {
      disposed = true; sceneRef.current = null; cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      mount.removeEventListener('pointermove',move); mount.removeEventListener('pointerdown',down); mount.removeEventListener('pointerup',up); mount.removeEventListener('pointercancel',up); mount.removeEventListener('pointerleave',leave);
      document.removeEventListener('visibilitychange',visibility); reduced.removeEventListener('change',schedule);
      renderer.domElement.removeEventListener('webglcontextlost',contextLost);
      scene.traverse(object => { object.geometry?.dispose(); if(object.material) { const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose()); } });
      texture.dispose(); renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (failed || !sceneRef.current) return;
    if (!country) {
      const outline = sceneRef.current.outline;
      while (outline.children.length) {
        const line = outline.children[0]; outline.remove(line); line.geometry.dispose(); line.material.dispose();
      }
      setBoundaryStatus(''); sceneRef.current.schedule(); return;
    }
    const controller = new AbortController();
    const state = sceneRef.current;
    setBoundaryStatus('Preparando el contorno…');
    fetch('/geo/countries/' + country + '.json', { signal: controller.signal }).then(r => {
      if (!r.ok) throw new Error(); return r.json();
    }).then(rings => {
      if (controller.signal.aborted) return;
      while (state.outline.children.length) {
        const line = state.outline.children[0]; state.outline.remove(line); line.geometry.dispose(); line.material.dispose();
      }
      let largest = [], largestArea = -1;
      for (const ring of rings) {
        const geometry = new THREE.BufferGeometry().setFromPoints(ring.map(([lon,lat]) => latLonToVector3(lat,lon,radius*1.012)));
        const line = new THREE.LineLoop(geometry, new THREE.LineBasicMaterial({ color: 0x9b6dff, transparent: true, opacity: 0 }));
        state.outline.add(line);
        let area = 0;
        for(let i=0;i<ring.length-1;i++) area += ring[i][0]*ring[i+1][1]-ring[i+1][0]*ring[i][1];
        if(Math.abs(area)>largestArea) { largestArea = Math.abs(area); largest = ring; }
      }
      const center = new THREE.Vector3();
      largest.forEach(([lon,lat]) => center.add(latLonToVector3(lat,lon)));
      if(center.length()) state.orient(center.normalize());
      state.schedule(); setBoundaryStatus('');
    }).catch(() => { if (!controller.signal.aborted) setBoundaryStatus('Contorno no disponible para este país.'); });
    return () => controller.abort();
  }, [country, failed]);
  function changeCountry(event) {
    mountRef.current.parentElement.dispatchEvent(new Event('country:manual'));
    setCountry(event.target.value); setStatus('País elegido manualmente');
  }
  return <div className="globe-component">
    <div ref={mountRef} className="globe-canvas" data-cursor="DRAG" role="img" aria-label={failed ? 'Vista simplificada del globo terrestre' : country ? 'Globo terrestre: contorno de ' + countryName(country) : 'Globo terrestre interactivo'} />
    <div className="country-control"><label htmlFor="visitor-country"><span className="status-dot" />{country ? countryName(country) : 'Tu conexión con el mundo'}</label>
      <select id="visitor-country" value={country} onChange={changeCountry}><option value="">Explorar un país</option>{countries.map(item => <option key={item.code} value={item.code}>{countryName(item.code)}</option>)}</select>
      <small role="status">{failed ? 'Vista simplificada · WebGL no disponible' : boundaryStatus || status}</small>
    </div>
  </div>;
}





