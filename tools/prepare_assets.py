from pathlib import Path
from urllib.request import Request,urlopen
import json,re,shutil
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
images=ROOT/'public/images'; images.mkdir(parents=True,exist_ok=True)
fonts=ROOT/'public/fonts'; fonts.mkdir(exist_ok=True)
for name in ('kitchen','bathroom','restoration'):
    img=Image.open(ROOT/'assets'/f'{name}-concept.png').convert('RGB')
    img.save(images/f'{name}.webp','WEBP',quality=88,method=6)
    small=img.copy();small.thumbnail((800,800));small.save(images/f'{name}-small.webp','WEBP',quality=85,method=6)
shutil.copyfile(ROOT/'research/original-site/media/d7362b26-logo.png',images/'logo.png')
for family,filename in [('Instrument+Serif:ital@0','instrument-serif-regular'),('Instrument+Serif:ital@1','instrument-serif-italic'),('Manrope:wght@400..700','manrope-variable')]:
    req=Request('https://fonts.googleapis.com/css2?family='+family+'&display=swap',headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
    css=urlopen(req,timeout=30).read().decode()
    urls=re.findall(r'url\((https://[^)]+)\)',css)
    url=urls[-1]; data=urlopen(url,timeout=30).read()
    suffix='.woff2' if data[:4]==b'wOF2' else '.ttf'
    (fonts/(filename+suffix)).write_bytes(data)
    print(filename+suffix,len(data))
print('Web assets prepared')
