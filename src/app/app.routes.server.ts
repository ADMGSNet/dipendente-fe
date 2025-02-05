// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: any[] = [
  {
    path: '', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'descrizione-servizio', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Client,
  },
  {
    path: 'dashboard', // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
  },
  {
    path: 'dettaglio-domanda/**', // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },
  {
    path: 'invia-domanda', // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },{
    path:'**',
    renderMode: RenderMode.Client
  }
];
