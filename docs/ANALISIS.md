# Análisis y decisiones
Se revisaron todos los archivos fuente iniciales: index.astro, global.css, HeroCanvas.jsx, Loader.jsx, Navbar.astro y CursorGlow.astro; configuración Astro/TypeScript, package.json, lockfile, README, AGENTS/CLAUDE, .vscode y recursos públicos.
La carpeta no contiene un repositorio Git: no hubo commits ni cambios sobre una rama.

La base usa Astro 7, React 19, Tailwind 4, Three.js y tiene Fiber/Drei, Spline y simplex-noise instalados. El globo inicial era Three.js directo con textura externa y partículas que se transformaban de una malla plana a esfera. Su marcador estaba fijo en Lima; no pausaba fuera del viewport y calculaba la etiqueta con dimensiones iniciales tras resize.
El loader tenía otro canvas, estrellas y transmisión 3D, dependencias de fuentes/HDR externas y un temporizador falso de 5 segundos. La página tenía barras porcentuales, cuatro proyectos ficticios, contactos de ejemplo y un formulario sin backend. Había brillo de cursor duplicado y scroll manual que no respetaba movimiento reducido.

Se mantienen secciones, navegación, formulario preparador, globo interactivo, entrada de partículas y bienvenida; se refactorizaron por sus responsabilidades. La bienvenida espera el primer frame, con límite no bloqueante de 1,5 segundos y sin segundo canvas. Datos de proyectos y tecnologías separados; solo dos proyectos indicados por el usuario, más dos futuros sin enlaces.

Lusion se examinó en navegador: geometría WebGL enmarcada junto con texto HTML, cambio de escala al scroll, tipografía por líneas, tarjetas visuales y navegación simple. Se toma como inspiración el ritmo y la profundidad; no se replica el diseño ni se asumen detalles internos de su código. Referencia: https://lusion.co/
Se consultaron las guías oficiales Astro sobre componentes, frameworks, estilos y routing.

Fuentes reales:
- https://github.com/MijahelPersonal/Pagina-web-Logo-Jenni-Moscol : README genérico Vite; package.json y src/pages/Inicio.jsx confirman React, React Router, Formspree, servicios de logopedia, metodología y blog. Sin homepage ni deployments públicos.
- https://github.com/MijahelPersonal/struch-sistema-gestion : README describe ecommerce y gestión Windows, stack, demo y capturas.
Se conservan los documentos recuperados y las imágenes originales en docs/research; no se sirven desde public.

Limitación conocida: el módulo Three.js del globo es superior a 500 kB minificado y Astro emite advertencia de tamaño. Se hidrata al entrar en pantalla y no se cargan las librerías 3D adicionales. No se instalaron dependencias.


## Actualización de Logopedia
El autor proporcionó https://web-logopeda.vercel.app. Se verificó en navegador y se añadió como demo. Se sustituyó la imagen de recurso por capturas reales de Inicio, Metodología y Blog. GIF con 9 frames, 640x360, aproximadamente 662 KiB, y poster WebP. Hover/foco activa la animación, selección de movimiento reducido y salida del viewport restauran el poster. Las capturas originales y el script de generación se conservan para mantenimiento.
