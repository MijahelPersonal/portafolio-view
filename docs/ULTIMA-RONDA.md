# Última ronda — pulido de interacción

Se mantienen la estructura, el planeta con selector de país, los contenidos, la escena de presentación y las cuatro tarjetas.

- Loader: galaxia de partículas Three.js sin inicial ni modelo central. Barra centrada, porcentaje y recorrido luminoso tenue; 3 segundos activos y la máscara de salida existente. No espera la consulta de país ni solicita la fuente del modelo antiguo. Movimiento reducido omite la entrada.
- Navbar: identificador MijahelDev, cápsula MENU algo mayor, dos puntos animados hasta formar una X y recorrido de luz alineado al perímetro. El mismo botón permite cerrar.
- Panel: popover manual en la capa superior, ancho calculado según el espacio real disponible y límite de altura. Apertura con máscara, escala, blur y stagger. Cierre por botón, Escape, enlace o pulsación fuera; navegación con teclado. Se cierra cuando el navbar desaparece en la presentación.
- Scroll: GSAP anima la posición nativa de ventana durante 0.6–1.2 s según distancia. ScrollTrigger sigue el scroll nativo. Rueda, toque o teclas de desplazamiento cancelan la animación. Hash e historial conservados; foco de destino sin un segundo salto. No se incorpora Lenis.
- Textos: títulos por líneas, máscaras de subtítulos, entrada discreta de párrafos, elementos de tecnologías y tags. Conserva las frases y el timeline de presentación.
- Botones: magnetismo amortiguado, movimiento interno de texto, flecha y brillo tenue; solo con puntero fino y sin movimiento reducido.

Validación visual mediante navegador Chromium del entorno y ventanas incrustadas de 390 y 820 px; no representa pruebas en dispositivos físicos. Capturas en docs/screenshots/ultima-ronda-*.jpg.

Comprobaciones finales:
- Astro check: 22 archivos, 0 errores, 0 warnings, 0 hints.
- QA móvil: 35 posiciones distintas durante la navegación desde 0 hasta Proyectos; llegada a 100 px del borde superior, foco en la sección y menú cerrado.
- Panel móvil: x=16, ancho=336.5 px, borde derecho=352.5 px para área útil de 375 px. Tablet: panel de 350 px dentro de área útil de 805 px. Sin overflow horizontal.
- Loader tablet: aproximadamente 3 s de progreso más 0.85 s de transición; porcentaje final 100, sin solicitud de helvetiker.
- Se evita eliminar triggers durante refresh: entradas con toggleActions play/none/none/none, preservadas hasta la limpieza del contexto. Esto corrige la recarga con scroll restaurado.
- Advertencia de build conocida: chunk compartido de Three.js superior a 500 kB.
- Presentación validada: clip final inset(0%), navbar hidden/opacity 0 en la escena y visible al salir.
- Consola real sin nuevos errores ni warnings después de cargar y recargar en Proyectos con scroll conservado.
- Tab desde el botón enfoca Sobre mí; Escape cierra y devuelve el foco al botón.
- Build final y verificación de 235 contornos/anclas correctos; fixture de QA fuera de public/dist.

## Recarga al Hero
Cada documento nuevo desactiva la restauración de scroll desde un script inline en head, antes del contenido y de las islas. Elimina únicamente el hash inicial con replaceState, conservando ruta, query e historial. Refuerza scroll(0,0) en DOMContentLoaded/load mientras la entrada siga activa.
El loader fija el scroll al montar, durante el progreso y justo antes de revelar el Hero. La máscara y su duración quedan intactas. Al comenzar la transición deja de fijar la posición: los enlaces y GSAP vuelven a controlar normalmente la navegación.
La limpieza de navegación cancela tweens y eventos, pero ya no reactiva scrollRestoration=auto al abandonar el documento.
Prueba de recarga manual desde Contacto: antes scrollY=6424, después scrollY=0, loader presente y URL sin hash.
Prueba de recarga manual desde Proyectos: scroll inicial 4496; tras reload se elimina #portafolio, scroll 0 y loader presente. Tras el loader el Hero queda en top=0; el CTA hacia Proyectos conserva la navegación animada.
El navegador integrado del entorno no ejecutó la recarga al enviar F5 por sus APIs de teclado; no se afirma validación física de ese atajo. La lógica de inicio se ejecuta en cualquier documento nuevo, sin distinguir el origen de la recarga.
Astro check/build/verificación de contornos y anclas correctos después del cambio.
