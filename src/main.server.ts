import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;

// TODO :
// ·        Implementare nel server la funzionalità hydration utilizzando provideClientHydration del '@angular/platform-server'

// ·        Aggiungere proxy middleware (CreateProxyMiddleware) del 'http-proxy-middleware' per mapping del url relativo al url reale.
// Utilizzare ngExpressEngine del '@angular/ssr'
// chiamate API tutte POST
//
