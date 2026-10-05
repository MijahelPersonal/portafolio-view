# Fix: loader desplazado en producción

Reproducción antes del cambio en npm run preview:
- Viewport 1280 px, bloque 440 px.
- Bounding rect: left 200, right 640; centro 420 frente al centro de viewport 640.
- Computed style: position relative, transform none, translate -50%.
- En el CSS compilado sobrevivía la regla antigua translate:-50%, mientras los resets translate:none de global.css/responsive.css no aparecían. El bloque ya se centraba con grid, por lo que esa traslación adicional lo desplazaba 220 px.
- No hay una animación de GSAP dirigida al bloque del loader. El único transform escrito por su JavaScript es scaleX en la barra.

Solución:
- Un único archivo de estilos: src/components/ui/loader.css, importado por Loader.jsx.
- .welcome: fullscreen y centrado con grid.
- .loader-position: ancho responsive y posición, sin left:50%, translate ni transform.
- .loader-animation: recibe únicamente la salida vertical y opacity.
- Se retiraron reglas duplicadas del loader de global.css y responsive.css.
- La duración, porcentaje, estrellas Three.js y máscara de transición permanecen intactos.
- No se realizaron commits, push ni deploy.

Las mediciones automatizadas del navegador registran el loader durante su ciclo completo, incluidos porcentaje 100%, canvas listo, transición y Hero en scroll 0. Se usa el viewport de iframes Chromium para validar responsive.

Resultados medidos (error horizontal/vertical durante el progreso):
| Modo | Viewport | Error X/Y | Barra final | Estrellas | Transición/Hero |
| --- | --- | --- | --- | --- | --- |
| Dev | 1280×720 | 0/0 px | 100% | Sí | Sí, scroll 0 |
| Dev | 390×844 | 0/0 px | 100% | Sí | Sí, scroll 0 |
| Preview | 1280×720 | 0/0 px | 100% | Sí | Sí, scroll 0 |
| Preview | 390×844 | 0/0 px | 100% | Sí | Sí, scroll 0 |
| Preview | 820×1180 | 0/0 px | 100% | Sí | Sí, scroll 0 |
| Preview | 320×640 | 0/0 px | 100% | Sí | Sí, scroll 0 |

Los ciclos duraron aproximadamente 3 segundos de progreso + 0.85 segundos de salida, sin overflow horizontal. Durante las pruebas se reinició el servidor dev después de generar builds, para renovar los módulos de Vite; la carga nueva funciona correctamente.
| Dev | 820×1180 | 0/0 px | 100% | Sí | Sí, scroll 0 |
| Preview | 1366×768 | 0/0 px | 100% | Sí | Sí, scroll 0 |

Verificación final: Astro check sin errores/warnings/hints; npm run build correcto; npm run preview confirmado con el build final; 235 contornos/anclas válidos y sin fixture QA en dist.
Capturas de dev y preview: docs/screenshots/loader-fix-dev.jpg y loader-fix-preview.jpg.
Permanece la advertencia previa de tamaño del chunk Three.js, ajena a este fix.
