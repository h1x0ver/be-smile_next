import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {translations} from './translations.mjs';
const base=path.resolve('outputs/flash-blogs');
const out=path.resolve('outputs/flash-blogs-v2');
fs.mkdirSync(out,{recursive:true});
const posts=JSON.parse(fs.readFileSync(path.join(base,'posts.json'),'utf8'));
const imageDir='C:/Users/blyadota/.codex/generated_images/01a1b129-de2a-74d1-95b3-87b52d1f4be4';
const images=['exec-dd3058a2-486c-4b9f-8fd1-5dc830337a6c.png','exec-12a57854-c012-4b8c-a3d1-dd5589003d8a.png','exec-3dac4f31-8fed-4896-b40f-c1261306f3a2.png','exec-fe0c2e56-6f26-4676-9d03-ec121e86b7b6.png'];
const alts=[
{ru:'Кабинетное отбеливание зубов с LED-лампой и защитными очками',en:'In-office teeth whitening with an LED lamp and protective glasses',az:'LED lampa və qoruyucu eynəklə klinik diş ağartma'},
{ru:'Лампа для профессионального отбеливания и шкала оттенков зубов',en:'Professional teeth whitening lamp and dental shade guide',az:'Peşəkar diş ağartma lampası və diş rəngi şkalası'},
{ru:'Нанесение средства для снижения чувствительности после отбеливания',en:'Application of a desensitising product after teeth whitening',az:'Diş ağartmadan sonra həssaslığı azaldan vasitənin tətbiqi'},
{ru:'Индивидуальная каппа для поддерживающего отбеливания под контролем врача',en:'Custom tray for dentist-supervised maintenance whitening',az:'Həkim nəzarətində dəstəkləyici ağartma üçün fərdi kapa'}
];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const stats=[];
for(let i=0;i<posts.length;i++){
 const p=posts[i],n=String(i+1).padStart(2,'0');
 p.translations=[p.translations[0],...['en','az'].map(language=>({language,...translations[i][language]}))];
 p.cover_image=`${n}-whitening-v2.webp`;
 await sharp(path.join(imageDir,images[i])).resize({width:1536,withoutEnlargement:true}).webp({quality:88}).toFile(path.join(out,p.cover_image));
 fs.copyFileSync(path.join(imageDir,images[i]),path.join(out,`${n}-whitening-original.png`));
 const times=[];
 for(const t of p.translations){
  const text=t.content.replace(/<[^>]+>/g,' ').trim();
  const words=text.split(/\s+/).length;
  const minutes=Math.ceil(words/180);times.push(minutes);
  if(words<350)throw Error('Incomplete translation '+p.slug+' '+t.language);
  if((t.content.match(/<h2>/g)||[]).length!==(p.translations[0].content.match(/<h2>/g)||[]).length)throw Error('Headings '+i+' '+t.language);
  const links=[...t.content.matchAll(/href="([^"]+)"/g)].map(x=>x[1]);
  if(links.some(x=>!x.startsWith('/'+t.language+'/')))throw Error('Wrong language link');
  if(t.seo_title.length>65||t.seo_description.length>165)throw Error('SEO length '+t.language+' '+i);
  fs.writeFileSync(path.join(out,`${n}-${t.language}-content.html`),t.content,'utf8');
  fs.writeFileSync(path.join(out,`${n}-${t.language}-translation.json`),JSON.stringify(t,null,2),'utf8');
  stats.push({article:i+1,language:t.language,words,minutes,seo_title_length:t.seo_title.length,seo_description_length:t.seo_description.length,headings:(t.content.match(/<h2>/g)||[]).length});
 }
 p.reading_time=Math.max(...times);
 fs.writeFileSync(path.join(out,`${n}-admin-fields.json`),JSON.stringify(p,null,2),'utf8');
}
fs.writeFileSync(path.join(out,'posts.json'),JSON.stringify(posts,null,2),'utf8');
fs.writeFileSync(path.join(out,'cover-alt-texts.json'),JSON.stringify(alts,null,2),'utf8');
fs.writeFileSync(path.join(out,'validation.json'),JSON.stringify(stats,null,2),'utf8');
fs.copyFileSync(path.join(base,'image-prompts-v2.json'),path.join(out,'image-prompts.json'));
const labels={ru:'Русский',en:'English',az:'Azərbaycanca'};
const cards=posts.map((p,i)=>{const n=String(i+1).padStart(2,'0');return `<article id="post${i+1}"><p class="kicker">0${i+1} · FLASH WHITENING</p><img class="cover" src="${p.cover_image}" alt="${alts[i].ru}"><p class="shared">Slug: <code>${p.slug}</code> · Reading Time: ${p.reading_time} мин<br>Status: Draft · Is Active: выключено · Published At / Sort: не заданы<br>Is Featured / Is Secondary Featured: выключено<br>Cover Image: ${p.cover_image}<br>Blog Posts ID: выберите созданную родительскую запись при добавлении перевода</p><p><a href="${p.cover_image}" download>Обложка WebP</a> · <a href="${n}-admin-fields.json" download>Все поля + три перевода JSON</a></p>${p.translations.map(t=>`<section lang="${t.language}" data-lang="${t.language}"${t.language==='ru'?'':' hidden'}><h1>${t.title}</h1><details><summary>Поля перевода · ${labels[t.language]}</summary><dl>${Object.entries({Language:t.language,Title:t.title,Excerpt:t.excerpt,'SEO Title':t.seo_title,'SEO Description':t.seo_description,'Alt (метаданные файла)':alts[i][t.language]}).map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></details><p><a href="${n}-${t.language}-content.html" download>Content HTML · ${t.language.toUpperCase()}</a> · <a href="${n}-${t.language}-translation.json" download>Translation JSON</a></p><hr>${t.content}</section>`).join('')}</article>`}).join('');
const sourceHtml=fs.readFileSync(path.join(base,'index.html'),'utf8');
const sources=sourceHtml.match(/<footer>[\s\S]*?<\/footer>/)?.[0]||'';
const html=`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BeSmile — Flash: RU / EN / AZ</title><style>body{background:#eee9df;color:#282723;font:17px/1.75 system-ui;margin:0}main{max-width:980px;margin:auto;padding:35px 22px}article,header,footer{background:#fffcf6;border-radius:24px;padding:36px;margin-bottom:28px}h1{font-size:32px;line-height:1.3;font-weight:500}h2{font-size:24px;line-height:1.4;margin-top:32px}a{color:#27616b}.cover{width:100%;border-radius:16px;display:block}.kicker{letter-spacing:2px;font-size:12px;color:#786e60}.shared{font-size:14px;color:#655d51;overflow-wrap:anywhere}dt{font-weight:600;margin-top:14px}dd{margin:3px 0;overflow-wrap:anywhere}hr{border:0;border-top:1px solid #ddd3c4;margin:32px 0}nav{position:sticky;top:0;z-index:2;background:#eee9dff5;backdrop-filter:blur(12px);padding:12px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}button{border:1px solid #b8b0a3;background:#fffaf0;padding:10px 22px;border-radius:30px;cursor:pointer;font:inherit}button[aria-pressed=true]{background:#285e65;color:white;border-color:#285e65}[hidden]{display:none!important}summary{cursor:pointer;color:#27616b}code{font-size:12px}@media(max-width:600px){article,header,footer{padding:21px}h1{font-size:26px}main{padding:20px 12px}}</style></head><body><main><nav aria-label="Язык статей"><strong>Язык:</strong>${['ru','en','az'].map(l=>`<button data-select="${l}" aria-pressed="${l==='ru'}">${l.toUpperCase()}</button>`).join('')}</nav><header><p class="kicker">BESMILE · ОБНОВЛЁННЫЙ ПАКЕТ V2</p><h1>4 статьи × 3 языка: RU / EN / AZ</h1><p>Новые обложки посвящены именно отбеливанию: кабинетная процедура, световая система и оценка оттенка, помощь при чувствительности, поддерживающие каппы. Фотографии созданы ИИ как редакционные иллюстрации; они не показывают реальных пациентов, конкретную модель Flash или оборудование BeSmile.</p><p>Выберите язык сверху. Для каждой статьи доступны полный текст, анонс и SEO-поля. Все три перевода относятся к одной родительской записи Blog Post и используют общий slug и обложку. HTML вставляется в режим исходного кода поля Content. После загрузки фото локальное имя Cover Image заменяется ID медиа.</p><p>Дата, порядок и выделение выбираются при размещении. В CMS ничего не загружено. Перед публикацией проверьте Status и Is Active: пакет подготовлен с Draft и Is Active=false. Взаимные ссылки заработают после публикации всего цикла.</p><p><a href="../besmile-flash-blogs-v2.zip" download>Скачать весь обновлённый комплект ZIP</a></p><ol>${posts.map((p,i)=>`<li><a href="#post${i+1}">${p.translations[0].title}</a></li>`).join('')}</ol></header>${cards}${sources}</main><script>function selectLanguage(lang){document.querySelectorAll('[data-lang]').forEach(s=>s.hidden=s.dataset.lang!==lang);document.querySelectorAll('[data-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.select===lang)));document.documentElement.lang=lang;localStorage.setItem('besmile-blog-language',lang)}document.querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',()=>selectLanguage(b.dataset.select)));const saved=localStorage.getItem('besmile-blog-language');if(['ru','en','az'].includes(saved))selectLanguage(saved);</script></body></html>`;
fs.writeFileSync(path.join(out,'index.html'),html,'utf8');
fs.copyFileSync(path.join(base,'index.html'),path.join(base,'index-v1.html'));
fs.writeFileSync(path.join(base,'index.html'),'<!doctype html><html lang="ru"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=../flash-blogs-v2/index.html"><title>BeSmile — обновлённые статьи</title><a href="../flash-blogs-v2/index.html">Открыть обновлённый пакет RU / EN / AZ с новыми обложками</a></html>','utf8');
fs.writeFileSync(path.join(out,'README.md'),`# BeSmile — Flash, версия 2\n\n4 статьи, каждая полностью на ru, en, az. Откройте index.html и выберите язык.\n\n## Для админки\n\n- posts.json: 4 родительские записи с 3 переводами в каждой. Это подготовленные данные, а не проверенный автоматический импорт Directus.\n- 01–04-admin-fields.json: общие поля и три перевода каждой статьи.\n- 01–04-ru/en/az-content.html: поле Content в HTML без H1.\n- 01–04-ru/en/az-translation.json: Title, Excerpt, Content, SEO Title, SEO Description и язык.\n- 01–04-whitening-v2.webp: новые обложки для загрузки, общие для трёх языков.\n- 01–04-whitening-original.png: полноразмерные исходники.\n- cover-alt-texts.json: alt на трёх языках, если CMS поддерживает метаданные.\n- image-prompts.json: финальные промпты, использован встроенный image_gen.\n\nСначала создайте Blog Post и загрузите обложку; затем добавьте три перевода. В Blog Posts ID выбирайте созданную родительскую запись. Локальное имя cover_image замените ID загруженного файла. Дату, порядок и выделение задайте при размещении. Reading Time общий для статьи: использовано максимальное округлённое время трёх версий из расчёта 180 слов/мин.\n\nStatus=draft, is_active=false. Перед публикацией проверьте оба поля. В CMS ничего не загружено. Взаимные ссылки ведут на соответствующий язык и заработают после публикации цикла.\n\nОбложки — ИИ-иллюстрации об отбеливании, а не снимки пациентов BeSmile, не демонстрация точной модели Flash и не доказательство клинического результата.\n\nИсточники для медицинской проверки указаны в конце index.html.\n`,'utf8');
console.log(JSON.stringify(stats,null,2));
