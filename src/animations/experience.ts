import { setupNavigation } from './navigation';
import { setupTimelines } from './timelines';
import { setupCursor } from './cursor';
import { setupMedia } from './media';
const cleanup = [setupNavigation(), setupTimelines(), setupCursor(), setupMedia()];
window.addEventListener('pagehide', () => cleanup.forEach(fn => fn()), { once: true });
document.querySelector<HTMLFormElement>('#contact-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget as HTMLFormElement);
  const status = document.querySelector<HTMLElement>('#form-status')!;
  try { await navigator.clipboard.writeText(`Nombre: ${data.get('name')}\nCorreo: ${data.get('email')}\n\n${data.get('message')}`); status.textContent = 'Mensaje copiado. Puedes pegarlo en tu canal de contacto.'; }
  catch { status.textContent = 'No se pudo acceder al portapapeles. Selecciona y copia el texto de tu mensaje.'; }
});

