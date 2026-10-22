// Renders assets/agent-contrib.svg and agent-metrics.svg (English) plus .es.svg copies.
// agent-contrib: a small AI agent walks the contribution calendar in chronological order
// and "processes" each active day, lighting it up. agent-metrics: production systems panel.
// Usage: GH_TOKEN=... node tools/agent-contrib.mjs <user>
import { writeFileSync } from 'node:fs';

const user = process.argv[2];
const token = process.env.GH_TOKEN;
if (!user || !token) {
  console.error('usage: GH_TOKEN=... node tools/agent-contrib.mjs <user>');
  process.exit(1);
}

const query = `query($login:String!){user(login:$login){
  contributionsCollection{contributionCalendar{
    totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`;
const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { login: user } }),
});
const json = await res.json();
if (!res.ok || json.errors) {
  console.error('GitHub API error:', res.status, JSON.stringify(json.errors ?? json));
  process.exit(1);
}
const coll = json.data.user.contributionsCollection;
const cal = coll.contributionCalendar;

const LEVELS = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
const LIGHT = ['#ebedf0', '#a5f3fc', '#22d3ee', '#0891b2', '#0e7490'];
const DARK = ['#161b22', '#0e4f5c', '#0e7490', '#06b6d4', '#22d3ee'];
const CELL = 11, GAP = 3, STEP = CELL + GAP, PAD = 16, TOP = 44;

const cells = [];
cal.weeks.forEach((w, x) => w.contributionDays.forEach((d) => {
  const y = new Date(d.date + 'T00:00:00Z').getUTCDay();
  cells.push({ x: PAD + x * STEP, y: TOP + y * STEP, lvl: LEVELS.indexOf(d.contributionLevel), date: d.date });
}));
// Chronological order = the order the agent visits active days.
const visits = cells.filter((c) => c.lvl > 0);
const n = Math.max(visits.length, 1);
const DUR = Math.min(Math.max(n * 0.12, 12), 40).toFixed(1);
// ponytail: 95% walking, last 5% fades the board back to its unprocessed state before looping.
const pct = (i) => ((i / n) * 95).toFixed(2);

const width = PAD * 2 + cal.weeks.length * STEP - GAP;
const height = TOP + 7 * STEP + 10;

let css = '';
let rects = '';
cells.forEach((c) => {
  const cls = `l${c.lvl}`;
  const i = visits.indexOf(c);
  if (i < 0) {
    rects += `<rect class="${cls}" x="${c.x}" y="${c.y}" width="${CELL}" height="${CELL}" rx="2"/>`;
    return;
  }
  css += `@keyframes k${i}{0%{fill-opacity:.12}${pct(i)}%{fill-opacity:1}95%{fill-opacity:1}100%{fill-opacity:.12}}`;
  css += `.v${i}{animation:k${i} ${DUR}s step-end infinite}`;
  rects += `<rect class="${cls} v${i}" x="${c.x}" y="${c.y}" width="${CELL}" height="${CELL}" rx="2"/>`;
});

// Agent sits on top of the cell it is processing.
const walk = visits.map((c, i) => `${pct(i)}%{transform:translate(${c.x - 2}px,${c.y - 14}px)}`).join('');
const start = visits[0] ?? { x: PAD, y: TOP };
css += `@keyframes walk{0%{transform:translate(${start.x - 2}px,${start.y - 14}px)}${walk}100%{transform:translate(${start.x - 2}px,${start.y - 14}px)}}`;

// The production panel describes systems that live outside GitHub, so its content is hand-maintained.
// Keep it free of employer-internal names and metrics (confidentiality clause in the contractor agreement).
const I18N = {
  en: {
    contribs: (n) => `${n} contributions in the last year`,
    agentLabel: (n) => `AI agent processing ${n} GitHub contributions`,
    running: '4 systems running right now',
    systems: [
      ['WhatsApp AI agent', 'Answers every new lead, understands voice notes,', 'qualifies them and books the call by itself.'],
      ['Human handoff · Slack + CRM', 'Detects when a sales rep joins the chat,', 'pauses itself and alerts the team in Slack.'],
      ['Automated follow-ups', 'Re-engages leads that went quiet at the right', 'moment and revives cold ones after 30 days.'],
      ['End-to-end B2B outbound', 'Finds companies, enriches and verifies', 'contacts, sends, and detects replies.'],
    ],
    footer: [['n8n + LLMs + CRM', ''], ['24/7', 'monitored with alerts'], ['error handling', 'built in']],
    panelLabel: 'AI systems in production: WhatsApp AI agent that qualifies leads and books calls, human handoff with Slack, automated follow-ups and end-to-end B2B outbound.',
  },
  es: {
    contribs: (n) => `${n} contribuciones en el último año`,
    agentLabel: (n) => `Agente de IA procesando ${n} contribuciones de GitHub`,
    running: '4 sistemas corriendo ahora mismo',
    systems: [
      ['Agente IA en WhatsApp', 'Responde a cada lead nuevo, entiende audios,', 'lo califica y agenda la llamada solo.'],
      ['Handoff humano · Slack + CRM', 'Detecta cuando un vendedor entra al chat,', 'se pausa sola y avisa al equipo en Slack.'],
      ['Seguimiento automático', 'Retoma leads que dejaron de responder en el', 'momento justo y reactiva los fríos a 30 días.'],
      ['Outbound B2B de punta a punta', 'Encuentra empresas, enriquece y verifica', 'contactos, envía y detecta respuestas.'],
    ],
    footer: [['n8n + LLMs + CRM', ''], ['24/7', 'monitoreado con alertas'], ['manejo de errores', 'integrado']],
    panelLabel: 'Sistemas de IA en producción: agente de IA en WhatsApp que califica leads y agenda llamadas, handoff humano con Slack, seguimiento automático y outbound B2B de punta a punta.',
  },
};
// English is the default README, so it keeps the plain file names; Spanish gets a .es suffix.
const out = (name, lang) => `assets/${name}${lang === 'en' ? '' : `.${lang}`}.svg`;

