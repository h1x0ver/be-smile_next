import fs from 'node:fs';
const sitemap=fs.readFileSync('outputs/seo/local-sitemap.xml','utf8');
for (const name of ['local-ru','local-service']) {const h=fs.readFileSync(`outputs/seo/${name}.html`,'utf8'); console.log(name,JSON.stringify({title:h.match(/<title>(.*?)<\/title>/s)?.[1],canonical:h.match(/<link rel="canonical" href="([^"]+)"/)?.[1],h1:(h.match(/<h1[ >]/g)||[]).length}));}
console.log(JSON.stringify({urls:(sitemap.match(/<loc>/g)||[]).length,invalidCaseRoutes:(sitemap.match(/<loc>[^<]*\/before-after\//g)||[]).length,fakeLastmod:sitemap.includes('<lastmod>')}));
