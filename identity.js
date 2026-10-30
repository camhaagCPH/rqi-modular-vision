/* Identity study (main page): hero board, word reveal, data diagram, modular products, rail, closing. No dependencies. Needs common.js first. */
(function () {
  'use strict';
  const { $, clamp, reduce, ICON, svg } = window.RQI;

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
  /* components: [id, title, icon, colour class, owning team, body kind] */
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
  /* each host composes a different page from components of different teams */
  const MODES = [
    { pill: 'In a product', desc: '<b>When another team\'s component fits your page, you plug it in.</b> It brings its own UI and logic. The rest of the product stays yours: navigation, content and release schedule.',
      frame: [60, 26, 640, 408],
      pos: { compliance: [84, 84, 188, 126], risk: [280, 84, 196, 216], trend: [484, 84, 192, 126], due: [84, 218, 188, 82], tickets: [484, 218, 192, 82], stations: [84, 308, 592, 92] } },
    { pill: 'On a platform', desc: '<b>A platform can offer whole functions, not just components.</b> In RQI Navigate you could see and manage your learners through the connection, while the team behind learner management still owns the service. Navigate is one such host; any host can be another.',
      frame: [60, 26, 640, 408],
      pos: {} },
    { pill: 'In an agent', desc: '<b>An AI assistant is a host with tool access.</b> Through MCP servers it can read data and take actions in the same capabilities, within the user\'s permissions.',
      frame: [230, 20, 300, 420],
      pos: { compliance: [250, 114, 260, 92], risk: [250, 214, 260, 92], due: [250, 314, 260, 92] } },
    { pill: 'In customer systems', desc: '<b>A customer\'s own systems connect through the open standard.</b> Anything that speaks MCP, such as the customer\'s assistant or other internal tools, reaches our capabilities through the same gateway and permissions. The customer keeps its own rules and data.',
      frame: [40, 70, 680, 320],
      pos: { compliance: [64, 150, 204, 170], risk: [278, 150, 204, 170], orders: [492, 150, 204, 170] } }
  ];
  const stage = $('stage'), stageIn = $('stageIn');
  stageIn.innerHTML = `<div class="frame" id="frame">
      <div class="decor f-top"><i></i><i></i><i></i><span>Host</span></div>
      <div class="decor f-side"><div class="nv on"><span class="tile k1">${svg('learners')}</span>Learners</div><div class="nv"><span class="tile k2">${svg('programs')}</span>Programs</div><div class="nv"><span class="tile k3">${svg('stations')}</span>Stations</div><div class="nv"><span class="tile k4">${svg('schedule')}</span>Scheduling</div><div class="nv"><span class="tile k8">${svg('insight')}</span>Insight</div></div><div class="decor f-main"><div class="fm-head"><div><b>Learners</b><span>Learners team</span></div><div class="fm-btn">+ Add users</div></div><div class="fm-tools"><span class="fm-search"></span><span class="fm-chip">All units</span></div><div class="fm-rows"><div class="fm-r new"><i class="av"></i><span class="sk" style="width:58%"></span><span class="fm-p add">New</span></div><div class="fm-r"><i class="av"></i><span class="sk" style="width:78%"></span><span class="fm-p ok">Current</span></div><div class="fm-r"><i class="av"></i><span class="sk" style="width:62%"></span><span class="fm-p soon">Due soon</span></div><div class="fm-r"><i class="av"></i><span class="sk" style="width:70%"></span><span class="fm-p ok">Current</span></div><div class="fm-r"><i class="av"></i><span class="sk" style="width:54%"></span><span class="fm-p ok">Current</span></div><div class="fm-r"><i class="av"></i><span class="sk" style="width:66%"></span><span class="fm-p late">Overdue</span></div></div><div class="fm-toast">✓ 3 users added</div></div>
      <div class="decor f-chat"><div class="head"><span class="orb-s"></span>Sam</div><div class="me">How is the program doing?</div></div>
      <div class="decor f-label">Customer systems · customer rules</div></div>` +
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

  /* ---------- Data diagram: teams provide, a semantic layer keeps meaning, the gateway opens the door, hosts use it ---------- */
  const tile = (x, y, s, grad, icon) => `<g transform="translate(${x},${y})"><rect width="${s}" height="${s}" rx="${(s * 0.27).toFixed(1)}" fill="${grad}"/><g class="tic" transform="translate(${s * 0.25},${s * 0.25}) scale(${(s * 0.5 / 24).toFixed(3)})">${ICON[icon]}</g></g>`;
  const pill = (x, y, label, mcp) => { const w = label.length * 7.4 + 16; return `<g transform="translate(${x},${y})"><rect width="${w}" height="20" rx="10" class="${mcp ? 'dpm' : 'dproto'}"/><text x="${w / 2}" y="14" text-anchor="middle" class="${mcp ? 'dpmt' : 'dprotot'}">${label}</text></g>`; };
  const card = (x, y, w, h, n, d, inner, cls, rx) => `<g transform="translate(${x},${y})"><g class="dg ${cls || 'dcardg'}" data-n="${n}" style="--d:${d}s"><rect width="${w}" height="${h}" rx="${rx || 26}" class="${cls && cls.includes('dark') ? 'ddark' : 'dlight'}"/>${inner}</g></g>`;

  /* Reads and actions take different roads, hosts are the consumers, the gateway shows what it does.
     Convention (stated under the diagram): arrows follow the data; the purple action path travels back up to the team that owns the service. */
  function buildDiagram() {
    const conn = (x1, y1, x2, y2, n, d, label, cls, ly) => {
      const horiz = y1 === y2, up = !horiz && y2 < y1;
      let line, head;
      if (horiz) { line = `M${x1} ${y1} L${x2 - 9} ${y2}`; head = `M${x2 - 11} ${y2 - 6} L${x2 - 1} ${y2} L${x2 - 11} ${y2 + 6}z`; }
      else if (up) { line = `M${x1} ${y1} L${x2} ${y2 + 9}`; head = `M${x2 - 6} ${y2 + 11} L${x2} ${y2 + 1} L${x2 + 6} ${y2 + 11}z`; }
      else { line = `M${x1} ${y1} L${x2} ${y2 - 9}`; head = `M${x2 - 6} ${y2 - 11} L${x2} ${y2 - 1} L${x2 + 6} ${y2 - 11}z`; }
      const w = label ? label.length * 6.6 + 18 : 0, mx = horiz ? (x1 + x2) / 2 : x1, my = ly || (horiz ? y1 : (y1 + y2) / 2);
      const lb = label ? `<g transform="translate(${(mx - w / 2).toFixed(1)},${(my - 10).toFixed(1)})"><rect width="${w.toFixed(1)}" height="20" rx="10" class="dpl"/><text x="${(w / 2).toFixed(1)}" y="14" text-anchor="middle" class="dplt">${label}</text></g>` : '';
      return `<g class="dg ${cls || ''}" data-n="${n}" style="--d:${d}s"><path class="dline" d="${line}"/><path class="darr" d="${head}"/>${lb}</g>`;
    };
    const dots = (x, y) => [0, 12, 24].map((o) => `<circle cx="${x + o}" cy="${y}" r="3.5" fill="#d2d2d7"/>`).join('');
    const bubble = (x, y, w, t) => `<rect x="${x}" y="${y}" width="${w}" height="22" rx="11" fill="#1d1d1f"/><text x="${x + w / 2}" y="${y + 15}" text-anchor="middle" style="font:700 11px var(--font);fill:#fff">${t}</text>`;
    let s = `<svg viewBox="-24 -32 848 736" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Domain teams provide their services through an API and an MCP server and feed a data platform. A semantic layer defines shared metrics on the data platform. Everything passes through the AIA gateway, which handles identity, permissions, the tool registry and the audit log. Hosts use it: a product or platform embeds a component, an AI assistant reads data and calls tools, and a customer's own assistant connects through the same gateway. Actions travel back up through the gateway to the team that owns the service.">
      <defs>
        <linearGradient id="gK1" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#8e99c2"/><stop offset="0.52" stop-color="#495b9c"/><stop offset="1" stop-color="#39477a"/></linearGradient>
        <linearGradient id="gK2" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#d1b98c"/><stop offset="0.52" stop-color="#b58e45"/><stop offset="1" stop-color="#8d6f36"/></linearGradient>
        <linearGradient id="gK3" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#74a2a0"/><stop offset="0.52" stop-color="#1e6965"/><stop offset="1" stop-color="#17524f"/></linearGradient>
        <linearGradient id="gK4" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#e7ad9e"/><stop offset="0.52" stop-color="#d87a63"/><stop offset="1" stop-color="#a85f4d"/></linearGradient>
        <linearGradient id="gK8" x1="0.1" y1="0" x2="0.9" y2="1"><stop offset="0" stop-color="#93c2d6"/><stop offset="0.52" stop-color="#519dbd"/><stop offset="1" stop-color="#3f7a93"/></linearGradient>
        <linearGradient id="gDark" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b2b31"/><stop offset="1" stop-color="#0d1219"/></linearGradient>
        <linearGradient id="gShr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a7a84"/><stop offset="1" stop-color="#3a3a42"/></linearGradient>
        <linearGradient id="gDb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a8a94"/><stop offset="1" stop-color="#3a3a42"/></linearGradient>
        <linearGradient id="gai" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#af50af"/><stop offset="1" stop-color="#5f73ba"/></linearGradient>
      </defs><g id="dcam">`;
    // the action path first, so it passes behind the gateway
    s += conn(330, 520, 330, 130, 'act', 1.0, 'tool call · approved', 'dact', 240);
    // 1 domain teams
    s += `<g class="dg" data-n="teams act" style="--d:0s"><rect width="420" height="130" rx="26" class="dband2"/><text x="22" y="27" class="dbl">DOMAIN TEAMS</text>
      <g class="dx" data-x="teams">${pill(296, 12, 'API')}${pill(344, 12, 'MCP', 1)}</g>`;
    [['learners', 'Learners', 1], ['programs', 'Programs', 2], ['stations', 'Stations', 3], ['schedule', 'Scheduling', 4]].forEach((t, i) => {
      s += `<g transform="translate(${14 + i * 100},42)"><rect width="94" height="74" rx="16" class="dmini"/>${tile(10, 10, 30, `url(#gK${t[2]})`, t[0])}<text x="10" y="62" class="dt2" style="font-size:13.5px">${t[1]}</text></g>`;
    });
    s += `</g>`;
    // 2 data platform and semantic layer
    s += conn(420, 65, 540, 65, 'sem', 0.3, 'feeds');
    s += card(540, 29, 260, 72, 'sem', 0.2, `${tile(14, 14, 44, 'url(#gDb)', 'db')}<text class="dt2" x="70" y="35">Data platform</text><text class="ds2" x="70" y="54">fed by the teams</text>`, 'dcardg', 22);
    s += conn(670, 101, 670, 170, 'sem', 0.4, 'governed data');
    s += `<g transform="translate(540,170)"><g class="dg dcardg" data-n="sem" style="--d:0.6s"><rect width="260" height="112" rx="26" class="dshr"/>
      <rect width="40" height="40" x="20" y="20" rx="11" fill="rgba(255,255,255,0.16)"/><g class="tic" transform="translate(30,30) scale(0.83)">${ICON.layers}</g>
      <text x="72" y="40" class="dwt" style="font-size:21px">Semantic layer</text><text x="72" y="60" class="dws" style="font-size:12.5px;fill:#d6dce4">Shared meaning, defined once</text>
      <g transform="translate(176,74)"><rect width="64" height="22" rx="11" fill="#ececf1"/><text x="32" y="15" text-anchor="middle" style="font:800 12px var(--font);fill:#424245">Shared</text></g>
      <g class="dx" data-x="sem"><rect x="20" y="74" width="112" height="22" rx="11" fill="rgba(255,255,255,0.14)"/><text x="30" y="89" class="dcode" style="font-size:11.5px">total_learners</text></g></g></g>`;
    // 3 gateway
    s += conn(110, 130, 110, 350, 'teams gate', 0.5, 'API · MCP');
    s += conn(670, 282, 670, 350, 'sem gate', 0.5, 'metrics');
    s += `<g transform="translate(0,350)"><g class="dg dcardg dark" data-n="gate act" style="--d:0.7s"><rect width="800" height="92" rx="26" class="ddark"/>
      <rect width="44" height="44" x="24" y="14" rx="12" fill="rgba(255,255,255,0.16)"/><g class="tic" transform="translate(35,25) scale(0.92)">${ICON.gateway}</g>
      <text x="84" y="36" class="dwt" style="font-size:24px">RQI Gateway</text><text x="84" y="55" class="dws">every request, from a person or an AI</text>
      <g transform="translate(620,18)"><rect width="160" height="30" rx="15" fill="url(#gai)"/><text x="80" y="20" text-anchor="middle" style="font:800 13px var(--font);fill:#fff">Owned by AIA</text></g>
      <g class="dx" data-x="gate">${['Identity', 'Permissions', 'Tool registry', 'Audit log'].map((t, i) => { const w = t.length * 7 + 22, x = 84 + [0, 1, 2, 3].slice(0, i).reduce((a, k) => a + ['Identity', 'Permissions', 'Tool registry', 'Audit log'][k].length * 7 + 22 + 8, 0); return `<g transform="translate(${x},64)"><rect width="${w}" height="20" rx="10" fill="rgba(255,255,255,0.18)"/><text x="${w / 2}" y="14" text-anchor="middle" style="font:800 11px var(--font);fill:#fff">${t}</text></g>`; }).join('')}</g></g></g>`;
    // 4 hosts
    s += conn(125, 442, 125, 520, 'widget', 0.9, 'embeds');
    s += conn(430, 442, 430, 520, 'read', 1.0, 'reads');
    s += conn(705, 442, 705, 520, 'ext', 1.1, 'open standard');
    s += `<g transform="translate(0,520)"><g class="dg dcardg" data-n="widget" style="--d:1.1s"><rect width="250" height="170" rx="26" class="dlight"/>${dots(20, 20)}<text x="62" y="24" class="ds2" style="font-weight:800">Product or platform</text><line x1="0" y1="36" x2="250" y2="36" stroke="#efeff3"/>
      <rect x="18" y="50" width="150" height="8" rx="4" fill="#ececf1"/><rect x="18" y="64" width="108" height="8" rx="4" fill="#ececf1"/>
      <rect x="16" y="82" width="218" height="76" rx="14" fill="#f5f5f7" stroke="#c7c7cc" stroke-width="1.4" stroke-dasharray="5 4"/>
      ${tile(26, 92, 28, 'url(#gK8)', 'insight')}<text x="62" y="107" class="dt2" style="font-size:13.5px">Compliance rate</text><text x="62" y="121" class="ds2" style="font-size:11px">Component</text><text x="222" y="144" text-anchor="end" class="dnum2 pulse" style="font-size:30px">87%</text></g></g>`;
    s += `<g transform="translate(270,520)"><g class="dg dcardg" data-n="read act" style="--d:1.25s"><rect width="320" height="170" rx="26" fill="#fff" stroke="url(#gai)" stroke-width="3"/>
      <circle cx="30" cy="27" r="8" fill="url(#gai)"/><text x="46" y="32" class="dt2" style="font-size:15px">AI assistant</text>
      <g class="sub-read">${bubble(150, 44, 152, 'Compliance in unit 4?')}<rect x="18" y="72" width="284" height="32" rx="12" fill="#f5f6fa"/><text x="30" y="93" class="dt2" style="font-size:13.5px">Compliance is 87%</text><rect x="196" y="78" width="96" height="20" rx="10" fill="#e8ebf8"/><text x="244" y="92" text-anchor="middle" style="font:700 10.5px var(--font);fill:#33447a">source: Insight</text></g>
      <g class="sub-act"><rect x="18" y="114" width="284" height="48" rx="12" fill="#fff" stroke="#e1e3ec" stroke-width="1.5"/>${tile(26, 123, 28, 'url(#gai)', 'tool')}<text x="62" y="136" class="dt2" style="font-size:12.5px">send_reminder · unit 4</text><text x="62" y="152" class="ds2" style="font-size:11px">Needs approval · 6 learners</text><rect x="212" y="128" width="78" height="26" rx="13" fill="#1d1d1f"/><text x="251" y="145" text-anchor="middle" style="font:800 11.5px var(--font);fill:#fff">Approve</text></g></g></g>`;
    s += `<g transform="translate(610,520)"><g class="dg" data-n="ext" style="--d:1.4s"><rect width="190" height="170" rx="26" fill="#fafafc" stroke="#c7c7cc" stroke-width="1.6" stroke-dasharray="6 5"/>
      <text x="20" y="42" class="dt2" style="font-size:15px">Customer's own</text><text x="20" y="62" class="dt2" style="font-size:15px">assistant</text>
      <text x="20" y="106" class="ds2" style="font-size:12px">Same gateway,</text><text x="20" y="123" class="ds2" style="font-size:12px">same permissions</text></g></g>`;
    s += `</g></svg>`;
    return s;
  }

  /* ---------- Rail ---------- */
  const rail = $('rail');
  $('next').addEventListener('click', () => rail.scrollBy({ left: 462, behavior: 'smooth' }));
  $('prev').addEventListener('click', () => rail.scrollBy({ left: -462, behavior: 'smooth' }));

  /* ---------- Observers ---------- */

  /* ---------- Data scene steps: the whole diagram first, then one layer at a time ---------- */
  const dscene = $('data'), dstage = $('dstage'), dsteps = [...document.querySelectorAll('#dsteps .dstep')], ddots = [...document.querySelectorAll('#ddots i')];
  let dcam = null, dnodes = [], dcur = 0;
  // focus token (which layer stays lit) and the diagram area the camera frames, in diagram units; dim:true dims without moving the camera
  const DSTEPS = [
    { f: 'all' },
    { f: 'teams', r: [0, 0, 420, 130] },
    { f: 'sem', r: [500, 20, 300, 270] },
    { f: 'gate', r: [0, 350, 800, 92] },
    { f: 'widget', r: [0, 520, 250, 170] },
    { f: 'read', r: [270, 520, 320, 170] },
    { f: 'act', dim: true },
    { f: 'end' }
  ];
  const camFor = (r) => {
    if (!r) return { s: 1, x: 0, y: 0 };
    const sc = Math.min(1.5, 0.95 * 848 / r[2], 0.62 * 736 / r[3]);
    return { s: sc, x: 400 - sc * (r[0] + r[2] / 2), y: 336 - sc * (r[1] + r[3] / 2) };
  };
  let cam = { s: 1, x: 0, y: 0 }, camRaf = 0, dstep = -1, dlive = 0;
  const setCam = (c) => dcam.setAttribute('transform', `translate(${c.x.toFixed(2)} ${c.y.toFixed(2)}) scale(${c.s.toFixed(4)})`);
  function moveCam(to) {
    cancelAnimationFrame(camRaf);
    if (reduce) { cam = to; setCam(cam); return; }
    const from = cam, t0 = performance.now(), dur = 1000;
    const tick = (now) => {
      const k = clamp((now - t0) / dur, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      cam = { s: from.s + (to.s - from.s) * e, x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
      setCam(cam); if (k < 1) camRaf = requestAnimationFrame(tick);
    };
    camRaf = requestAnimationFrame(tick);
  }
  function applyDStep(i) {
    if (i === dstep) return;
    const first = dstep < 0; dstep = i; dcur = i;
    const st = DSTEPS[i];
    dstage.classList.add('in'); dstage.dataset.f = st.f;
    if (!dlive) dlive = setTimeout(() => dstage.classList.add('live'), reduce ? 0 : 2600);
    dnodes.forEach((n) => n.classList.toggle('dim', (st.r || st.dim) ? !n.dataset.n.split(' ').includes(st.f) : false));
    if (first) { cam = camFor(st.r); setCam(cam); } else moveCam(camFor(st.r));
    dsteps.forEach((c, k) => { c.classList.toggle('on', k === i); c.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    ddots.forEach((d, k) => d.classList.toggle('on', k === i));
  }

  $('dataViz').innerHTML = buildDiagram();
  dcam = $('dcam'); dnodes = [...dstage.querySelectorAll('[data-n]')];

  /* ---------- Scroll ---------- */
  const board = $('board'), statement = $('statement');
  let tick = false;
  function onScroll() {
    tick = false;
    const y = scrollY, vh = innerHeight;
    board.style.setProperty('--tilt', reduce ? 0 : (26 * clamp(1 - y / (vh * 0.75), 0, 1)).toFixed(2));
    let r = statement.getBoundingClientRect(), p = clamp(-r.top / (r.height - vh), 0, 1), k = clamp((p - 0.06) / 0.78, 0, 1) * words.length;
    words.forEach((w, i) => w.classList.toggle('on', i < k));
    r = shape.getBoundingClientRect(); p = clamp(-r.top / (shape.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyMode(Math.floor(p * MODES.length));
    r = dscene.getBoundingClientRect(); p = clamp(-r.top / (dscene.offsetHeight - vh), 0, 0.9999);
    if (r.top < vh && r.bottom > 0) applyDStep(Math.floor(p * DSTEPS.length));
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Step cue: show which step the caption is on, and that it changes with scroll ---------- */
  ['prdots', 'ddots'].forEach((id) => {
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

  /* ---------- Closing: the platform gets built from capabilities and components ---------- */
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
