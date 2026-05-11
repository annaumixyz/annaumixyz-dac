# AnnaumiXYZ DAC Toolkit

Automation toolkit for interacting with DAC ecosystem tasks, wallet flows, campaigns, and routine testnet activity.

## Features

- Multi-account execution
- Wallet session management
- Faucet & campaign automation
- Task orchestration
- Proxy rotation support
- Interactive terminal dashboard
- Lightweight Node.js architecture

## Requirements

- Node.js 20+
- npm or pnpm
- Testnet wallet(s)

## Installation

```bash
npm install
```

Copy example configs before running:

```bash
cp dac.config.example.json dac.config.json
cp proxies.config.example.json proxies.config.json
```

## Run

Start interactive menu:

```bash
npm start
```

Direct command usage:

```bash
node src/cli/main.js status-all
node src/cli/main.js wallet-login-all
node src/cli/main.js run-all --concurrency 3
```

## Project Structure

```txt
src/
  api/
  auth/
  chain/
  cli/
  config/
  domain/
  orchestration/
  tui/
  utils/
```

## Security Notes

- Never commit private keys
- Use testnet wallets only
- Keep proxy/session files private
- Store sensitive data locally

## Disclaimer

This repository is intended for educational and personal automation workflows.
Use responsibly and comply with platform rules.

## Donate
EVM : 0x3be0650d0d0408a0de0fd761ba2c88ee430a0af0
