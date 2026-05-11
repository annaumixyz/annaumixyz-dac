// ─── ANSI escape codes ──────────────────────────────────

const ANSI = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  white: '\x1b[37m',

  brightCyan: '\x1b[96m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightWhite: '\x1b[97m',
  brightRed: '\x1b[91m',

  gray: '\x1b[38;5;245m',
  darkGray: '\x1b[38;5;238m',
  lightGray: '\x1b[38;5;250m',
};

const C = {
  border: ANSI.darkGray,
  title: `${ANSI.bold}${ANSI.brightWhite}`,
  label: ANSI.gray,
  value: ANSI.brightWhite,
  primary: ANSI.brightCyan,
  success: ANSI.brightGreen,
  warn: ANSI.brightYellow,
  error: ANSI.red,
  errorText: ANSI.brightRed,
  muted: ANSI.darkGray,
  dim: ANSI.dim,
  accent: ANSI.cyan,
};

const theme = {
  border: '─',
  left: '│',
  right: '│',
  topLeft: '╭',
  topRight: '╮',
  bottomLeft: '╰',
  bottomRight: '╯',
  dividerLeft: '├',
  dividerRight: '┤',

  doubleBorder: '═',
  doubleLeft: '║',
  doubleRight: '║',
  doubleTopLeft: '╔',
  doubleTopRight: '╗',
  doubleBottomLeft: '╚',
  doubleBottomRight: '╝',
  doubleDividerLeft: '╠',
  doubleDividerRight: '╣',

  symbols: {
    ok: '✓',
    fail: '✗',
    stale: '○',
    bullet: '•',
    arrow: '→',
    dash: '─',
    star: '★',
    diamond: '◆',
    circle: '○',
    dot: '·',
    tri: '▸',
    pipe: '│',
  },
};

const BANNER = [
  '  ╔═══════════════════════════════════════════════════╗',
  '  ║                                                   ║',
  '  ║              A N N A U M I X Y Z                  ║',
  '  ║                                                   ║',
  '  ║                 D A C   B O T                     ║',
  '  ║                                                   ║',
  '  ╚═══════════════════════════════════════════════════╝',
];

function color(text, code) {
  if (!process.stdout.isTTY || !code) return String(text);
  return `${code}${text}${ANSI.reset}`;
}

function stripAnsi(text) {
  return String(text || '').replace(/\x1b\[[0-9;]*m/g, '');
}

function colorBanner() {
  return BANNER.map((line) => color(line, ANSI.cyan)).join('\n');
}

module.exports = { theme, ANSI, C, color, stripAnsi, colorBanner };
