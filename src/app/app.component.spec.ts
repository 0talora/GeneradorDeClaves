import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const storageKey = 'password-generator-language';
  let savedLanguage: string | null;

  beforeEach(async () => {
    savedLanguage = localStorage.getItem(storageKey);
    localStorage.removeItem(storageKey);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  afterEach(() => {
    if (savedLanguage === null) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, savedLanguage);
  });

  it('includes exactly the selected character types at the supported lengths', () => {
    const app = TestBed.createComponent(AppComponent).componentInstance;

    for (let mask = 1; mask < 16; mask++) {
      app.mayus = Boolean(mask & 1);
      app.min = Boolean(mask & 2);
      app.nums = Boolean(mask & 4);
      app.simbolos = Boolean(mask & 8);

      for (const length of [4, 16, 100]) {
        app.longitud = length;

        for (let attempt = 0; attempt < 12; attempt++) {
          app.generarClave();
          const password = app.claveGenerada;
          expect(password.length).toBe(length);
          expect(/[A-Z]/.test(password)).toBe(app.mayus);
          expect(/[a-z]/.test(password)).toBe(app.min);
          expect(/[0-9]/.test(password)).toBe(app.nums);
          expect(/[^A-Za-z0-9]/.test(password)).toBe(app.simbolos);
        }
      }
    }
  });

  it('uses updated checkbox and slider values and clears the result with no options', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const view: HTMLElement = fixture.nativeElement;
    const slider = view.querySelector<HTMLInputElement>('input[type="range"]')!;
    slider.value = '4';
    slider.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.claveGenerada.length).toBe(4);

    const checkboxes = view.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes[0].click();
    expect(fixture.componentInstance.claveGenerada).not.toMatch(/[A-Z]/);
    [1, 2, 3].forEach(index => checkboxes[index].click());
    fixture.detectChanges();

    expect(view.querySelector('code')?.textContent).toBe('');
    expect(Array.from(view.querySelectorAll('button')).every(button => button.disabled)).toBeTrue();
  });

  it('detects a supported browser locale and persists a manual language change', async () => {
    spyOnProperty(navigator, 'languages', 'get').and.returnValue(['it-IT', 'fr-CA']);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const view: HTMLElement = fixture.nativeElement;

    expect(view.querySelector('h1')?.textContent).toBe('Générateur de mots de passe');
    expect(document.documentElement.lang).toBe('fr');

    const select = view.querySelector<HTMLSelectElement>('select')!;
    select.value = 'de';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(view.querySelector('h1')?.textContent).toBe('Passwortgenerator');
    expect(document.documentElement.lang).toBe('de');
    expect(document.title).toContain('Online-Passwortgenerator');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('Erstelle');
    expect(TestBed.createComponent(AppComponent).componentInstance.language).toBe('de');
  });

  it('fits a 100-character password without horizontal scrolling at 320 px', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.longitud = 100;
    fixture.detectChanges();

    const frame = document.createElement('iframe');
    frame.width = '320';
    frame.height = '900';
    document.body.append(frame);

    try {
      const page = frame.contentDocument!;
      for (const style of document.querySelectorAll('style')) {
        page.head.append(style.cloneNode(true));
      }

      for (const language of fixture.componentInstance.languageCodes) {
        fixture.componentInstance.changeLanguage(language);
        fixture.detectChanges();
        page.body.replaceChildren(fixture.nativeElement.cloneNode(true));
        expect(page.querySelector('code')?.textContent?.length).toBe(100);
        expect(page.documentElement.clientWidth).toBeLessThanOrEqual(320);
        expect(page.documentElement.scrollWidth).toBe(page.documentElement.clientWidth);
      }
    } finally {
      frame.remove();
    }
  });
});
