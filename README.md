# MijahelDev
Portafolio personal en Astro 7, React 19, Tailwind CSS 4 y Three.js. Sin dependencias nuevas.

## Desarrollo
- `npm run dev -- --background`
- `npm run astro -- dev status`
- `npm run astro -- dev logs`
- `npm run astro -- dev stop`
- `npm run build`

## Arquitectura
- `src/pages/index.astro`: contenido HTML y composición.
- `src/data/projects.ts`: dos proyectos reales y dos futuros, enlaces y medios.
- `src/data/technologies.ts`: categorías del stack proporcionado por el autor.
- `src/components/sections/ProjectCard.astro`: tarjetas, capturas y vídeo opcional.
- `src/components/three/HeroCanvas.jsx`: único canvas, partículas, globo y contornos.
- `src/utils/country.js`: detección aproximada por país.
- `src/animations/experience.ts`: revelados, scroll, cursor y previews.
- `src/styles/global.css`: diseño responsive y movimiento reducido.

## País del visitante
Una consulta HTTPS a ipwho.is devuelve únicamente success y country_code. El proveedor recibe la IP del visitante como parte de la conexión; no se solicita GPS ni se guarda la IP en esta aplicación. El tiempo máximo es 4 segundos. Si falla o supera el límite del proveedor, se ofrece selección manual y no se inventa una ubicación. Los límites geográficos simplificados se sirven localmente y se cargan solo para el país seleccionado. La detección por IP puede variar por VPN o red.

El endpoint gratuito actualmente admite 1.000 consultas diarias, compartidas por dominio para CORS. Consultar https://ipwhois.io/documentation antes de un despliegue de mayor tráfico. No poner claves privadas en el cliente.

Los contornos abarcan 235 códigos ISO del dataset; representan aproximaciones visuales. Para regenerarlos: `node scripts/prepare-countries.mjs`. Fuentes y licencias en `public/geo/ATTRIBUTION.txt` y `public/textures/ATTRIBUTION.txt`.

## Proyectos y medios
STRUCH usa las dos capturas reales de su README, con transición al hover/foco y en pantallas táctiles mientras está visible. La demo verificada es https://struch.vercel.app.
Logopedia enlaza a https://web-logopeda.vercel.app y usa un GIF de capturas reales de Inicio, Metodología y Blog. El archivo se carga al hover/foco o mientras está visible en móvil; vuelve al poster al salir de pantalla o con movimiento reducido. Las capturas fuente están en docs/screenshots/logopedia y scripts/prepare-logopedia-preview.py permite regenerarlo con Pillow, sin dependencias nuevas en el proyecto.
Para incorporar una grabación real, añadir `video: '/projects/nombre.webm'` y `image` como poster en projects.ts. El componente admite vídeo sin audio, reproducción por hover/foco y viewport en móvil, y pausa fuera de pantalla. No genera interfaces ficticias.

## Contacto
GitHub apunta a https://github.com/MijahelPersonal. El formulario prepara y copia un mensaje, sin simular envíos. Cuando se facilite un correo real puede conectarse a un servicio de envío o mailto.

## Rendimiento y accesibilidad
Un canvas con DPR limitado, menos partículas en móvil/dispositivos de pocos núcleos, pausa con IntersectionObserver y pestaña oculta, texturas locales WebP y recursos liberados al desmontar. Contenido legible sin JavaScript; fallback CSS si no hay WebGL. Scroll natural, controles por teclado, menú con Escape y aria-expanded, soporte prefers-reduced-motion y cursor adicional solo para puntero fino.
Spline, Fiber, Drei y simplex-noise permanecen instalados para no alterar el entorno, pero no se importan en la página actual.



Versión actual: consulta docs/SEGUNDA-REVISION.md. Esta revisión sustituye la paleta lima y los GIF/slideshows anteriores por identidad negra/gris/morada y capturas estáticas, con vídeos configurables y timelines de GSAP.

