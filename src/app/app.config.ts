import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import Nora from '@primeuix/themes/nora';
import Lara from '@primeuix/themes/lara';
import { colorScheme } from '@primeuix/themes/aura/autocomplete';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme:{
        preset: Lara,
        options:{
          colorScheme: 'light',
          darkModeSelector: 'none'
        }
      }
    })
  ]
};
