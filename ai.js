/* AI in RQI page: why streamlined AI, the clash, the maturity of AI features, the supervisor that grows. No dependencies. */
(function () {
  'use strict';
  const { $, clamp, reduce, svg } = window.RQI;

  /* ---------- Why it matters: the platform (clash) ---------- */
  const LS = [
    { name: 'Built apart.', desc: '<b>Two teams, two designs.</b> One built a chat that sits in the page. The other built an assistant in a side panel.' },
    { name: 'Put together, they clash.', desc: '<b>Two assistants on one screen. Which one do you ask?</b> Do they know the same things? Which one sees the page?' }
  ];
  const lscene = $('clash'), lstage = $('lstage'), lin = $('lin'), ltext = $('ltext'), ldots = [...document.querySelectorAll('#ldots i')];
  let lstep = -1, ltimers = [];
  function fitL() { lin.style.transform = `scale(${lstage.clientWidth / 760})`; }
  addEventListener('resize', fitL); fitL();
  $('ldesc').innerHTML = LS[0].desc;
  function applyLStep(i) {
    if (i === lstep) return; lstep = i;
    ltimers.forEach(clearTimeout); ltimers = [];
    lstage.dataset.step = i; lstage.dataset.p = 0;
    ltext.classList.add('sw'); ltimers.push(setTimeout(() => { $('lname').textContent = LS[i].name; $('ldesc').innerHTML = LS[i].desc; ldots.forEach((d, k) => d.classList.toggle('on', k === i)); ltext.classList.remove('sw'); }, 260));
    [[1, 900], [2, 2800]].forEach(([p, t]) => ltimers.push(setTimeout(() => { lstage.dataset.p = p; }, reduce ? 60 * p : t)));
  }
  new IntersectionObserver((es, o) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('go'); o.unobserve(e.target); } }), { threshold: 0.3 }).observe($('learn'));

  /* ---------- The supervisor grows ---------- */
  const GCAPS = [['stations', 'Stations', 'k3', -90, 'list_offline'], ['insight', 'Insight', 'k8', -45, 'get_metric'], ['learners', 'Learners', 'k1', 0, 'send_reminder'], ['schedule', 'Scheduling', 'k4', 45, 'book_service'],
    ['programs', 'Programs', 'k2', 90, ''], ['customers', 'Customers', 'k5', 135, ''], ['shop', 'Orders', 'k6', 180, ''], ['support', 'Support', 'k7', -135, '']];
  const GCONN = [['insight'], ['insight', 'learners'], ['insight', 'learners', 'stations', 'schedule']];
  const GSTEPS = [
    { group: 'An example · one tool', name: 'It starts as an agent.', desc: '<b>With one tool connected, it reads and explains.</b> Say the first tool gives it numbers. It can answer questions about them. It cannot change anything yet, and it says so.', abil: 3 },
    { group: 'An example · two tools', name: 'Another tool arrives.', desc: '<b>A second capability is published as a tool.</b> The panel and the pattern stay the same. The assistant gains the ability to act, and you approve each action.', abil: 8 },
    { group: 'An example · many tools', name: 'It becomes a supervisor.', desc: '<b>With tools across many domains, one request spans all of them.</b> Same panel, same pattern, more power, and nothing new to learn.', abil: 20 }
  ];
  const gscene = $('grow'), gstage = $('gstage'), gin = $('gin'), gtext = $('gtext'), gdots = [...document.querySelectorAll('#gdots i')];
  const HX = 190, HY = 230, GR = 148;
  $('gslots').innerHTML = GCAPS.map((c) => { const a = c[3] * Math.PI / 180; return `<div class="gslot" id="gs-${c[0]}" style="left:${(HX + Math.cos(a) * GR).toFixed(1)}px;top:${(HY + Math.sin(a) * GR).toFixed(1)}px"><div class="tile ${c[2]}">${svg(c[0])}</div><span class="nm">${c[1]}</span><span class="tn">${c[4]}</span></div>`; }).join('');
  $('gwires').innerHTML = GCAPS.map((c) => { const a = c[3] * Math.PI / 180; return `<line class="gw" id="gw-${c[0]}" x1="${HX}" y1="${HY}" x2="${(HX + Math.cos(a) * (GR - 30)).toFixed(1)}" y2="${(HY + Math.sin(a) * (GR - 30)).toFixed(1)}"/>`; }).join('');
  function fitG() { gin.style.transform = `scale(${gstage.clientWidth / 760})`; }
  addEventListener('resize', fitG); fitG();
  let gstep = -1, gtimers = [];
  function setConn(i) {
    GCAPS.forEach((c) => {
      const on = GCONN[i].includes(c[0]), s = $('gs-' + c[0]), w = $('gw-' + c[0]);
      if (on && !s.classList.contains('on')) { gtimers.push(setTimeout(() => { s.classList.add('on'); w.classList.add('on'); }, 450)); }
      else if (!on) { s.classList.remove('on'); w.classList.remove('on'); }
    });
    gtimers.push(setTimeout(() => { $('gtools').textContent = GCONN[i].length; $('gabil').textContent = GSTEPS[i].abil; }, 500));
  }
  setConn(0); gtimers = []; $('gs-insight').classList.add('on'); $('gw-insight').classList.add('on'); $('gdesc').innerHTML = GSTEPS[0].desc;
  function applyGStep(i) {
    if (i === gstep) return; gstep = i;
    gtimers.forEach(clearTimeout); gtimers = [];
    gstage.dataset.step = i; gstage.dataset.p = 0;
    gtext.classList.add('sw'); gtimers.push(setTimeout(() => { $('ggroup').textContent = GSTEPS[i].group; $('gname').textContent = GSTEPS[i].name; $('gdesc').innerHTML = GSTEPS[i].desc; gdots.forEach((d, k) => d.classList.toggle('on', k === i)); gtext.classList.remove('sw'); }, 260));
    setConn(i);
    [[1, 1700], [2, 3400], [3, 5400]].forEach(([p, t]) => gtimers.push(setTimeout(() => { gstage.dataset.p = p; }, reduce ? 60 * p : t)));
  }

  /* ---------- AI patterns scene ---------- */
  const IC = {
    close: '<path d="M6 6l12 12M18 6L6 18"/>', chev: '<path d="M9 6l6 6-6 6"/>', collapse: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M14 5v14M9.5 10l-2 2 2 2"/>',
    edit: '<path d="M4 20l4-1 10-10-3-3L5 16z"/>', history: '<path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4M12 8v4l3 2"/>', mic: '<rect x="9" y="4" width="6" height="10" rx="3"/><path d="M6 11a6 6 0 0 0 12 0M12 17v3"/>',
    wave: '<path d="M5 10v4M9 7v10M13 5v14M17 8v8M21 11v2"/>', doc: '<path d="M7 4h7l4 4v12H7z"/>', up: '<path d="M7 17L17 7M9 7h8v8"/>'
  };
  const HEART = (f) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${f}" d="M12 21s-7.5-4.6-9.6-9.3C1 8.4 3 5 6.4 5c2 0 3.6 1 4.6 2.5C12 6 13.6 5 15.6 5 19 5 21 8.4 19.6 11.7 17.5 16.4 12 21 12 21z"/></svg>`;
  document.querySelectorAll('[data-heart]').forEach((e) => { e.innerHTML = HEART(e.dataset.heart === 'w' ? '#fff' : 'url(#hg)'); });
  document.querySelectorAll('[data-ic]').forEach((e) => { e.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[e.dataset.ic]}</svg>`; });
  document.querySelectorAll('[data-mt]').forEach((e) => { e.innerHTML = svg(e.dataset.mt); });


  const PATTERNS = [
    { group: 'Without a conversation', name: 'Contained', desc: '<b>A button where the work is.</b> One tap opens the result in a modal, ready to export.',
      when: 'You want one finished deliverable, like a report.', why: 'It finishes and leaves.', fit: 'The AI has no tools to work on what it made, so the result is final, not a draft to discuss.' },
    { group: 'Without a conversation', name: 'In context', desc: '<b>The same button, a different home for the answer.</b> A side sheet stays beside the page.',
      when: 'The result is something to act on while moving around.', why: 'The page stays usable and the answer stays in view.', fit: 'The AI cannot act on the result, so it stays beside the work instead of becoming a conversation.' },
    { group: 'With a conversation', name: 'Assistant', desc: '<b>A named helper with a clear scope.</b> It answers within one domain and says it is not an agent.',
      when: 'One subject needs answers, like troubleshooting stations.', why: 'People know what to ask.', fit: 'The AI can answer within one domain but has no tools to change anything.' },
    { group: 'With a conversation', name: 'Supervisor', desc: '<b>One assistant for the whole product.</b> It knows your page and uses tools from every capability.',
      when: 'The work crosses domains and ends in an action.', why: 'One place to ask, and you approve what it does.', fit: 'Tools exist across domains, so it can act, with approval.' }
  ];
  /* Examples: four stacked, each plays on its own when it scrolls into view (no scroll-driven steps) */
  const pscene = $('patterns'), ptpl = $('pstage');
  const pitems = PATTERNS.map((P, i) => {
    const stage = ptpl.cloneNode(true); stage.removeAttribute('id'); stage.dataset.step = i; stage.dataset.p = 0;
    const inner = stage.querySelector('#pin'); inner.removeAttribute('id');
    const item = document.createElement('div'); item.className = 'pitem';
    item.innerHTML = `<div class="ptext"><p class="pgroup"><span class="exb">Example ${i + 1} of ${PATTERNS.length}</span>${P.group}</p><h3 class="pname exname">${P.name}</h3><p class="plead">${P.desc}</p>` +
      `<dl class="pwhen"><div><dt>Use it when</dt><dd>${P.when}</dd></div><div><dt>Because</dt><dd>${P.why}</dd></div><div><dt>Matches the capability when</dt><dd>${P.fit}</dd></div></dl></div>`;
    const col = document.createElement('div'); col.className = 'pcol';
    col.appendChild(stage);
    col.insertAdjacentHTML('beforeend', '<p class="excap"><i></i>Illustrative wireframe. An example of the idea, not a final pattern or a rule.</p>');
    item.appendChild(col);
    return { item, stage, inner, timers: [], visible: false };
  });
  const pex = document.createElement('div'); pex.className = 'pex'; pitems.forEach((o) => pex.appendChild(o.item));
  pscene.replaceWith(pex); pex.id = 'patterns';
  function fitP() { pitems.forEach((o) => { o.inner.style.transform = `scale(${o.stage.clientWidth / 760})`; }); }
  addEventListener('resize', fitP); fitP();
  function playP(o) {
    o.timers.forEach(clearTimeout); o.timers = [];
    o.stage.dataset.p = 0;
    if (reduce) { o.stage.dataset.p = 3; return; }
    [[1, 900], [2, 2700], [3, 4800]].forEach(([p, t]) => o.timers.push(setTimeout(() => { o.stage.dataset.p = p; }, t)));
    o.timers.push(setTimeout(() => { if (o.visible) playP(o); }, 11000));
  }
  const pio = new IntersectionObserver((es) => es.forEach((e) => {
    const o = pitems.find((x) => x.item === e.target); o.visible = e.isIntersecting;
    if (e.isIntersecting) playP(o); else { o.timers.forEach(clearTimeout); o.timers = []; }
  }), { threshold: 0.5 });
  pitems.forEach((o) => pio.observe(o.item));

  /* ---------- Scroll ---------- */
  const wrap = $('orbWrap'), hxin = $('hxin');
  /* hero illustration: four teams' AI on the same screen position, one layer per team. Built apart they are almost the same but not quite (size, tilt, corner), so they smear; designed to fit they register into one crisp card. */
  const HXD = [['Learners', 'k1', -46, -30, -5, -0.05, 2, 'Learner AI'], ['Programs', 'k2', 40, -24, 4, 0.06, 34, 'Program AI'], ['Fleet', 'k3', -32, 28, 3, 0.02, 10, 'Fleet AI'], ['Analytics', 'k8', 46, 34, -4, -0.04, 22, 'Analytics AI']];
  const CARD = (t) => `<div class="hxh"><i class="hxs">&#10022;</i><b>${t}</b></div><span class="sk"></span><span class="sk m"></span><span class="sk s"></span><div class="hxpills"><span>Summarise</span><span>Suggest</span></div>`;
  hxin.innerHTML = HXD.map((f) => `<div class="hxl ${f[1]}" style="--x:${f[2]};--y:${f[3]};--r:${f[4]};--s:${f[5]};--q:${f[6]}">${CARD(f[7])}</div>`).join('') +
    `<div class="hxfin">${CARD('Samaritan AI')}</div>`;
  function fitHx() { const s = Math.min(1, wrap.clientWidth / 900); hxin.style.transform = `translateX(-50%) scale(${s})`; wrap.style.height = Math.round(300 * s + 20) + 'px'; }
  addEventListener('resize', fitHx); fitHx();
  let tick = false;
  function onScroll() {
    tick = false;
    const vh = innerHeight;
    let r = lscene.getBoundingClientRect(), p = clamp(-r.top / (lscene.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyLStep(Math.floor(p * 2));
    r = gscene.getBoundingClientRect(); p = clamp(-r.top / (gscene.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyGStep(Math.floor(p * 3));
    r = wrap.getBoundingClientRect(); const q = reduce ? 1 : clamp((vh * 0.78 - r.top) / (vh * 0.42), 0, 1);
    wrap.style.setProperty('--p', (q * q * (3 - 2 * q)).toFixed(3));
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Step cue: show which step the caption is on, and that it changes with scroll ---------- */
  ['ldots', 'gdots'].forEach((id) => {
    const box = $(id); if (!box) return;
    const dots = [...box.querySelectorAll('i')];
    const n = document.createElement('span'); n.className = 'dn'; box.appendChild(n);
    const upd = () => {
      const k = Math.max(0, dots.findIndex((d) => d.classList.contains('on')));
      n.innerHTML = `<b>${k + 1} / ${dots.length}</b>${k < dots.length - 1 ? '<em>Keep scrolling</em>' : ''}`;
    };
    new MutationObserver(upd).observe(box, { attributes: true, subtree: true, attributeFilter: ['class'] });
    upd();
  });
})();
