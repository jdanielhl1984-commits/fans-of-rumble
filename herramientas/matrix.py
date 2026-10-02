import sys, json
from playwright.sync_api import sync_playwright
L=int(sys.argv[1]); N=int(sys.argv[2])
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':430,'height':900})
    errs=[]; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8102/'); pg.wait_for_timeout(2500); pg.add_script_tag(path='sim.js')
    ev=pg.evaluate
    ev("()=>{ SAVE=newSave(); SAVE.tut.done=true; SAVE.testAll=true; SAVE.unlocked=FACTION_ORDER.slice(); muted=true; document.querySelectorAll('.screen').forEach(s=>s.hidden=true); }")
    facs=ev("()=>FACTION_ORDER.filter(f=>FACTIONS[f].leader)")
    tot={f:[0,0] for f in facs}; M={}
    for f in facs:
        row=[]
        for g in facs:
            if f==g: row.append('  - '); continue
            r=ev("([f,g,L,N])=>{ let w=0,d=0; for(let i=0;i<N;i++){ const x=SIM.vs(f,g,L); if(x==='p') w++; else if(!x) d++; } return [w,d]; }",[f,g,L,N])
            tot[f][0]+=r[0]; tot[f][1]+=N; tot[g][0]+=N-r[0]-r[1]; tot[g][1]+=N
            row.append(f"{r[0]}/{N}")
        M[f]=row; print(f.ljust(10),' '.join(x.rjust(4) for x in row), flush=True)
    print(); 
    for f in sorted(facs,key=lambda f:-tot[f][0]/tot[f][1]): print(f.ljust(10), round(100*tot[f][0]/tot[f][1]),'%')
    json.dump({'tot':tot,'M':M}, open(f'matrix_{L}.json','w'))
    print('errores', errs[:3]); b.close()
