import sys, json
from playwright.sync_api import sync_playwright
N=int(sys.argv[1])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900})
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8102/'); pg.wait_for_timeout(2500); pg.add_script_tag(path='sim.js')
    ev=pg.evaluate
    ev("()=>{ SAVE=newSave(); SAVE.tut.done=true; SAVE.testAll=true; SAVE.unlocked=FACTION_ORDER.slice(); muted=true; document.querySelectorAll('.screen').forEach(s=>s.hidden=true); for (const k in CFG.cards) uSave(k).lvl=6; }")
    facs=ev("()=>FACTION_ORDER.filter(f=>FACTIONS[f].leader)")
    out={}
    for f in facs:
        r=ev("""([f,N,facs])=>{ const F=FACTIONS[f], res={}; const opp=facs.filter(g=>g!==f);
          const run=deck=>{ SAVE.decks[f]=deck; let w=0; for(let i=0;i<N;i++){ if(SIM.vs(f, opp[i%opp.length], 6)==='p') w++; } return Math.round(100*w/N); };
          res.base=run(F.units.slice());
          for (const k of (F.gacha||[])) { const d=F.units.slice(); d[d.length-1]=k; res[k+(isSpell(k)?' (hechizo)':'')]=run(d); }
          SAVE.decks[f]=F.units.slice(); return res; }""",[f,N,facs])
        out[f]=r; print(f.ljust(10), r, flush=True)
    json.dump(out, open('cards.json','w')); print('errores', errs[:3]); b.close()
