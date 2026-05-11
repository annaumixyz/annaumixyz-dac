<div align="center">

# ◆ ANNAUMIXYZ DAC

```txt
╔════════════════════════════════════════╗
║                                        ║
║              ANNAUMIXYZ                ║
║                                        ║
║            DAC AUTOMATION              ║
║                                        ║
╚════════════════════════════════════════╝
```

### Multi-Account DAC Automation Toolkit

<p>
Live TUI • Smart Tracking • Proxy Rotation • Faucet Loop • Campaign Runner
</p>

</div>

---

# ✦ Installation

```bash
git clone https://github.com/annaumixyz/annaumixyz-dac.git
cd annaumixyz-dac
npm install
```

---

# ✦ Configuration

Buat file config dari example:

```bash
cp dac.config.example.json dac.config.json
```

Optional kalau mau pakai proxy:

```bash
cp proxies.config.example.json proxies.config.json
```

Edit config utama:

```bash
nano dac.config.json
```

Format akun ada di:

```txt
dac.config.json
```

Bukan:

```txt
config/accounts.json
```

---

# ✦ Launch

```bash
npm start
```

---

# ✦ Requirements

- Node.js 20+
- npm
- One or more DAC testnet wallets
- Optional proxy config

---

# ✦ Features

- Multi-account automation
- Interactive terminal dashboard
- Live progress tracking
- Smart proxy rotation
- Faucet loop automation
- Badge & social task automation
- Mint scanner & mint automation
- Stake / burn execution
- Campaign automation
- Real-time transaction monitoring

---

# ✦ Commands

```bash
npm start
```

Launch interactive TUI.

```bash
node src/cli/main.js status-all
```

Check all configured accounts.

```bash
node src/cli/main.js run-all
```

Run automation for all accounts.

---

# ✦ Notes

Pastikan file ini ada:

```bash
ls dac.config.json
```

Kalau belum ada, jalankan:

```bash
cp dac.config.example.json dac.config.json
```

---

# ✦ Disclaimer

This project is provided for educational and research purposes only.

Use responsibly.

---

<div align="center">

## ◆ ANNAUMIXYZ

Terminal Automation Architecture

</div>

## Donate

EVM : 0x3be0650d0d0408a0de0fd761ba2c88ee430a0af0

## License

This project is private and not licensed for redistribution.
