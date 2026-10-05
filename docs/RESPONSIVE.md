# Ajustes de loader y responsive

El loader mantiene la duración y la transición. Título, barra y porcentaje forman un bloque centrado mediante CSS grid; el porcentaje pasa debajo de la barra. Se conserva el texto actual del usuario: BIENVENIDO AL PORTAFOLIO.

Los ajustes están en src/styles/responsive.css, importado después de global.css:
- Teléfono: Hero en una columna, tipografía proporcional, planeta y selector sin márgenes negativos, controles con área táctil de 44–46 px.
- Pantallas estrechas: grupos de tecnologías en una columna, listas con dos columnas cuando caben.
- Tablet vertical hasta 1024 px: Hero en columna y planeta centrado; tecnologías y proyectos en dos columnas.
- Contacto: formulario en una columna y campos a 16 px en celular/tablet.
- Tarjetas: altura de tags y enlaces flexible para evitar recortes. Descripciones y botones más legibles.
- Presentación: títulos/frases ajustados al ancho; se conserva el timeline fullscreen y el ocultamiento del navbar.
- Escritorio: se mantiene la composición existente, salvo el centrado solicitado del loader.

Las comprobaciones responsive usan iframes con viewport de dimensiones específicas en Chromium, no dispositivos físicos.

Validación:
- Viewports 320×640, 390×844, 768×1024, 820×1180 y 1024×768 sin overflow horizontal.
- Loader medido después de iniciar el porcentaje: desviación horizontal y vertical 0 px en 320, 390, 768 y 1024 px.
- Menú móvil dentro del ancho útil; la captura de Hero móvil muestra título, descripción, CTA, planeta y selector.
- Astro check: 22 archivos, 0 errores, 0 warnings, 0 hints.
- Build y verificación de contornos/anclas correctos. Permanece la advertencia previa por tamaño del chunk de Three.js.
- Página temporal de QA archivada fuera de public/dist.