const palette = (p) => p.map((c, i) => `.l${i}{fill:${c}}`).join('');
for (const [lang, t] of Object.entries(I18N)) {
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${t.agentLabel(cal.totalContributions)}">
<style>
text{font:600 12px 'JetBrains Mono',ui-monospace,Consolas,monospace}
.bg{fill:#ffffff}.t{fill:#24292f}.a{fill:#0e7490}.dim{fill:#57606a}
${palette(LIGHT)}
.agent{animation:walk ${DUR}s linear infinite}
.eye{fill:#22d3ee;animation:blink 1.6s steps(1) infinite}
.led{fill:#22d3ee;animation:blink .8s steps(1) infinite}
@keyframes blink{0%{opacity:1}50%{opacity:.25}}
${css}
@media (prefers-color-scheme:dark){.bg{fill:#0d1117}.t{fill:#e6edf3}.a{fill:#22d3ee}.dim{fill:#8b98a6}${palette(DARK)}}
</style>
<rect class="bg" width="100%" height="100%" rx="6"/>
<text x="${PAD}" y="22"><tspan class="a">agent@${user}</tspan><tspan class="dim"> ~ $ </tspan><tspan class="t">process --contributions</tspan><tspan class="dim">  · ${t.contribs(cal.totalContributions)}</tspan></text>
${rects}
<g class="agent">
  <rect x="7" y="0" width="1.5" height="3" class="dim"/><circle cx="7.75" cy="0" r="1.5" class="led"/>
  <rect x="1" y="3" width="13.5" height="10" rx="3" class="t"/>
  <rect x="3" y="5.5" width="3" height="3" rx="1" class="eye"/><rect x="9.5" y="5.5" width="3" height="3" rx="1" class="eye"/>
</g>
</svg>
`;
writeFileSync(out('agent-contrib', lang), svg);

// ---- agent-metrics: what is running in production, described by outcome ----
const MW = width, MH = 294, LOOP = 10;
const cw = (MW - PAD * 2 - 12) / 2, ch = 84, perim = Math.round(2 * (cw + ch));
const d = (s) => `animation-delay:${s.toFixed(2)}s`;
let cards = '';
t.systems.forEach(([title, l1, l2], i) => {
  const x = PAD + (i % 2) * (cw + 12), y = 58 + Math.floor(i / 2) * (ch + 12), t0 = 0.2 + i * 0.3;
  cards += `<g class="tile" style="${d(t0)}">
<rect class="panel" x="${x}" y="${y}" width="${cw}" height="${ch}" rx="6"/>
<rect class="beam" x="${x}" y="${y}" width="${cw}" height="${ch}" rx="6" style="${d(i * 1.1)}"/>
<rect class="edge" x="${x}" y="${y + 12}" width="3" height="${ch - 24}" rx="1.5" style="${d(t0)}"/>
<circle class="ring" cx="${x + cw - 16}" cy="${y + 20}" r="3.5" style="${d(i * 0.4)}"/>
<circle class="live" cx="${x + cw - 16}" cy="${y + 20}" r="3.5" style="${d(i * 0.4)}"/>
<text class="a h" x="${x + 16}" y="${y + 25}">${title}</text>
<text class="t" x="${x + 16}" y="${y + 51}">${l1}</text>
<text class="t" x="${x + 16}" y="${y + 69}">${l2}</text>
<rect class="cover cvp" x="${x + 14}" y="${y + 38}" width="${cw - 24}" height="17" style="${d(t0 + 0.3)}"/>
<rect class="cover cvp" x="${x + 14}" y="${y + 56}" width="${cw - 24}" height="17" style="${d(t0 + 0.6)}"/></g>`;
});
let footer = '';
for (const [v, l] of t.footer) {
  footer += `<tspan class="a">${v}</tspan>${l ? `<tspan class="dim"> ${l}</tspan>` : ''}<tspan class="dim">   ·   </tspan>`;
}
footer = footer.replace(/<tspan class="dim">   ·   <\/tspan>$/, '');

const metrics = `<svg xmlns="http://www.w3.org/2000/svg" width="${MW}" height="${MH}" viewBox="0 0 ${MW} ${MH}" role="img" aria-label="${t.panelLabel}">
<defs><linearGradient id="scan" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity="0"/><stop offset="1" stop-color="#22d3ee" stop-opacity=".3"/></linearGradient>
<linearGradient id="pk" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity="0"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<style>
text{font:500 12.5px 'JetBrains Mono',ui-monospace,Consolas,monospace}.h{font-weight:700;font-size:13.5px}
.bg{fill:#ffffff}.t{fill:#24292f}.a{fill:#0e7490}.dim{fill:#57606a}.panel{fill:#f6f8fa;stroke:#d0d7de}.edge{fill:#0e7490}
.tile{animation:rise ${LOOP}s ease-out infinite}
.edge{transform-box:fill-box;transform-origin:top;animation:edge ${LOOP}s ease-out infinite}
.live{fill:#22c55e;animation:pulse 1.6s ease-in-out infinite}
.ring{fill:none;stroke:#22c55e;stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:ring 1.6s ease-out infinite}
.beam{fill:none;stroke:#22d3ee;stroke-width:1.5;stroke-linecap:round;stroke-dasharray:70 ${perim - 70};filter:url(#glow);animation:beam 4.4s linear infinite}
.cover{transform-box:fill-box;transform-origin:right;animation:type ${LOOP}s steps(46) infinite}.cv{fill:#ffffff}.cvp{fill:#f6f8fa}
.tile,.edge,.cover{animation-fill-mode:backwards}
.track{stroke:#d0d7de;stroke-width:1}
.packet{fill:#22d3ee;filter:url(#glow);animation:flow 3s cubic-bezier(.6,0,.4,1) infinite}
.scan{animation:scan 4s linear infinite}
.cur{fill:#22d3ee;animation:blink 1s steps(1) infinite}
@keyframes ring{0%{transform:scale(1);opacity:.8}100%{transform:scale(3.2);opacity:0}}
@keyframes beam{to{stroke-dashoffset:-${perim}}}
@keyframes type{0%{transform:scaleX(1)}14%,90%{transform:scaleX(0)}99%,100%{transform:scaleX(1)}}
@keyframes flow{0%{transform:translateX(0);opacity:0}10%,90%{opacity:1}100%{transform:translateX(${MW - PAD * 2 - 40}px);opacity:0}}
@keyframes rise{0%{opacity:0;transform:translateY(10px)}10%,88%{opacity:1;transform:translateY(0)}98%,100%{opacity:0;transform:translateY(10px)}}
@keyframes edge{0%,6%{transform:scaleY(0)}20%,88%{transform:scaleY(1)}98%,100%{transform:scaleY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes scan{0%{transform:translateY(-40px)}100%{transform:translateY(${MH}px)}}
@keyframes blink{0%{opacity:1}50%{opacity:0}}
@media (prefers-color-scheme:dark){.bg{fill:#0d1117}.t{fill:#c9d1d9}.a{fill:#22d3ee}.dim{fill:#8b98a6}.panel{fill:#161b22;stroke:#30363d}.edge{fill:#22d3ee}.track{stroke:#30363d}.cv{fill:#0d1117}.cvp{fill:#161b22}}
@media (prefers-reduced-motion:reduce){.tile,.edge,.live,.cur{animation:none}.scan,.beam,.ring,.packet,.cover{display:none}}
</style>
<rect class="bg" width="100%" height="100%" rx="6"/>
<text x="${PAD}" y="24"><tspan class="a" font-weight="700">agent@${user}</tspan><tspan class="dim"> ~ $ </tspan><tspan class="t">systems --status production</tspan></text><rect class="cover cv" x="${PAD}" y="9" width="350" height="20"/><rect class="cur" x="${PAD + 352}" y="13" width="7" height="14"/>
<text class="dim" x="${PAD}" y="46">${t.running}</text>
${cards}
<text x="${PAD}" y="${MH - 30}">${footer}</text>
<line class="track" x1="${PAD}" y1="${MH - 13}" x2="${MW - PAD}" y2="${MH - 13}"/>
<rect class="packet" x="${PAD}" y="${MH - 14.5}" width="40" height="3" rx="1.5" fill="url(#pk)"/>
<rect class="packet" x="${PAD}" y="${MH - 14.5}" width="40" height="3" rx="1.5" fill="url(#pk)" style="animation-delay:1.5s"/>
<rect class="scan" x="0" y="0" width="${MW}" height="40" fill="url(#scan)" pointer-events="none"/>
</svg>
`;
writeFileSync(out('agent-metrics', lang), metrics);
}
console.log(`ok: en+es cards, ${visits.length} active days, ${cal.totalContributions} contributions, ${DUR}s loop`);
