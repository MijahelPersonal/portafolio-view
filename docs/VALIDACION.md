# Validación final
- npm run build: correcto, una ruta estática /.
- node scripts/verify-build.mjs: 235 contornos válidos, códigos sin duplicados, coordenadas dentro de rango, anclas existentes, sin contactos de ejemplo ni ruta temporal de QA.
- Navegador desktop: globo con textura, detección por IP, cambio manual Perú/Japón y contornos alineados visualmente. Un canvas, sin desbordamiento horizontal ni imágenes rotas en la comprobación DOM.
- Consola de la página normal: sin errores ni warnings capturados, incluyendo prueba de formulario e hidratación React.
- Vista móvil en iframe de 390px (el ajuste directo de viewport del navegador no se aplicó): hero y proyectos legibles; menú abre, navega y se cierra.
- Marco tablet de 768px: navegación desktop presente y contenido accesible. No prueba en hardware físico.
- Simulación sin contextos WebGL: fallback CSS visible, aviso de vista simplificada y contenido HTML accesible. La prueba también simuló matchMedia de movimiento reducido para comprobar la lógica JS.
- Formulario: campos de prueba, botón copiar y estado de éxito verificados; no se transmitió un mensaje.
- STRUCH: demo abierta y verificada en navegador; capturas originales del README. Logopedia: solo GitHub porque no se verificó demo pública.
- QA temporal eliminada antes de la compilación final.

Limitaciones: advertencia del bundle Three.js (>500 kB minificado); no se realizó Lighthouse ni prueba en dispositivos físicos. El servidor ya estaba ejecutándose al solicitar astro dev --background; el comando de logs indica que ese proceso preexistente no se inició en background. No se detuvo el servidor del usuario. Captura final en docs/screenshots/hero.jpg.

## Actualización: demo y GIF de Logopedia
La demo https://web-logopeda.vercel.app fue proporcionada por el autor y abierta correctamente. Se capturaron Inicio, Metodología y Blog para generar un GIF real de 9 frames, 640x360, 677.528 bytes. En navegador se verificó la imagen cargada con src=/projects/logopedia-preview.gif y el botón Ver proyecto con href correcto. Se conserva captura de la tarjeta en docs/screenshots/logopedia-card.jpg.
