import json,sys,re
sys.stdout.reconfigure(encoding='utf-8')
d=json.load(open('outputs/seo/gsc-data.json',encoding='utf-8'))
q=d['Запросы'][1:]; p=d['Страницы'][1:]
print('TARGETS')
for r in q:
 if any(x in r[0].lower() for x in ['стоматолог','stomatolog','dentist','dental clinic']):
  if float(r[2])>=20 or r[0].lower() in ['dentist in baku','bakida stomatologiya','bakıda stomatologiya']: print(r)
print('HOME URLS')
for r in p:
 if re.match(r'https?://(?:www\.)?besmile.az/(?:ru|az|en)?/?$',r[0]):print(r)
print('OPPORTUNITY PAGES')
for r in sorted(p,key=lambda r:float(r[2]),reverse=True)[:25]:print(r)
