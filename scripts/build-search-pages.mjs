import { mkdir, readFile, writeFile } from 'node:fs/promises';

const origin = 'https://passgenerator.otalora.dev';
const output = new URL('../dist/generador-claves/', import.meta.url);
const index = new URL('index.html', output);
const template = await readFile(index, 'utf8');
const content = JSON.parse(await readFile(new URL('../src/app/search-content.json', import.meta.url), 'utf8'));
const names = { es: 'Español', en: 'English', fr: 'Français', de: 'Deutsch' };
const languages = Object.keys(names);

const escape = value => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const pathFor = language => language === 'es' ? '/' : `/${language}/`;
const urlFor = language => origin + pathFor(language);
const alternates = [...languages, 'x-default'].map(language => ({
  language,
  url: urlFor(language === 'x-default' ? 'es' : language)
}));
const alternateLinks = alternates.map(({ language, url }) =>
  `<link rel="alternate" hreflang="${language}" href="${url}">`
).join('\n  ');

const startup = `<style>
  html[data-app-startup="pending"] [data-app-fallback],
  [data-app-fallback] + app-root:empty,
  html[data-app-startup="failed"] [data-app-fallback] + app-root { display: none; }
</style>
<script>
  document.documentElement.dataset.appStartup = 'pending';
  window.addEventListener('error', function (event) {
    if (event.target instanceof HTMLScriptElement) {
      document.documentElement.dataset.appStartup = 'failed';
    }
  }, true);
  window.setTimeout(function () {
    if (document.documentElement.dataset.appStartup === 'pending') {
      document.documentElement.dataset.appStartup = 'failed';
    }
  }, 10000);
</script>`;

for (const language of languages) {
  const page = content[language];
  const url = urlFor(language);
  const links = languages.map(code =>
    `<a href="${pathFor(code)}" hreflang="${code}" lang="${code}"${code === language ? ' aria-current="page"' : ''}>${names[code]}</a>`
  ).join(' ');
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: 'Generador de Claves Otalora', alternateName: 'Otalora Password Generator', inLanguage: languages },
      { '@type': 'WebPage', url, name: page.pageTitle, description: page.description, inLanguage: language, isPartOf: { '@id': origin + '/#website' } }
    ]
  };
  const head = `<title>${escape(page.pageTitle)}</title>
  <meta name="description" content="${escape(page.description)}">
  <link rel="canonical" href="${url}">
  ${alternateLinks}
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${escape(page.pageTitle)}">
  <meta property="og:description" content="${escape(page.description)}">
  <script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`;
  const steps = page.steps.map(step => `<li>${escape(step)}</li>`).join('\n');
  const questions = page.questions.map(([question, answer]) =>
    `<h3>${escape(question)}</h3><p>${escape(answer)}</p>`
  ).join('\n');
  const body = `<main class="contenido-estatico">
    <h1>${escape(page.title)}</h1>
    <p>${escape(page.description)}</p>
    <noscript><p>${escape(page.noscript)}</p></noscript>
    <section class="guia">
      <h2>${escape(page.guide)}</h2>
      <ol>${steps}</ol>
      ${questions}
    </section>
  </main>
  <footer class="idiomas">${links}</footer>`;
  const html = template
    .replace('<html lang="es"', `<html lang="${language}" data-page-language="${language}"`)
    .replace(/<!-- search:head -->[\s\S]*?<!-- \/search:head -->/, () => head)
    .replace('</head>', () => startup + '\n</head>')
    .replace(/<app-root>[\s\S]*?<\/app-root>/, () => `<div data-app-fallback>${body}</div><app-root></app-root>`);

  const directory = new URL('.' + pathFor(language), output);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
}

const sitemapEntries = languages.map(language => `  <url>
    <loc>${urlFor(language)}</loc>
${alternates.map(alternate => `    <xhtml:link rel="alternate" hreflang="${alternate.language}" href="${alternate.url}" />`).join('\n')}
  </url>`).join('\n');

await writeFile(new URL('sitemap.xml', output), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapEntries}
</urlset>
`);
await writeFile(new URL('robots.txt', output), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
