function normalizeTaskSummary(profile) {
  const labels = [];
  if (profile?.telegram_joined) labels.push('telegram');
  if (profile?.discord_linked) labels.push('discord');
  if (profile?.x_followed) labels.push('x-follow');
  if (profile?.x_linked) labels.push('x-link');
  if (profile?.email_verified) labels.push('email');
  if (profile?.faucet_claimed) labels.push('faucet');
  return { done: labels.length, total: 6, labelsDone: labels };
}

function finiteNumber(value, fallback = null) {
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeDaccValue(raw) {
  if (raw == null || raw === '') return null;
  const num = Number(raw);
  if (!Number.isFinite(num)) return null;
  // If value > 1000, it's likely in wei (smallest unit). Convert to ether.
  // Normal DACC balances in ether format are < 1000 (testnet faucet gives small amounts).
  if (num > 1000) {
    try {
      const { ethers } = require('ethers');
      return ethers.formatEther(BigInt(String(raw).split('.')[0]));
    } catch { return String(raw); }
  }
  return String(raw);
}

function normalizeStatus({ accountName, wallet, profileData = null, networkData = null, catalogData = null, stale = false, errors = [] }) {
  const profile = profileData || {};
  const badgeTotal = Array.isArray(catalogData?.badges) ? catalogData.badges.length : null;
  const normalizedErrors = [
    ...errors,
    profileData?._error || null,
    networkData?._error || null,
    catalogData?._error || null,
  ].filter(Boolean);
  const inceptionQeVal = finiteNumber(profile.qe_balance);
  const waitlistQeVal = finiteNumber(profile.waitlist_qe, 0);
  const totalQe = inceptionQeVal != null
    ? inceptionQeVal + waitlistQeVal
    : finiteNumber(profile.qe);
  const rawDacc = profile.dacc_balance ?? profile.dacc ?? null;
  return {
    accountName,
    wallet: wallet || profile.wallet_address || null,
    qe: totalQe,
    inceptionQe: inceptionQeVal,
    waitlistQe: waitlistQeVal,
    dacc: normalizeDaccValue(rawDacc),
    rank: profile.user_rank ?? profile.rank ?? null,
    badges: profile.badges_count ?? (Array.isArray(profile.badges) ? profile.badges.length : null),
    badgeTotal,
    streak: profile.streak ?? profile.streak_days ?? null,
    multiplier: profile.multiplier ?? profile.qe_multiplier ?? null,
    txCount: profile.tx_count ?? null,
    faucetAvailable: profile.faucet_available ?? null,
    faucetCooldownSeconds: profile.faucet_cooldown_seconds ?? profile.faucet_seconds_left ?? null,
    referralCount: profile.referral_count ?? null,
    referralCode: profile.referral_code ?? null,
    socials: {
      telegramJoined: typeof profile.telegram_joined === 'boolean' ? profile.telegram_joined : false,
      discordLinked: typeof profile.discord_linked === 'boolean' ? profile.discord_linked : false,
      xFollowed: typeof profile.x_followed === 'boolean' ? profile.x_followed : false,
      xLinked: typeof profile.x_linked === 'boolean' ? profile.x_linked : false,
      emailVerified: typeof profile.email_verified === 'boolean' ? profile.email_verified : false,
    },
    taskSummary: normalizeTaskSummary(profile),
    network: {
      blockNumber: networkData?.block_number ?? null,
      tps: networkData?.tps ?? null,
      blockTime: networkData?.block_time ?? null,
    },
    errors: normalizedErrors,
    stale: stale || !!profileData?._stale || !!networkData?._stale || !!catalogData?._stale,
    updatedAt: new Date().toISOString(),
  };
}

function buildStatusFromProfile(profile, catalog, { badgeTotalFromCatalog } = {}) {
  const badgeTotal = typeof badgeTotalFromCatalog === 'function' ? badgeTotalFromCatalog(catalog) : null;
  // API may return total QE as `qe` directly, or split as `qe_balance` + `waitlist_qe`
  // Prefer the canonical v1 field names (`qe_balance`, `user_rank`) when present.
  const inceptionQeVal = finiteNumber(profile.qe_balance, 0);
  const waitlistQeVal = Number(profile.waitlist_qe ?? 0);
  const totalQe = profile.qe_balance != null
    ? inceptionQeVal + waitlistQeVal
    : (profile.qe != null ? finiteNumber(profile.qe, 0) : (inceptionQeVal + waitlistQeVal));
  const rawDacc = profile.dacc_balance ?? profile.dacc ?? '0';
  return {
    qe: totalQe,
    inceptionQe: profile.qe_balance != null ? inceptionQeVal : totalQe,
    waitlistQe: waitlistQeVal,
    dacc: normalizeDaccValue(rawDacc) || '0',
    txCount: profile.tx_count ?? profile.txCount ?? 0,
    rank: profile.user_rank ?? profile.rank ?? '?',
    badges: profile.badges_count ?? (Array.isArray(profile.badges) ? profile.badges.length : 0),
    badgeTotal,
    badgeCatalogError: catalog?.error || null,
    streak: profile.streak ?? profile.streak_days ?? 0,
    multiplier: profile.multiplier ?? profile.qe_multiplier ?? 1.0,
    faucetAvailable: profile.faucet_available ?? null,
    faucetCooldownSeconds: profile.faucet_cooldown_seconds ?? profile.faucet_seconds_left ?? null,
    discordLinked: profile.discord_linked ?? false,
    xLinked: profile.x_linked ?? false,
    telegramJoined: profile.telegram_joined ?? false,
    wallet: profile.wallet_address ?? profile.wallet ?? '',
    profile,
  };
}

async function fetchDashboardSnapshot(bot, { force = false } = {}) {
  const cachedStatus = !force ? bot.getCachedValue('status') : null;
  const cachedNetwork = !force ? bot.getCachedValue('network') : null;
  const cachedCatalog = !force ? bot.getCachedValue('badgeCatalog') : null;
  if (cachedStatus && cachedNetwork && cachedCatalog) {
    return { status: cachedStatus, network: cachedNetwork, catalog: cachedCatalog };
  }

  const profile = (!force && cachedStatus?.profile)
    ? cachedStatus.profile
    : await bot.withCache('profile', 15000, () => bot.api('GET', '/profile/'), { force });

  if (profile.error && profile.qe == null && profile.qe_balance == null) {
    return {
      status: { error: profile.error, statusCode: profile._status || 0 },
      network: cachedNetwork || await bot.network({ force }),
      catalog: cachedCatalog || null,
    };
  }

  const [catalog, network] = await Promise.all([
    cachedCatalog || bot.badgeCatalog({ force }),
    cachedNetwork || bot.network({ force }),
  ]);

  const status = (!force && cachedStatus && cachedCatalog)
    ? cachedStatus
    : buildStatusFromProfile(profile, catalog, { badgeTotalFromCatalog: bot.badgeTotalFromCatalog });

  // On-chain fallback: if API didn't return DACC balance, read from chain
  const apiDaccMissing = status.dacc == null || status.dacc === '' || status.dacc === '0';
  if (apiDaccMissing && bot.walletAddress && bot.provider) {
    try {
      const { ethers } = require('ethers');
      const rawBalance = await bot.provider.getBalance(bot.walletAddress);
      const chainDacc = ethers.formatEther(rawBalance);
      // Only override if chain shows non-zero (avoids overwriting valid '0' from API)
      if (Number(chainDacc) > 0) {
        status.dacc = chainDacc;
        status.daccSource = 'chain';
      }
    } catch { /* chain read failed, keep API value */ }
  }

  bot.runtimeCache.status = { value: status, expiresAt: Date.now() + 15000, pending: null };
  return { status, network, catalog };
}

async function status(bot, { force = false } = {}) {
  const snapshot = await fetchDashboardSnapshot(bot, { force });
  return snapshot.status;
}

module.exports = {
  normalizeTaskSummary,
  normalizeStatus,
  buildStatusFromProfile,
  fetchDashboardSnapshot,
  status,
};
