/* Identity study: hero board, word reveal, shape-shifter, data diagram, rail. No dependencies. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICON = {
    learners: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.6 3-5.4 6-5.4s5.4 1.8 6 5.4"/><path d="M16 5.6a3 3 0 0 1 0 5.6M18 14.8c1.8.6 2.8 2.2 3.2 5"/>',
    programs: '<path d="M4 5.5C6.5 4 9.5 4 12 5.5v14C9.5 18 6.5 18 4 19.5z"/><path d="M20 5.5C17.5 4 14.5 4 12 5.5v14c2.5-1.5 5.5-1.5 8 0z"/>',
    stations: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M9 20h6M12 16v4"/><path d="M8 11h2l1.2-2.4 1.8 4 1.2-1.6H16"/>',
    schedule: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    customers: '<path d="M4 20V9l8-5 8 5v11z"/><path d="M9 20v-6h6v6"/>',
    shop: '<path d="M5 8h14l-1.2 11H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    support: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.2"/><path d="M6 6l3.7 3.7M18 6l-3.7 3.7M6 18l3.7-3.7M18 18l-3.7-3.7"/>',
    insight: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    provide: '<path d="M12 20V8"/><path d="M7.5 12.5L12 8l4.5 4.5"/><path d="M5 4.5h14"/>',
    consume: '<path d="M12 4v12"/><path d="M7.5 11.5L12 16l4.5-4.5"/><path d="M5 19.5h14"/>',
    compose: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><path d="M16.5 13v7M13 16.5h7"/>',
    gateway: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    layers: '<path d="M12 4l8.5 4.5L12 13 3.5 8.5z"/><path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5"/>',
    api: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12"/>',
    mcp: '<circle cx="12" cy="12" r="2.6"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="6" r="1.8"/><circle cx="5" cy="18" r="1.8"/><circle cx="19" cy="18" r="1.8"/><path d="M6.5 7.2l3.6 3M17.5 7.2l-3.6 3M6.5 16.8l3.6-3M17.5 16.8l-3.6-3"/>'
  };
  const svg = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
  const CAPS = [
    ['learners', 'Learners & competence', 'k1'], ['programs', 'Programs & content', 'k2'], ['stations', 'Skills stations & fleet', 'k3'], ['schedule', 'Scheduling & access', 'k4'],
    ['customers', 'Customers & licenses', 'k5'], ['shop', 'E-commerce & orders', 'k6'], ['support', 'Support & knowledge', 'k7'], ['insight', 'Insight & outcomes', 'k8']
  ];

  /* ---------- Hero board ---------- */
  const SC = [[-380, -260, -40], [260, -300, 30], [-120, -340, 20], [420, -220, -25], [-460, -180, 35], [100, -380, -30], [-250, -300, 25], [380, -320, 40]];
  $('board').innerHTML = CAPS.map((c, i) =>
    `<div class="cell"><div class="tile ${c[2]}" style="--i:${i};--ax:${SC[i][0]}px;--ay:${SC[i][1]}px;--ar:${SC[i][2]}deg">${svg(c[0])}</div>${c[1].split(' & ')[0]}</div>`).join('');
  [['ri1', 'provide'], ['ri2', 'consume'], ['ri3', 'compose'], ['ri4', 'gateway']].forEach(([id, ic]) => { $(id).innerHTML = svg(ic); });

  /* ---------- Statement words ---------- */
  const stmt = $('stmt');
  stmt.innerHTML = stmt.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');
  const words = [...stmt.querySelectorAll('.w')];

  /* ---------- Shape-shifter ---------- */
  /* widgets: [id, title, icon, colour class, owning team, body kind] */
  const MODS = [
    ['compliance', 'Compliance rate', 'insight', 'k8', 'Insight', 'big'],
    ['trend', 'Skills trend', 'insight', 'k8', 'Insight', 'spark'],
    ['risk', 'Learners at risk', 'learners', 'k1', 'Learners', 'list'],
    ['due', 'Due this month', 'schedule', 'k4', 'Scheduling', 'num'],
    ['stations', 'Station health', 'stations', 'k3', 'Stations', 'list'],
    ['orders', 'Open orders', 'shop', 'k6', 'Orders', 'num'],
    ['tickets', 'Tickets', 'support', 'k7', 'Support', 'list'],
    ['courses', 'Course progress', 'learners', 'k1', 'Learners', 'bars']
  ];
  const BODY = {
    big: '<div class="big">87%</div>',
    num: '<div class="big">24</div>',
    spark: '<svg class="spark" viewBox="0 0 120 40" preserveAspectRatio="none"><polyline points="0,32 20,28 40,30 60,18 80,20 100,9 120,6" fill="none" stroke="var(--c)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    list: '<div class="li"><i></i><span class="sk" style="width:78%"></span></div><div class="li"><i></i><span class="sk" style="width:60%"></span></div><div class="li"><i></i><span class="sk" style="width:70%"></span></div>',
    bars: '<div class="br"><span style="width:82%"></span></div><div class="br"><span style="width:56%"></span></div><div class="br"><span style="width:68%"></span></div>'
  };
  /* each host composes a different page from widgets of different teams */
  const MODES = [
    { pill: 'In a product', desc: '<b>Compose a page from any team\'s widgets.</b> Mix them with your own and keep your own navigation.', frame: [60, 26, 640, 408],
      pos: { compliance: [84, 84, 188, 126], risk: [280, 84, 196, 216], trend: [484, 84, 192, 126], due: [84, 218, 188, 82], tickets: [484, 218, 192, 82], stations: [84, 308, 592, 92] } },
    { pill: 'On a platform', desc: '<b>A platform arranges widgets into one workspace.</b> RQI Navigate is one; any host can be another.', frame: [60, 26, 640, 408],
      pos: { trend: [206, 84, 270, 150], orders: [484, 84, 196, 150], courses: [206, 242, 270, 158], stations: [484, 242, 196, 158] } },
    { pill: 'In an agent', desc: '<b>An AI assistant calls the same capabilities as tools</b> and shows the widgets right in the answer.', frame: [230, 20, 300, 420],
      pos: { compliance: [250, 114, 260, 92], risk: [250, 214, 260, 92], due: [250, 314, 260, 92] } },
    { pill: 'In their assistant', desc: '<b>A customer\'s own AI setup, through the open standard.</b> Their rules, their data, our capabilities.', frame: [40, 70, 680, 320],
      pos: { compliance: [64, 150, 204, 170], risk: [278, 150, 204, 170], orders: [492, 150, 204, 170] } }
  ];
  const stage = $('stage'), stageIn = $('stageIn');
  stageIn.innerHTML = `<div class="frame" id="frame">
      <div class="decor f-top"><i></i><i></i><i></i><span>Host</span></div>
      <div class="decor f-side"><b style="width:70%"></b><b style="width:90%"></b><b style="width:60%"></b><b style="width:80%"></b></div>
      <div class="decor f-chat"><div class="head"><span class="orb-s"></span>Sam</div><div class="me">How is the program doing?</div></div>
      <div class="decor f-label">Their AI setup · their rules</div></div>` +
    MODS.map((m) => `<div class="mod ${m[3]}" id="m-${m[0]}"><div class="row"><div class="tile ${m[3]}">${svg(m[2])}</div><b>${m[1]}</b></div><div class="src">${m[4]} team</div><div class="body">${BODY[m[5]]}</div></div>`).join('');
  const frame = $('frame');
  $('pills').innerHTML = MODES.map((m, i) => `<button class="pill" data-i="${i}"><i>+</i>${m.pill}</button>`).join('');
  const pills = [...document.querySelectorAll('.pill')];
  let mode = -1;
  function applyMode(i) {
    if (i === mode) return;
    mode = i;
    const M = MODES[i];
    stage.dataset.mode = i;
    Object.assign(frame.style, { left: M.frame[0] + 'px', top: M.frame[1] + 'px', width: M.frame[2] + 'px', height: M.frame[3] + 'px' });
    MODS.forEach((m) => {
      const el = $('m-' + m[0]), p = M.pos[m[0]];
      if (p) { Object.assign(el.style, { left: p[0] + 'px', top: p[1] + 'px', width: p[2] + 'px', height: p[3] + 'px' }); el.classList.remove('hide'); el.classList.toggle('compact', p[3] < 100 && p[2] < 250); el.classList.toggle('wide', p[3] < 100 && p[2] >= 250); }
      else { Object.assign(el.style, { left: '310px', top: '190px', width: '140px', height: '90px' }); el.classList.add('hide'); }
    });
    pills.forEach((b, k) => b.classList.toggle('on', k === i));
    $('pdesc').innerHTML = M.desc;
  }
  const shape = $('shape');
  pills.forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.i, total = shape.offsetHeight - innerHeight;
    window.scrollTo({ top: shape.offsetTop + total * ((i + 0.5) / MODES.length), behavior: reduce ? 'auto' : 'smooth' });
  }));
  function fitStage() { stageIn.style.transform = `scale(${stage.clientWidth / 760})`; }
  window.addEventListener('resize', fitStage); fitStage(); applyMode(0);

  /* ---------- Data diagram (3 steps: define, expose, govern and use) ---------- */
  (function dataViz() {
    const tile = (x, y, s, grad, icon) => `<g transform="translate(${x},${y})"><rect width="${s}" height="${s}" rx="${(s * 0.27).toFixed(1)}" fill="${grad}"/><g class="tic" transform="translate(${s * 0.25},${s * 0.25}) scale(${(s * 0.5 / 24).toFixed(3)})">${ICON[icon]}</g></g>`;
    const wire = (x1, y1, x2, y2, step, d) => {
      const ye = y2 - 9, ym = (y1 + ye) / 2, p = x1 === x2 ? `M${x1} ${y1} L${x2} ${ye}` : `M${x1} ${y1} C ${x1} ${ym}, ${x2} ${ym}, ${x2} ${ye}`;
      return `<g class="dg" data-s="${step}" style="--d:${d}s"><path class="dline" d="${p}"/><path class="darr" d="M${x2 - 6} ${y2 - 11} L${x2} ${y2 - 1} L${x2 + 6} ${y2 - 11}z"/></g>`;
    };
    const proto = (x, y, label) => { const w = label.length * 7.6 + 18; return `<g transform="translate(${x - w},${y})"><rect width="${w}" height="22" rx="11" class="dproto"/><text x="${w / 2}" y="15" text-anchor="middle" class="dprotot">${label}</text></g>`; };
    const card = (x, y, w, h, step, d, inner, cls, rx) => `<g transform="translate(${x},${y})"><g class="dg ${cls || 'dcardg'}" data-s="${step}" style="--d:${d}s">${cls && cls.includes('dark') ? '' : ''}<rect width="${w}" height="${h}" rx="${rx || 26}" class="${cls && cls.includes('dark') ? 'ddark' : 'dlight'}"/>${inner}</g></g>`;
    let s = `<svg viewBox="0 -4 800 724" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Data platform feeds a semantic layer, which is exposed through an API and an MCP server, passes through the gateway, and shows the same 87 percent in a dashboard, a widget and an AI answer">
      <defs>
        <linearGradient id="gDb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7b8a9c"/><stop offset="1" stop-color="#3b4655"/></linearGradient>
        <linearGradient id="gApi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a95cf"/><stop offset="1" stop-color="#1e5076"/></linearGradient>
        <linearGradient id="gMcp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a8de0"/><stop offset="1" stop-color="#3b4a9c"/></linearGradient>
        <linearGradient id="gDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d6a99"/><stop offset="1" stop-color="#14354d"/></linearGradient>
        <linearGradient id="gai" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#af50af"/><stop offset="1" stop-color="#5f73ba"/></linearGradient>
      </defs>`;
    // step 1: define
    s += card(270, 0, 260, 64, 1, 0, `${tile(14, 10, 44, 'url(#gDb)', 'db')}<text class="dt2" x="70" y="30">Data platform</text><text class="ds2" x="70" y="49">fed by every capability</text>`, 'dcardg', 22);
    s += wire(400, 64, 400, 108, 1, 0.3);
    s += card(140, 108, 520, 144, 1, 0.5, `<rect width="44" height="44" x="26" y="26" rx="12" fill="rgba(255,255,255,0.16)"/><g class="tic" transform="translate(37,37) scale(0.92)">${ICON.layers}</g>
      <text x="86" y="52" class="dwt">Semantic layer</text><text x="86" y="74" class="dws">Metrics as code, defined once</text>
      <rect x="26" y="98" width="336" height="26" rx="13" fill="rgba(255,255,255,0.12)"/><text x="42" y="116" class="dcode">compliance_rate = completed / assigned</text>`, 'dcardg dark', 28);
    // step 2: expose
    s += wire(275, 252, 275, 290, 2, 0.15); s += wire(535, 252, 535, 290, 2, 0.3);
    s += card(150, 290, 250, 66, 2, 0.4, `${tile(14, 11, 44, 'url(#gApi)', 'api')}<text class="dt2" x="70" y="31">Metrics API</text><text class="ds2" x="70" y="50">for product screens</text>`, 'dcardg', 22);
    s += card(410, 290, 250, 66, 2, 0.55, `${tile(14, 11, 44, 'url(#gMcp)', 'mcp')}<text class="dt2" x="70" y="31">MCP server</text><text class="ds2" x="70" y="50">for AI, as tools</text>`, 'dcardg', 22);
    // step 3: govern and use
    s += wire(275, 356, 275, 394, 3, 0.1); s += wire(535, 356, 535, 394, 3, 0.1);
    s += card(30, 394, 740, 78, 3, 0.3, `<rect width="44" height="44" x="24" y="17" rx="12" fill="rgba(255,255,255,0.16)"/><g class="tic" transform="translate(35,28) scale(0.92)">${ICON.gateway}</g>
      <text x="84" y="38" class="dwt" style="font-size:24px">RQI Gateway</text><text x="84" y="60" class="dws">who you are · what you may see · everything logged</text><g transform="translate(566,24)"><rect width="150" height="30" rx="15" fill="#fff"/><text x="75" y="20" text-anchor="middle" class="dowt">Owned by AIA</text></g>`, 'dcardg dark', 26);
    [148, 400, 652].forEach((x, i) => { s += wire(x, 472, x, 530, 3, 0.7 + i * 0.12); });
    const bars = [14, 22, 18, 30, 26, 38].map((h, i) => `<rect x="${130 + i * 14}" y="${122 - h}" width="9" height="${h}" rx="3" fill="#519dbd" opacity="${0.35 + i * 0.13}"/>`).join('');
    const wt = 'class="dt2" style="font-size:17px"';
    const wtile = (x, y, sz) => tile(x, y, sz, 'url(#gApi)', 'insight');
    s += card(30, 530, 236, 176, 3, 1.1, `${wtile(22, 18, 36)}<text ${wt} x="68" y="34">Compliance rate</text><text class="ds2" x="68" y="52">Widget · analytics product</text><text class="dnum2 pulse" x="22" y="124" style="--d:1.9s">87%</text>${bars}${proto(214, 144, 'API')}`, 'dcardg', 26);
    s += card(282, 530, 236, 176, 3, 1.25, `${wtile(22, 18, 36)}<text ${wt} x="68" y="34">Compliance rate</text><text class="ds2" x="68" y="52">Widget · another product</text><text class="dnum2 pulse" x="22" y="124" style="--d:2.1s">87%</text>
      <rect x="22" y="140" width="130" height="8" rx="4" fill="#ececf1"/><rect x="22" y="140" width="114" height="8" rx="4" fill="#3682bd"/>${proto(214, 144, 'API')}`, 'dcardg', 26);
    s += `<g transform="translate(534,530)"><g class="dg dcardg" data-s="3" style="--d:1.4s"><rect width="236" height="176" rx="26" fill="#fff" stroke="url(#gai)" stroke-width="3"/>
      <circle cx="34" cy="31" r="9" fill="url(#gai)"/><text ${wt} x="52" y="37">Samaritan</text>${proto(214, 20, 'MCP')}
      <rect x="16" y="54" width="204" height="108" rx="16" fill="#f5f6fa" stroke="#e1e3ec" stroke-width="1.5"/>
      ${wtile(26, 64, 28)}<text class="dt2" style="font-size:14px" x="62" y="80">Compliance rate</text><text class="ds2" style="font-size:11px" x="62" y="94">Widget in the answer</text>
      <text class="dnum2 pulse" x="26" y="142" style="--d:2.3s;font-size:40px">87%</text>
      <rect x="112" y="124" width="96" height="22" rx="11" fill="#e8ebf8"/><text x="124" y="139" style="font:700 11px var(--font);fill:#33447a">source: Insight</text></g></g></svg>`;
    $('dataViz').innerHTML = s;
  })();

  /* ---------- Rail ---------- */
  const rail = $('rail');
  $('next').addEventListener('click', () => rail.scrollBy({ left: 462, behavior: 'smooth' }));
  $('prev').addEventListener('click', () => rail.scrollBy({ left: -462, behavior: 'smooth' }));

  /* ---------- Observers ---------- */

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
    { group: 'Without a conversation', name: 'Contained', desc: '<b>A button where the work is.</b> One tap, no typing. The result opens in a focused modal, ready to review and export.',
      when: 'You want one finished deliverable, like a report.', why: 'It finishes and leaves. Nothing stays on screen to compete with the page.', fit: 'The AI has no tools to work on what it made. The output is the final delivery, not a draft to discuss. Opening it in a chat would promise an interaction the AI cannot back up.' },
    { group: 'Without a conversation', name: 'In context', desc: '<b>The same kind of button, a different home for the answer.</b> A side sheet stays beside the page and follows the user as they navigate.',
      when: 'The result is something to act on while moving around, like stations to check.', why: 'The page stays usable, and the answer does not disappear when you click away.', fit: 'The result is worth keeping in view, but the AI still cannot act on it. It stays beside the work and does not pretend to be a conversation.' },
    { group: 'With a conversation', name: 'Assistant', desc: '<b>A named helper with a clear scope.</b> Ask about one domain. The scope is stated up front, and it is deliberately not an agent.',
      when: 'One clear subject needs answers, like troubleshooting stations.', why: 'People know what to ask and what to expect.', fit: 'The AI can answer within one domain but has no tools to change anything. It talks, and it says it does not act.' },
    { group: 'With a conversation', name: 'Supervisor', desc: '<b>One assistant for the whole product.</b> It knows where you are, carries your page as context and uses tools from every capability.',
      when: 'The work crosses domains and ends in an action.', why: 'One place to ask, and you approve what it does.', fit: 'Tools exist across domains. Only now does it make sense to let the AI act, with approval.' }
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

  /* ---------- Today scene steps ---------- */
  const today = $('today'), cstage = $('cstage'), cin = $('cin'), ccaps = [...document.querySelectorAll('#ccaps .dcap')], cdots = [...document.querySelectorAll('#cdots i')];
  let cstep = -1;
  function fitC() { cin.style.transform = `scale(${cstage.clientWidth / 760})`; }
  addEventListener('resize', fitC); fitC();
  function applyCStep(i) {
    if (i === cstep) return; cstep = i; cstage.dataset.step = i;
    ccaps.forEach((c, k) => c.classList.toggle('on', k === i)); cdots.forEach((d, k) => d.classList.toggle('on', k === i));
  }

  /* ---------- Data scene steps ---------- */
  const dscene = $('data'), dstage = $('dstage'), dcaps = [...document.querySelectorAll('#dcaps .dcap')], ddots = [...document.querySelectorAll('#ddots i')];
  let dstep = -1;
  function applyDStep(i) {
    if (i === dstep) return; dstep = i;
    dstage.className = 'dstage ' + ['s1', 's2', 's3'].slice(0, i + 1).join(' ');
    dcaps.forEach((c, k) => c.classList.toggle('on', k === i)); ddots.forEach((d, k) => d.classList.toggle('on', k === i));
  }

  /* ---------- Scroll ---------- */
  const board = $('board'), statement = $('statement'), wrap = $('orbWrap'), chips = [...document.querySelectorAll('.gchip')];
  let tick = false;
  function onScroll() {
    tick = false;
    const y = scrollY, vh = innerHeight;
    board.style.setProperty('--tilt', reduce ? 0 : (26 * clamp(1 - y / (vh * 0.75), 0, 1)).toFixed(2));
    let r = statement.getBoundingClientRect(), p = clamp(-r.top / (r.height - vh), 0, 1), k = clamp((p - 0.06) / 0.78, 0, 1) * words.length;
    words.forEach((w, i) => w.classList.toggle('on', i < k));
    r = shape.getBoundingClientRect(); p = clamp(-r.top / (shape.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyMode(Math.floor(p * MODES.length));
    r = lscene.getBoundingClientRect(); p = clamp(-r.top / (lscene.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyLStep(Math.floor(p * 2));
    r = gscene.getBoundingClientRect(); p = clamp(-r.top / (gscene.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyGStep(Math.floor(p * 3));
    r = today.getBoundingClientRect(); p = clamp(-r.top / (today.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyCStep(Math.floor(p * 3));
    r = dscene.getBoundingClientRect(); p = clamp(-r.top / (dscene.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyDStep(Math.floor(p * 3));
    if (!reduce) { r = wrap.getBoundingClientRect(); chips.forEach((c) => { c.style.transform = `translateY(${((r.top + r.height / 2 - vh / 2) * c.dataset.speed).toFixed(1)}px)`; }); }
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Step cue: show which step the caption is on, and that it changes with scroll ---------- */
  ['cdots', 'ddots', 'ldots', 'gdots'].forEach((id) => {
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

  /* ---------- Closing: the platform gets built from capabilities and widgets ---------- */
  const navb = $('navb');
  const NW = ['compliance', 'risk', 'trend', 'due', 'tickets', 'stations'];
  const scat = (i) => { const a = (i * 137.5 + 20) * Math.PI / 180, r = 520 + (i % 4) * 90; return `--ax:${Math.round(Math.cos(a) * r)}px;--ay:${Math.round(Math.sin(a) * r * 0.7 - 160)}px;--ar:${((i * 47) % 70) - 35}deg;--i:${i}`; };
  navb.innerHTML = `<div class="nwin">
    <div class="nbar"><i></i><i></i><i></i><span>RQI</span></div>
    <div class="nbody">
      <div class="nside">${CAPS.map((c, i) => `<div class="ni" style="${scat(i)}"><div class="tile ${c[2]}">${svg(c[0])}</div><span>${c[1].split(' & ')[0]}</span></div>`).join('')}</div>
      <div class="nmain">${NW.map((id, k) => { const m = MODS.find((x) => x[0] === id); return `<div class="mod nw nw-${id} ${m[3]}" style="${scat(k + 8)}"><div class="row"><div class="tile ${m[3]}">${svg(m[2])}</div><b>${m[1]}</b></div><div class="src">${m[4]} team</div><div class="body">${BODY[m[5]]}</div></div>`; }).join('')}</div>
    </div></div>`;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { navb.classList.add('in'); o.disconnect(); } }, { threshold: 0.4 }).observe(navb);
  } else navb.classList.add('in');
})();
