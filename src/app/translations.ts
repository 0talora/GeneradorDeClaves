import searchContent from './search-content.json';

export const languages = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  de: 'Deutsch'
};

export type Language = keyof typeof languages;

export const translations = {
  es: {
    ...searchContent.es,
    language: 'Idioma',
    settings: 'Opciones de la contraseña',
    uppercase: 'Mayúsculas',
    lowercase: 'Minúsculas',
    digits: 'Números',
    symbols: 'Símbolos',
    length: 'Longitud de la contraseña',
    result: 'Contraseña generada',
    strength: 'Fortaleza estimada',
    strengths: ['Débil', 'Media', 'Fuerte', 'Muy fuerte'],
    copy: 'Copiar',
    generate: 'Generar contraseña',
    copied: 'Contraseña copiada.',
    copyFailed: 'No se pudo copiar. Selecciona la contraseña y cópiala manualmente.',
    noGroups: 'Selecciona al menos un tipo de carácter.',
    developed: 'Desarrollado con',
    by: 'por Pablo Otalora'
  },
  en: {
    ...searchContent.en,
    language: 'Language',
    settings: 'Password options',
    uppercase: 'Uppercase letters',
    lowercase: 'Lowercase letters',
    digits: 'Numbers',
    symbols: 'Symbols',
    length: 'Password length',
    result: 'Generated password',
    strength: 'Estimated strength',
    strengths: ['Weak', 'Medium', 'Strong', 'Very strong'],
    copy: 'Copy',
    generate: 'Generate password',
    copied: 'Password copied.',
    copyFailed: 'Could not copy. Select the password and copy it manually.',
    noGroups: 'Select at least one character type.',
    developed: 'Built with',
    by: 'by Pablo Otalora'
  },
  fr: {
    ...searchContent.fr,
    language: 'Langue',
    settings: 'Options du mot de passe',
    uppercase: 'Majuscules',
    lowercase: 'Minuscules',
    digits: 'Chiffres',
    symbols: 'Symboles',
    length: 'Longueur du mot de passe',
    result: 'Mot de passe généré',
    strength: 'Robustesse estimée',
    strengths: ['Faible', 'Moyenne', 'Forte', 'Très forte'],
    copy: 'Copier',
    generate: 'Générer un mot de passe',
    copied: 'Mot de passe copié.',
    copyFailed: 'La copie a échoué. Sélectionnez le mot de passe et copiez-le manuellement.',
    noGroups: 'Sélectionnez au moins un type de caractère.',
    developed: 'Développé avec',
    by: 'par Pablo Otalora'
  },
  de: {
    ...searchContent.de,
    language: 'Sprache',
    settings: 'Passwortoptionen',
    uppercase: 'Großbuchstaben',
    lowercase: 'Kleinbuchstaben',
    digits: 'Zahlen',
    symbols: 'Sonderzeichen',
    length: 'Passwortlänge',
    result: 'Generiertes Passwort',
    strength: 'Geschätzte Stärke',
    strengths: ['Schwach', 'Mittel', 'Stark', 'Sehr stark'],
    copy: 'Kopieren',
    generate: 'Passwort generieren',
    copied: 'Passwort kopiert.',
    copyFailed: 'Kopieren fehlgeschlagen. Wähle das Passwort aus und kopiere es manuell.',
    noGroups: 'Wähle mindestens einen Zeichentyp aus.',
    developed: 'Entwickelt mit',
    by: 'von Pablo Otalora'
  }
};
