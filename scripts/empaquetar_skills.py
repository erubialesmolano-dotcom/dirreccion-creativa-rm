"""Empaqueta cada skill de skills/ en dist/<skill>.zip (carpeta de la skill en la raíz del zip, con
SKILL.md y references/), listo para subir en Claude (app web o Cowork) → Ajustes → Capacidades → Skills.

    python scripts/empaquetar_skills.py
"""
import os, zipfile, pathlib
raiz = pathlib.Path(__file__).resolve().parent.parent
dist = raiz / 'dist'
dist.mkdir(exist_ok=True)
for sk in sorted((raiz / 'skills').iterdir()):
    if not (sk / 'SKILL.md').exists():
        continue
    z = dist / f'{sk.name}.zip'
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for p in sk.rglob('*'):
            if p.is_file() and not p.name.startswith('.'):
                zf.write(p, pathlib.Path(sk.name) / p.relative_to(sk))
    print(f'{z.name}: {z.stat().st_size // 1024} KB')
