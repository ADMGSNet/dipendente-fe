import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SessionService } from './session.service';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { GedService } from './ged-service.service';
import { SimpleAlertService } from './shared/simple-alert/simple-alert.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    SessionService,
    SimpleAlertService,
    GedService,
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
};
