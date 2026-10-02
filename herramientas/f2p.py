import sys, json, time
from playwright.sync_api import sync_playwright
M=int(sys.argv[1]); DAYS=int(sys.argv[2])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900})
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8102/'); pg.wait_for_timeout(2500)
    pg.add_script_tag(path='sim.js')
    ev=pg.evaluate
    ev("()=>{ SAVE = newSave(); SAVE.tut.done=true; SAVE.seenVer=VERSION; SAVE.chatOff=true; muted=true; setFaction('animales'); saveGame(); document.querySelectorAll('.screen').forEach(s=>s.hidden=true); }")
    t0=time.time(); log=[]
    for d in range(1,DAYS+1):
        r=ev("""(M)=>{ const out=[]; let gold0=SAVE.gold;
          for(let i=0;i<M;i++){ const l=SIM.frontier(); if(!l) break; const r=SIM.match('camp', l, 'n'); out.push([l.id, r.w, r.gold, r.t]); }
          const inc=SIM.dayIncome(); const up=SIM.levelAll(); const f=SIM.frontier();
          return {out, inc, up, front: f? f.id : 'FIN', gold: SAVE.gold, elvl: f? f.elvl: 0}; }""", M)
        wins=sum(1 for o in r['out'] if o[1]=='p')
        log.append(r); print(f"día {d:2d}: frente {r['front']:>5} (rival nv {r['elvl']}) | partidas {len(r['out'])} ganadas {wins} | +{r['inc']} oro extra | subidas {r['up']['ups']} | niveles {r['up']['lv']} | oro {r['gold']}", flush=True)
        if r['front']=='FIN': break
    print('tiempo', round(time.time()-t0), 's', 'errores', errs[:3])
    json.dump(log, open(f'f2p_{M}.json','w'))
    b.close()
