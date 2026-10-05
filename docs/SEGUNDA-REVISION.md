# Segunda revisión: movimiento y medios

Se conserva Astro/React/Three, el planeta, geolocalización aproximada por país, estructura y datos verificados. Identidad negro/gris/blanco y acento morado; textura terrestre desaturada por shader. Referencia observada: Lusion, sus máscaras, reel creciente y paso entre tipografía y profundidad. No se copia código.

## Arquitectura
- src/animations/timelines.ts: heroTimeline, introTimeline (salida del hero), technologyTimeline, videoTimeline y projectsTimeline. GSAP/ScrollTrigger, scroll nativo. Los rangos, easing y posiciones se editan allí.
- src/animations/cursor.ts: cursor interpolado, deformación por velocidad, magnetismo y tilt/parallax de medios. Solo puntero fino y movimiento permitido.
- src/animations/media.ts: reproducción silenciosa de previews con hover/foco o viewport en táctil; pausa fuera de vista y pestaña oculta. Presentación con controles manuales, preserva audio; sin scrubbing costoso de currentTime.
- HeroCanvas y NarrativeCanvas: dos renderizadores separados y pausados con IntersectionObserver/visibility; segunda isla hidratada al aproximarse. No son fondos que rendericen continuamente toda la página. Pixel ratio y partículas reducidos en equipos modestos/móvil. Recursos liberados al desmontar. Fallback CSS sin WebGL.
- El loader espera textura + primer render, con salida mediante máscara y entrada del hero. Recuperación ante carga bloqueada; no porcentajes ficticios ni espera mínima.
- Presentación con sticky CSS y máscara/rotación/desplazamiento por scroll. Cámara y anillos ópticos siguen el mismo progreso. Reduced motion: sección estática y textos visibles.

## Tus vídeos
1. Copia tu presentación a public/videos/presentacion.mp4.
2. En src/data/introduction.ts cambia src: null por src: '/videos/presentacion.mp4'. Poster es opcional. Sustituye phrases y temporary cuando tengas texto definitivo.
3. Copia public/videos/logopedia.mp4 y public/videos/struch.mp4.
4. En src/data/projects.ts cambia previewType de 'image' a 'video' en cada proyecto. Las rutas ya están preparadas; las capturas quedan como posters.

Ahora no se solicita ningún MP4 inexistente. Las dos imágenes son capturas nuevas de https://web-logopeda.vercel.app y https://struch.vercel.app. GIF anterior archivado en docs/archive y no publicado.

## Validación
npm run check: Astro/TS sin errores ni avisos. npm run build y node scripts/verify-build.mjs: contornos/anclas válidos. npm audit: cero vulnerabilidades tras actualizar dos transitivas. Navegador: desktop, móvil390 y tablet820, consola, máscara creciente, país, medios y fallback/reduced motion. Three comparte un chunk de motor relativamente grande; carga por islas, sin motores adicionales importados ni postprocesado pesado. No se afirma una tasa FPS universal; depende del dispositivo.
