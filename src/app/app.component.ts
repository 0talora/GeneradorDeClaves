import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Language, languages, translations } from './translations';

const languageKey = 'password-generator-language';

function isLanguage(value: string): value is Language {
  return Object.hasOwn(languages, value);
}

function detectLanguage(): Language {
  try {
    const saved = localStorage.getItem(languageKey);
    if (saved && isLanguage(saved)) return saved;
  } catch {
    // Language detection also works when browser storage is unavailable.
  }

  const preferred = (navigator.languages.length ? navigator.languages : [navigator.language])
    .map(locale => locale.toLowerCase().split('-')[0]);
  return preferred.find(isLanguage) ?? 'es';
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly languages = languages;
  readonly languageCodes = Object.keys(languages) as Language[];
  language = detectLanguage();

  mayus = true;
  min = true;
  simbolos = true;
  nums = true;
  longitud = 16;
  claveGenerada = '';
  nivelSeguridad = 0;
  copyStatus: 'copied' | 'copyFailed' | null = null;

  get copyAvailable(): boolean {
    return this.claveGenerada.length > 0;
  }

  get strings() {
    return translations[this.language];
  }

  ngOnInit(): void {
    this.updateDocumentLanguage();
    this.generarClave();
  }

  changeLanguage(language: Language): void {
    this.language = language;
    this.updateDocumentLanguage();
    try {
      localStorage.setItem(languageKey, language);
    } catch {
      // The chosen language remains active for this page.
    }
  }

  private updateDocumentLanguage(): void {
    this.document.documentElement.lang = this.language;
    this.title.setTitle(this.strings.pageTitle);
    this.meta.updateTag({ name: 'description', content: this.strings.description });
    this.meta.updateTag({ property: 'og:title', content: this.strings.pageTitle });
    this.meta.updateTag({ property: 'og:description', content: this.strings.description });
  }

  generarClave(): void {
    const groups: string[] = [];
    if (this.mayus) groups.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (this.min) groups.push('abcdefghijklmnopqrstuvwxyz');
    if (this.nums) groups.push('0123456789');
    if (this.simbolos) groups.push('!@#$%^&*()');

    this.copyStatus = null;
    if (!groups.length) {
      this.claveGenerada = '';
      return;
    }

    const alphabet = groups.join('');
    const limit = 256 - (256 % alphabet.length);
    const random = new Uint8Array(this.longitud);
    let password: string;

    // Reject biased byte values and candidates missing any selected group.
    do {
      password = '';
      while (password.length < this.longitud) {
        crypto.getRandomValues(random);
        for (const byte of random) {
          if (byte < limit) password += alphabet[byte % alphabet.length];
          if (password.length === this.longitud) break;
        }
      }
    } while (groups.some(group => !Array.from(password).some(char => group.includes(char))));

    this.claveGenerada = password;
    this.nivelSeguridad = this.evaluarSeguridad(password);
  }

  async copiarClave(): Promise<void> {
    if (!this.copyAvailable) return;
    const password = this.claveGenerada;
    this.copyStatus = null;
    let status: 'copied' | 'copyFailed';

    try {
      await navigator.clipboard.writeText(password);
      status = 'copied';
    } catch {
      status = 'copyFailed';
    }

    if (this.claveGenerada === password) this.copyStatus = status;
  }

  evaluarSeguridad(password: string): number {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (/(.)\1{2,}/.test(password)) score--;

    if (score <= 2) return 0;
    if (score <= 4) return 1;
    if (score <= 5) return 2;
    return 3;
  }
}
