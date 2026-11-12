import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    document.querySelector('[data-app-fallback]')?.remove();
    delete document.documentElement.dataset['appStartup'];
  })
  .catch(error => {
    document.documentElement.dataset['appStartup'] = 'failed';
    console.error(error);
  });
