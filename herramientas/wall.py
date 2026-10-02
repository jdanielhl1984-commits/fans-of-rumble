import sys, json
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900})
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8102/'); pg.wait_for_timeout(2500); pg.add_script_tag(path='sim.js')
    ev=pg.evaluate
    ev("()=>{ SAVE=newSave(); SAVE.tut.done=true; SAVE.testAll=true; SAVE.unlocked=FACTION_ORDER.slice(); muted=true; document.querySelectorAll('.screen').forEach(s=>s.hidden=true); }")
    res=ev("""()=>{ const out={}; const facs=FACTION_ORDER.filter(f=>FACTIONS[f].leader);
      const tests=[['6-4',8],['7-1',8],['7-3',9],['7-4',10],['7-4',8]];
      for (const f of facs){ setFaction(f); const F=FACTIONS[f]; out[f]={};
        for (const [id,L] of tests){ for (const k of [F.leader].concat(F.units)) { const u=uSave(k); u.lvl=L; }
          const lvl=findLevel(id); let w=0; const N=6; for(let i=0;i<N;i++){ if (SIM.match('camp', lvl, 'n').w==='p') w++; } out[f][id+'@'+L]=w+'/'+N; } }
      return out; }""")
    for f,v in res.items(): print(f.ljust(10), v)
    print('errores', errs[:3]); b.close()
