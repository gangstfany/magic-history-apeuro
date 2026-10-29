"""Create the public site from an explicit whitelist; never copy private source material."""
from pathlib import Path
import shutil
ROOT=Path(__file__).resolve().parents[1]
FILES=['index.html','styles.css','src/app.mjs','src/model.mjs','src/geometry.mjs','src/module-bridge.mjs','data/course.json','data/chains.json','data/places.json','data/card-locations.json','assets/world.svg','assets/geography-source.json']
def build(destination=None):
    dest=Path(destination) if destination else ROOT/'_site'
    # Only manage this dedicated output directory.
    if dest.exists():
        for path in dest.rglob('*'):
            if path.is_file() and path.relative_to(dest).as_posix() not in FILES:path.unlink()
    for name in FILES:
        out=dest/name;out.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(ROOT/name,out)
    return dest
if __name__=='__main__': print(f'Built {len(FILES)} public files in {build()}')
