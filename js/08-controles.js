// Fans of Rumble · Controles: tocar y arrastrar cartas
'use strict';
/* =========================================================
   UI / INPUT
   ========================================================= */
const $ = s => document.querySelector(s);
const stage = $('#stage'), ui = $('#ui');
// tray: slot -1 = leader (always there), slots 0-3 = hand
$('#cards').innerHTML = [-1, 0, 1, 2, 3].map(s => `<button class="card" data-slot="${s}"><span class="card-art"><canvas></canvas></span><span class="cost ol"></span><span class="card-lvl"></span><span class="card-name ol"></span><span class="card-tag"></span><span class="card-charge"></span><span class="card-lock ol" hidden></span></button>`).join('');
const elCards = [...document.querySelectorAll('#cards .card')];
for (const el of elCards) { el._slot = +el.dataset.slot; el._art = el.querySelector('canvas'); el._charge = el.querySelector('.card-charge'); el._lock = el.querySelector('.card-lock'); el._wasPoor = true; el._lockTxt = ''; el._key = null; }
const input = { card: null, slot: null, dragging: false, pointerId: null, startX: 0, startY: 0, selected: null, selSlot: null, ghost: null, touch: false };
const slotKey = s => (s < 0 ? FACTIONS[G.faction].leader : S.p.hand[s]);
// card framing per character: [x offset (fraction of width), height factor]
const ART_FIT = { fox: [0.04, 0.92], junkcoon: [-0.04, 0.92], necrolord: [-0.06, 1], skullknight: [-0.05, 1], stitchbrute: [-0.05, 1], mechavaca: [0, 1], bunny: [0, 1],
  twitchking: [-0.06, 1], hypetrain: [-0.04, 0.86], banhammer: [-0.1, 0.98], viralbot: [-0.03, 0.92], snackmom: [-0.06, 0.94], hypebeast: [-0.03, 0.92],
  epicchampion: [-0.04, 1], minotaur: [-0.06, 1], thundergod: [-0.04, 0.98], shieldmaiden: [-0.05, 0.96], cupidarcher: [-0.04, 0.92], medusa: [0, 0.96],
  cybermarine: [-0.1, 1], siegemech: [-0.08, 1], neonsniper: [-0.12, 0.9], cyberninja: [-0.06, 0.92], techdroid: [0, 0.9], hackerkid: [-0.06, 0.92],
  memelord: [-0.06, 1], chonkcat: [0, 1], trollbot: [-0.06, 0.96], stonks: [-0.08, 0.96], synthcat: [-0.04, 0.92], gifblaster: [-0.06, 0.92],
  progamer: [-0.06, 1], recreativa: [0, 1], ragequitter: [0.03, 0.96], coleccionista: [0.02, 0.94], modder: [-0.04, 0.94], speedrunner: [0.02, 0.92],
  vikingo: [-0.02, 1], titanbeta: [0, 1], rockracer: [0, 0.78], ghostagent: [-0.12, 0.92], retromarine: [-0.07, 0.94],
  directora: [-0.05, 1], kaiju: [0.08, 1], heroe: [0, 0.94], detective: [-0.07, 0.94], spoiler: [-0.06, 0.94], doble: [0, 0.92] };
