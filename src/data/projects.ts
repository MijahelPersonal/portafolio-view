export interface Project {
  id: string; title: string; description: string; tags: string[];
  previewType: 'image' | 'video';
  github?: string; demo?: string; image?: string; imageAlt?: string;
  mediaCaption?: string; video?: string; upcoming?: boolean;
}
// To use your recording: put it in public/videos and change previewType to 'video'.
export const projects: Project[] = [
  { id: 'logopedia', title: 'Logopedia / Jenni Moscol', description: 'Web profesional de terapia del habla y lenguaje, con servicios, metodología, blog y contacto.', tags: ['React', 'Vite', 'React Router', 'CSS', 'Formspree'], previewType: 'image', github: 'https://github.com/MijahelPersonal/Pagina-web-Logo-Jenni-Moscol', demo: 'https://web-logopeda.vercel.app', image: '/projects/logopedia-live.jpg', imageAlt: 'Página de inicio real de Jenny Moscol, Logopeda', mediaCaption: 'Web desplegada / captura real', video: '/videos/logopedia.mp4' },
  { id: 'gestion', title: 'STRUCH / Gestión y Venta', description: 'Tienda de hardware y aplicación Windows que conectan catálogo, pedidos, inventario y ventas en un mismo sistema.', tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Angular', 'Electron', 'Astro'], previewType: 'image', github: 'https://github.com/MijahelPersonal/struch-sistema-gestion', demo: 'https://struch.vercel.app', image: '/projects/struch-live.jpg', imageAlt: 'Página de inicio real de la tienda de hardware STRUCH', mediaCaption: 'Tienda desplegada / captura real', video: '/videos/struch.mp4' },
  { id: 'proyecto-3', title: 'Proyecto 3', description: 'Una nueva idea está tomando forma.', tags: [], previewType: 'image', upcoming: true },
  { id: 'proyecto-4', title: 'Proyecto 4', description: 'El siguiente capítulo, en desarrollo.', tags: [], previewType: 'image', upcoming: true },
];
