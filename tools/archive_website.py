"""Archive public same-site HTML, text and image assets for the requested migration."""
import concurrent.futures, hashlib, json, re, time
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen
from urllib.robotparser import RobotFileParser

BASE = 'https://www.londonrenovationdesign.co.uk/'
OUT = Path(__file__).resolve().parents[1] / 'research' / 'original-site'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'html').mkdir(exist_ok=True)
(OUT / 'media').mkdir(exist_ok=True)

def fetch(url):
    with urlopen(Request(url, headers={'User-Agent': 'LondonRenovationDesign-ContentMigration/1.0'}), timeout=35) as r:
        return r.read(), r.headers.get('Content-Type', '')

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.images=[]; self.text=[]; self.skip=0
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ('script','style'): self.skip+=1
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        for key in ('src','data-src','data-original','data-lazyload'):
            if a.get(key) and (tag=='img' or re.search(r'\.(jpe?g|png|webp|gif)',a[key],re.I)): self.images.append(a[key])
        if a.get('srcset'):
            self.images += [item.strip().split()[0] for item in a['srcset'].split(',') if item.strip()]
        self.images += re.findall(r'url\([\"\']?([^\)\"\']+)',a.get('style',''))
    def handle_endtag(self,tag):
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
    def handle_data(self,data):
        if not self.skip and data.strip(): self.text.append(data.strip())

def normalize(url):
    u=urlsplit(url)
    return urlunsplit(('https','www.londonrenovationdesign.co.uk',u.path or '/', '', ''))

robots=RobotFileParser(); robots.set_url(BASE+'robots.txt')
try:
    raw,_=fetch(BASE+'robots.txt'); (OUT/'robots.txt').write_bytes(raw); robots.parse(raw.decode(errors='replace').splitlines())
except Exception: robots.parse([])
queue=deque([BASE+'home/']); seen=set(); pages=[]; failed=[]; media=set()
for sitemap in ('wp-sitemap.xml','sitemap_index.xml','sitemap.xml'):
    try:
        raw,ct=fetch(BASE+sitemap)
        if 'xml' not in ct and b'<urlset' not in raw and b'<sitemapindex' not in raw: continue
        (OUT/sitemap).write_bytes(raw)
        for url in re.findall(r'<loc>(.*?)</loc>',raw.decode(errors='replace')):
            if url.endswith('.xml'):
                sub,_=fetch(url)
                queue.extend(re.findall(r'<loc>(.*?)</loc>',sub.decode(errors='replace')))
            else: queue.append(url)
        break
    except Exception: pass
while queue and len(seen)<120:
    url=normalize(queue.popleft())
    if url in seen: continue
    seen.add(url)
    if not robots.can_fetch('LondonRenovationDesign-ContentMigration',url):
        failed.append({'url':url,'reason':'robots.txt restriction'}); continue
    try:
        raw,ct=fetch(url)
        if 'text/html' not in ct: continue
        try: content=raw.decode('utf-8')
        except UnicodeDecodeError: content=raw.decode('cp1252',errors='replace')
        page=Page(); page.feed(content)
        name=(urlsplit(url).path.strip('/').replace('/','__') or 'root')+'.html'
        (OUT/'html'/name).write_text(content,encoding='utf-8')
        page.images += [x for x in page.links if re.search(r'\.(jpe?g|png|webp|gif)(\?.*)?$',x,re.I)]
        images=sorted({urljoin(url,x) for x in page.images if not x.startswith('data:')})
        media.update(images)
        pages.append({'url':url,'file':'html/'+name,'text':'\n'.join(page.text),'images':images,'links':sorted(set(page.links))})
        for link in page.links:
            absolute=urljoin(url,link); u=urlsplit(absolute)
            if u.hostname not in ('www.londonrenovationdesign.co.uk','londonrenovationdesign.co.uk'): continue
            if u.query or re.search(r'\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|xml|css|js|mp4)$',u.path,re.I): continue
            if any(x in u.path for x in ('wp-admin','wp-login','/feed/','/wp-json/')): continue
            if normalize(absolute) not in seen: queue.append(absolute)
        print('Archived '+url,flush=True)
    except Exception as e: failed.append({'url':url,'reason':str(e)})
    time.sleep(.12)

def download(url):
    if urlsplit(url).hostname not in ('www.londonrenovationdesign.co.uk','londonrenovationdesign.co.uk'): return {'url':url,'status':'external reference retained'}
    try:
        data,ct=fetch(url)
        if not ct.startswith('image/'): return {'url':url,'status':'not an image'}
        basename=urlsplit(url).path.rsplit('/',1)[-1]
        name=hashlib.sha256(url.encode()).hexdigest()[:8]+'-'+basename
        (OUT/'media'/name).write_bytes(data)
        return {'url':url,'file':'media/'+name,'bytes':len(data)}
    except Exception as e: return {'url':url,'error':str(e)}

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool: assets=list(pool.map(download,sorted(media)))
result={'source':BASE,'retrievedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'scope':'Public same-site pages discovered from navigation and sitemap. Excludes login, query URLs, external sites and private content.','pages':pages,'assets':assets,'failures':failed,'remainingQueue':len(queue)}
(OUT/'archive.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'content.md').write_text('\n\n'.join('# '+p['url']+'\n\n'+p['text'] for p in pages),encoding='utf-8')
print(json.dumps({'pages':len(pages),'images':sum('file' in a for a in assets),'failures':failed,'remainingQueue':len(queue)}),flush=True)
