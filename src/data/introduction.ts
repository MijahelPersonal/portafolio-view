// Add public/videos/presentacion.mp4, then set src to '/videos/presentacion.mp4'.
// No missing-file request is made while src is null. Replace the temporary phrases here.
export const introduction: { src: string | null; poster: string | null; temporary: boolean; phrases: string[] } = {
  src: null,
  poster: null,
  temporary: true,
  phrases: ['Diseño.', 'Código.', 'Movimiento.', 'Experiencias.'],
};
