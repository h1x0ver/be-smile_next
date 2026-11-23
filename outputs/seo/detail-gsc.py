import json,sys,unicodedata
sys.stdout.reconfigure(encoding='utf-8')
d=json.load(open('outputs/seo/gsc-data.json',encoding='utf-8'))
q=d['Запросы'][1:]
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower().replace('ı','i')) if unicodedata.category(c)!='Mn')
print('AZ terms', [r for r in q if any(x in norm(r[0]) for x in ['stomatolog','dis klin','dis hekim'])][:35])
print('TOP QUERIES',sorted(q,key=lambda r:float(r[2]),reverse=True)[:15])
print('period totals',sum(float(r[1]) for r in d['Диаграмма'][1:]),sum(float(r[2]) for r in d['Диаграмма'][1:]))