function drawArt(cv, key, LW, LH) {
  const R2 = SAVE.pixel ? 0.55 : 3; cv.width = LW * R2; cv.height = LH * R2; const x = cv.getContext('2d'); x.setTransform(R2, 0, 0, R2, 0, 0); x.clearRect(0, 0, LW, LH);
  x.fillStyle = 'rgba(20,10,30,.25)'; x.beginPath(); x.ellipse(LW / 2, LH - 4, LW * 0.32, Math.max(2, LH * 0.08), 0, 0, Math.PI * 2); x.fill();
  const h = LH - 8, n = Math.min(3, (CFG.cards[key] && CFG.cards[key].count) || 1);
  if (n === 2) { drawVector(x, key, LW / 2 - LW * 0.15, LH - 4, h * 0.74, 1); drawVector(x, key, LW / 2 + LW * 0.15, LH - 2, h * 0.8, -1); }
  else if (n === 3) { const hs = key === 'skeleton' ? 0.82 : 0.66; drawVector(x, key, LW / 2 - LW * 0.24, LH - 5, h * hs, 1); drawVector(x, key, LW / 2 + LW * 0.24, LH - 5, h * hs, -1); drawVector(x, key, LW / 2, LH - 2, h * (hs + 0.1), 1); }
  else { const f = ART_FIT[key] || [0, 0.92]; drawVector(x, key, LW / 2 + f[0] * LW, LH - 3, h * f[1], 1); }
}
// v0.9.10: reduce la letra hasta que el texto quepa en su recuadro
function fitText(el, max, min) { el.style.fontSize = max + 'px'; let sz = max; while (el.scrollWidth > el.clientWidth + 0.5 && sz > min) { sz -= 0.5; el.style.fontSize = sz + 'px'; } }
function renderCard(el, k) {
  const c = CFG.cards[k]; el.dataset.card = k; el.dataset.rarity = c.rarity; el.dataset.spell = c.spell ? '1' : '';
  el.querySelector('.cost').textContent = c.cost; el.querySelector('.card-name').textContent = c.name; el.querySelector('.card-tag').textContent = c.tag;
  fitText(el.querySelector('.card-name'), 13.5, 8); fitText(el.querySelector('.card-tag'), 10.5, 7.5);
  el.querySelector('.card-lvl').textContent = 'NV ' + uSave(k).lvl;
  el.setAttribute('aria-label', `${c.name}, ${c.rar}, cuesta ${c.cost} de CAOS`);
  drawArt(el._art, k, 86, 58);
}
const FLAME_SVG = '<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M8 1c1 4 6 6 6 11a6 6 0 0 1-12 0c0-3 2-4 3-6 0 2 1 3 2 3 0-3-1-5 1-8z" fill="#ffcb3d" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 10c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1 1-2 1.5-3 .5 1 1 1.5 1.5 1.5 0-1.5-.5-2.5 0-3.5z" fill="#ff5a2a"/></svg>';
const SOUL_SVG = '<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M2 18V8a6 6 0 0 1 12 0v10l-2.5-2-2 2-1.5-2-1.5 2-2-2z" fill="#c8ffe9" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><circle cx="6" cy="9" r="1.4" fill="#20102c"/><circle cx="10" cy="9" r="1.4" fill="#20102c"/></svg>';
const ICONS = {
  flame: FLAME_SVG, soul: SOUL_SVG,
  chat: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 3h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 4v-4H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#f5f3ff" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 12.4c-3-2-4.4-3.4-4.4-4.8 0-1.3 1-2.1 2.1-2.1.9 0 1.6.5 2.3 1.3.7-.8 1.4-1.3 2.3-1.3 1.1 0 2.1.8 2.1 2.1 0 1.4-1.4 2.8-4.4 4.8z" fill="#c026d3"/></svg>',
  star: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.9z" fill="#ffe07a" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  shield: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l7 2.6v5.2c0 4.4-3 7.6-7 9.2-4-1.6-7-4.8-7-9.2V4.1z" fill="#8ef6ff" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 5v9M6.5 8.5h7" stroke="#0e6f8f" stroke-width="2" stroke-linecap="round"/></svg>',
  dice: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="4" fill="#fff" style="stroke: var(--outline)" stroke-width="1.5"/><circle cx="6.5" cy="6.5" r="1.6" fill="#20102c"/><circle cx="13.5" cy="13.5" r="1.6" fill="#20102c"/><circle cx="10" cy="10" r="1.6" fill="#20102c"/><circle cx="13.5" cy="6.5" r="1.6" fill="#20102c"/><circle cx="6.5" cy="13.5" r="1.6" fill="#20102c"/></svg>',
  box: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 7l8-4 8 4v8l-8 4-8-4z" fill="#e8c48a" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><path d="M2 7l8 4 8-4M10 11v8" fill="none" stroke="#8a6a3a" stroke-width="1.4"/><path d="M6 5l8 4" stroke="#8a6a3a" stroke-width="1.2"/></svg>',
  clap: '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2" y="8" width="16" height="10" rx="1.5" fill="#2b2d3a" style="stroke: var(--outline)" stroke-width="1.5"/><path d="M2 8l1-5 15 0-1 5z" fill="#fff" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 3l2 5M10 3l2 5M15 3l1.5 5" stroke="#20102c" stroke-width="1.6"/><path d="M5 12h10M5 15h7" stroke="#ff6b9a" stroke-width="1.4"/></svg>',
  pad: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5h10a4 4 0 0 1 4 4.5l-.5 4a2.5 2.5 0 0 1-4.3 1.4L12.5 13h-5l-1.7 1.9A2.5 2.5 0 0 1 1.5 13.5l-.5-4A4 4 0 0 1 5 5z" fill="#d1fae5" style="stroke: var(--outline)" stroke-width="1.5" stroke-linejoin="round"/><path d="M5.5 7.6v3.2M3.9 9.2h3.2" stroke="#20102c" stroke-width="1.5" stroke-linecap="round"/><circle cx="13.6" cy="8.4" r="1.2" fill="#16a34a"/><circle cx="15.6" cy="10.4" r="1.2" fill="#ff3348"/></svg>',
};
const FAC_COLOR = { animales: '#ff9a3c', nomuertos: '#5ef2c0', streamers: '#c084fc', heroes: '#ffcb3d', ciber: '#22e3ff', memes: '#a3e635', gamer: '#4ade80', olvidados: '#d6a96a', pop: '#ff6b9a' };
$('#fac-grid').innerHTML = FACTION_ORDER.map(f => { const F = FACTIONS[f]; return `<button class="diff-opt fac-opt" data-fac="${f}" aria-pressed="false" style="--fc: ${FAC_COLOR[f]}"><canvas></canvas><b class="ol">${F.name}</b><small>${ICONS[F.icon]} ${F.pname}</small></button>`; }).join('');
