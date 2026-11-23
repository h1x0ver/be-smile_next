import zipfile,xml.etree.ElementTree as E,json,sys
sys.stdout.reconfigure(encoding="utf-8")
sheets={}
p=r'C:/Users/blyadota/Downloads/besmile.az-Performance-on-Search-2026-11-19.xlsx'
n={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
with zipfile.ZipFile(p) as z:
 ss=[]
 if 'xl/sharedStrings.xml' in z.namelist():
  ss=[''.join(e.itertext()) for e in E.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',n)]
 wb=E.fromstring(z.read('xl/workbook.xml'))
 for i,s in enumerate(wb.find('s:sheets',n),1):
  root=E.fromstring(z.read('xl/worksheets/sheet%d.xml'%i)); rows=[]
  for r in root.findall('.//s:sheetData/s:row',n):
   vals=[]
   for c in r:
    v=c.find('s:v',n); val=v.text if v is not None else ''.join(c.find('s:is',n).itertext()) if c.find('s:is',n) is not None else ''
    if c.get('t')=='s': val=ss[int(val)]
    vals.append(val)
   rows.append(vals)
  sheets[s.get("name")]=rows
  print(json.dumps({'sheet':s.get('name'),'rows':len(rows),'sample':rows[:8]},ensure_ascii=False))

with open('outputs/seo/gsc-data.json','w',encoding='utf-8') as f: json.dump(sheets,f,ensure_ascii=False,indent=2)

