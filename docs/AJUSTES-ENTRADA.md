# Ajustes de entrada, cabecera y presentación

El loader original se recuperó del historial de la lectura inicial de src/components/ui/Loader.jsx. Copia fiel en docs/archive/Loader-original.jsx.txt. Tenía GalaxyBackground (estrellas), PremiumM (Text3D de cristal), Welcome To MijahelDev, porcentaje y barra. El actual conserva esa estética, sin el punto, el logo plano ni los textos de la segunda revisión. Se reimplementa con Three.js directo para reutilizar el motor actual y evitar importar Fiber/Drei adicionales. Fuente original almacenada en public/fonts; reflejos locales en lugar de HDR externo.

Loader.jsx: un reloj de RAF controla 3 segundos de progresión visual, espera escena/textura del hero con recuperación a 4,5 segundos, luego 0,85 segundos de salida. La progresión visual está autorizada y no se presenta como porcentaje de bytes descargados. Se pausan los relojes en pestaña oculta, se cancelan RAF/listeners al desmontar y se libera el canvas de entrada. Movimiento reducido omite la espera y la escena. La revelación del Hero depende de loader:reveal, no del primer frame ni de un timeout adelantado.

Navbar.astro: identificador existente MijahelDev y MENU. Cabecera transparente en scroll 0, fondo/blur/espacio interpolados hasta 180 px. Dialog nativo con máscara GSAP y opciones grandes. Foco confinado por el dialog, Escape y CERRAR con salida animada, devolución del foco y bloqueo/restauración del scroll. Mismo overlay en móvil.

Hero: conserva saludo, título, descripción, CTA, planeta, control de país y scroll cue. Se retiran etiquetas laterales y de arriba.

videoTimeline: entrada reducida → sticky → expansión/máscara → inset(0), radio 0, padding y márgenes 0 → frases temporales → salida hacia proyectos. La cabecera desaparece en la fase inmersiva. Sin etiquetas laterales ni líneas decorativas. El canvas provisional solo existe mientras no haya vídeo: al configurar introduction.src se sustituye por el vídeo real, object-fit cover. No se ha creado ni inventado vídeo.

Validación navegador: cabecera transparente, overlay de 1280x720 y 390x780, Escape, navegación móvil a Proyectos, sin overflow horizontal. Loader observado 0–100%, fuente/escena listas y canvas liberado al finalizar; aproximadamente 3 segundos más salida/hidratación. Fullscreen medido x=0, y=0, ancho del viewport disponible, alto720, clip inset(0), radio0, padding0 y navbar oculto. Astro/TS, build y contornos/anclas verificados. El aviso de tamaño del motor Three sigue siendo una advertencia de bundle, no un error de ejecución.
