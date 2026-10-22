"""Renders the neofetch-style profile card (assets/neofetch-dark.svg and -light.svg).

Run daily by .github/workflows/neofetch.yml so Uptime stays current.
usage: python tools/neofetch.py
"""
import datetime as dt
import os
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_SINCE = dt.date(2025, 8, 1)  # first AI agent in production (clinic, Aug 2025)

THEMES = {
    'dark': {'bg': '#0d1117', 'border': '#30363d', 'text': '#c9d1d9', 'key': '#22d3ee', 'dots': '#3b4654', 'art': '#22d3ee', 'add': '#3fb950', 'cursor': '#22d3ee'},
    'light': {'bg': '#ffffff', 'border': '#d0d7de', 'text': '#24292f', 'key': '#0e7490', 'dots': '#c4ccd4', 'art': '#0e7490', 'add': '#1a7f37', 'cursor': '#0e7490'},
}


def uptime(today, lang):
    months = (today.year - AI_SINCE.year) * 12 + today.month - AI_SINCE.month
    y, m = divmod(months, 12)
    if lang == 'es':
        parts = ([f'{y} año' + ('s' if y != 1 else '')] if y else []) + [f'{m} mes' + ('es' if m != 1 else '')]
        return ', '.join(parts) + ' construyendo IA'
    parts = ([f'{y} year' + ('s' if y != 1 else '')] if y else []) + [f'{m} month' + ('s' if m != 1 else '')]
    return ', '.join(parts) + ' building AI'


# Only the values that change between languages; keys stay in English like a real neofetch.
TEXT = {
    'en': {'host': 'Ecomfy Lead · Miami, FL (remote)', 'edu': 'B.Eng. Computer Science · UASS',
           'real': 'Spanish, English', 'wf': 'multi-agent, delegation, subagents',
           'prod': 'WhatsApp AI agent, AI Receptionist',
           'label': 'Humberto Rivero, AI Automation Engineer: terminal-style profile card'},
    'es': {'host': 'Ecomfy Lead · Miami, FL (remoto)', 'edu': 'Ing. Informática · UASS',
           'real': 'Español, Inglés', 'wf': 'multiagentes, delegación, subagentes',
           'prod': 'Agente IA en WhatsApp, Recepcionista IA',
           'label': 'Humberto Rivero, AI Automation Engineer: tarjeta de perfil estilo terminal'},
}


def info_lines(today, lang):
    t = TEXT[lang]
    return [
        ('title', 'humberto@rivero'),
        ('rule', ''),
        ('kv', 'OS', 'Windows 11'),
        ('kv', 'Uptime', uptime(today, lang)),
        ('kv', 'Host', t['host']),
        ('kv', 'Kernel', 'AI Automation Engineer'),
        ('kv', 'Education', t['edu']),
        ('kv', 'IDE', 'VS Code, Cursor'),
        ('kv', 'Terminal', 'Warp, PowerShell, Bash'),
        ('gap',),
        ('kv', 'Languages.Programming', 'JavaScript, Python, SQL'),
        ('kv', 'Languages.Computer', 'JSON, YAML, Markdown'),
        ('kv', 'Languages.Real', t['real']),
        ('gap',),
        ('kv', 'AI.Models', 'OpenAI, Claude, Gemini'),
        ('kv', 'AI.Tools', 'n8n, MCP, Whisper, tool calling'),
        ('kv', 'AI.CodeAgents', 'Claude Code, OpenCode, Pi'),
        ('kv', 'AI.Workflow', t['wf']),
        ('kv', 'Agents.Production', t['prod']),
        ('kv', 'Data.Pipelines', 'Apify, Clay, Jina, PostgreSQL'),
        ('kv', 'Web', 'Next.js, React, Tailwind'),
        ('gap',),
        ('section', 'Contact'),
        ('kv', 'Email', 'humbertojavierrivero@gmail.com'),
        ('kv', 'LinkedIn', 'humbertorivero-ai'),
    ]


WIDTH_CH = 60  # characters in the info column
ART_W = 360  # px width of the portrait column


