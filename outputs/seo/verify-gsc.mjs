import fs from 'node:fs';
for(const name of ['home','prices']) { const h=fs.readFileSync(`outputs/seo/gsc-local-${name}.html`,'utf8'); console.log(JSON.stringify({page:name,title:h.match(/<title>(.*?)<\/title>/s)?.[1],description:h.match(/<meta name="description" content="([^"]+)"/)?.[1],canonical:h.match(/<link rel="canonical" href="([^"]+)"/)?.[1]})); }
