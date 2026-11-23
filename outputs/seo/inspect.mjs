import fs from 'node:fs';
const out={};
for(const lang of ['ru','az','en']) {
 const html=fs.readFileSync(`outputs/seo/live-${lang}.html`,'utf8');
 out[lang]={title:html.match(/<title>(.*?)<\/title>/s)?.[1],htmlLang:html.match(/<html[^>]*lang="([^"]+)"/)?.[1],h1Count:(html.match(/<h1[ >]/g)||[]).length,canonical:html.match(/<link rel="canonical" href="([^"]+)"/)?.[1],alternates:[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map(m=>[m[1],m[2]]),emptyDoctors:html.includes('Həkim tapılmadı')};
}
const xml=fs.readFileSync('outputs/seo/live-sitemap.xml','utf8');
out.sitemap={urls:(xml.match(/<loc>/g)||[]).length,case404Candidates:(xml.match(/<loc>[^<]*\/before-after\//g)||[]).length,lastmodExamples:[...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].slice(0,2).map(m=>m[1])};
fs.writeFileSync('outputs/seo/live-audit.json',JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