def render(theme, today, art, lang):
    c = THEMES[theme]
    x0, art_x, y0, lh = 410, 24, 34, 20
    rows = []
    for i, ln in enumerate(info_lines(today, lang)):
        y = y0 + i * lh
        delay = f'{.35 + i * .07:.2f}s'
        if ln[0] == 'title':
            body = f'<tspan fill="{c["key"]}" font-weight="700">{escape(ln[1])}</tspan>'
        elif ln[0] == 'rule':
            body = f'<tspan fill="{c["dots"]}">{"─" * WIDTH_CH}</tspan>'
        elif ln[0] == 'section':
            head = f'- {ln[1]} '
            body = f'<tspan fill="{c["text"]}">{escape(head)}</tspan><tspan fill="{c["dots"]}">{"─" * (WIDTH_CH - len(head))}</tspan>'
        elif ln[0] == 'kv':
            key, val = ln[1], ln[2]
            dots = '.' * max(2, WIDTH_CH - len(key) - len(val) - 3)
            body = (f'<tspan fill="{c["key"]}">{escape(key)}</tspan><tspan fill="{c["text"]}">:</tspan>'
                    f'<tspan fill="{c["dots"]}"> {dots} </tspan><tspan fill="{c["text"]}">{escape(val)}</tspan>')
        else:
            continue
        rows.append(f'<text x="{x0}" y="{y}" class="ln" style="animation-delay:{delay}">{body}</text>')
    last_y = y0 + (len(info_lines(today, lang)) - 1) * lh

    # Braille glyphs come from whatever font the viewer has, so each line is stretched to a fixed
    # width (textLength) to keep columns aligned; dot pitch is kept square: ART_W / (2*cols) == ART_LH / 4.
    art_lh = ART_W / (2 * len(art[0])) * 4
    art_rows = ''.join(
        f'<tspan x="{art_x}" dy="{0 if j == 0 else art_lh:.2f}" textLength="{ART_W}" lengthAdjust="spacingAndGlyphs">{escape(line)}</tspan>'
        for j, line in enumerate(art))
    art_h = len(art) * art_lh + 20
    height = max(last_y + 34, art_h + 30)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="985" height="{height:.0f}" viewBox="0 0 985 {height:.0f}" role="img" aria-label="{TEXT[lang]['label']}">
<style>
  text {{ font-family: Consolas, 'Courier New', monospace; font-size: 15px; white-space: pre; }}
  .art {{ font-family: 'Segoe UI Symbol', 'DejaVu Sans Mono', 'Apple Braille', monospace; font-size: {art_lh * .92:.1f}px; fill: {c["art"]}; animation: scan 1.6s cubic-bezier(.25,.1,.25,1) both; }}
  @keyframes scan {{ from {{ clip-path: inset(0 0 100% 0); }} to {{ clip-path: inset(0 0 0 0); }} }}
  .ln {{ opacity: 0; animation: in .35s ease-out forwards; }}
  .cursor {{ fill: {c["cursor"]}; animation: blink 1s steps(1) infinite; animation-delay: 2.2s; opacity: 0; }}
  @keyframes in {{ from {{ opacity: 0; transform: translateX(-6px); }} to {{ opacity: 1; transform: none; }} }}
  @keyframes blink {{ 0%, 49% {{ opacity: 1; }} 50%, 100% {{ opacity: 0; }} }}
  @media (prefers-reduced-motion: reduce) {{ .ln, .art {{ animation: none; opacity: 1; }} .cursor {{ animation: none; opacity: 1; }} }}
</style>

<rect width="985" height="{height:.0f}" rx="12" fill="{c["bg"]}" stroke="{c["border"]}"/>
<text class="art" y="{y0}">{art_rows}</text>
{chr(10).join(rows)}
<rect class="cursor" x="{x0}" y="{last_y + 10}" width="9" height="17"/>
</svg>
'''


def main():
    today = dt.date.today()
    art = open(os.path.join(ROOT, 'assets', 'portrait-braille.txt'), encoding='utf-8').read().rstrip('\n').split('\n')
    # English keeps the plain names (default README); Spanish gets a .es suffix.
    for lang in TEXT:
        for theme in THEMES:
            suffix = '' if lang == 'en' else f'.{lang}'
            path = os.path.join(ROOT, 'assets', f'neofetch-{theme}{suffix}.svg')
            open(path, 'w', encoding='utf-8').write(render(theme, today, art, lang))
    print(uptime(today, 'en'), '|', uptime(today, 'es'))


if __name__ == '__main__':
    main()
