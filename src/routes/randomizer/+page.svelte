<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { Gift, Play, RotateCcw, Shuffle, Sparkles, Square, Trash2, Trophy } from 'lucide-svelte';

  type Toast = {
    id: number;
    message: string;
    tone: 'success' | 'warning' | 'error';
  };

  type ConfettiPiece = {
    id: number;
    left: number;
    drift: number;
    sway: number;
    delay: number;
    duration: number;
    size: number;
    rotation: number;
    halfSpin: number;
    spin: number;
    color: string;
  };

  type DrawnEntry = {
    id: number;
    name: string;
  };

  type ShuffleResult = {
    names: string[];
    usesWeakRandomization: boolean;
  };

  type StoredRandomization = {
    timestamp: string;
    rawInput: string;
    randomizedNames: string[];
    winnerCount: number;
    rewardCounts: number[];
  };

  const COUNTDOWN_TIME = 5;
  const DEFAULT_WINNERS = 3;
  const DEFAULT_REWARDS = 1;
  const LOCAL_STORAGE_KEY_PREFIX = 'randomizer:draw:';
  const UINT32_RANGE = 0x100000000;
  const CONFETTI_COLORS = ['#f59e0b', '#e8e6f0', '#68668a', '#22c55e', '#38bdf8'];
  const RELATIVE_TIME_UNITS: { unit: Intl.RelativeTimeFormatUnit; milliseconds: number }[] = [
    { unit: 'year', milliseconds: 1000 * 60 * 60 * 24 * 365 },
    { unit: 'month', milliseconds: 1000 * 60 * 60 * 24 * 30 },
    { unit: 'week', milliseconds: 1000 * 60 * 60 * 24 * 7 },
    { unit: 'day', milliseconds: 1000 * 60 * 60 * 24 },
    { unit: 'hour', milliseconds: 1000 * 60 * 60 },
    { unit: 'minute', milliseconds: 1000 * 60 },
    { unit: 'second', milliseconds: 1000 }
  ];
  const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const localTimestampFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  let rawInput = $state('');
  let winnerCount = $state(DEFAULT_WINNERS);
  let rewardCounts = $state<number[]>(Array.from({ length: DEFAULT_WINNERS }, () => DEFAULT_REWARDS));
  let storedRandomizations = $state<StoredRandomization[]>([]);

  let randomizedNames = $state<string[]>([]);
  let left = $state<DrawnEntry[]>([]);
  let drawn = $state<DrawnEntry[]>([]);
  let submittedWinnerCount = $state(DEFAULT_WINNERS);
  let submittedRewardCounts = $state<number[]>([]);

  let autoplay = $state(false);
  let timeLeft = $state<number | null>(null);
  let loading = $state(false);
  let toasts = $state<Toast[]>([]);
  let confettiPieces = $state<ConfettiPiece[]>([]);
  let now = $state(Date.now());

  let toastId = 0;
  let countdownTimer: ReturnType<typeof setInterval> | undefined;
  let loadingTimer: ReturnType<typeof setTimeout> | undefined;
  let relativeTimeTimer: ReturnType<typeof setInterval> | undefined;
  let completeWasAnnounced = false;

  const hasResults = $derived(randomizedNames.length > 0);
  const drawComplete = $derived(drawn.length > 0 && left.length === 0);

  $effect(() => {
    const nextWinnerCount = normalizePositiveInteger(winnerCount, DEFAULT_WINNERS);

    if (rewardCounts.length > nextWinnerCount) {
      rewardCounts = rewardCounts.slice(0, nextWinnerCount);
    }

    if (rewardCounts.length < nextWinnerCount) {
      rewardCounts = [
        ...rewardCounts,
        ...Array.from({ length: nextWinnerCount - rewardCounts.length }, () => DEFAULT_REWARDS)
      ];
    }
  });

  $effect(() => {
    if (drawComplete && !completeWasAnnounced) {
      confettiPieces = createConfettiPieces();
      completeWasAnnounced = true;
    }

    if (!drawComplete) {
      completeWasAnnounced = false;
    }
  });

  onMount(() => {
    loadStoredRandomizations();

    relativeTimeTimer = setInterval(() => {
      now = Date.now();
    }, 60_000);
  });

  onDestroy(() => {
    clearCountdown();
    if (loadingTimer) clearTimeout(loadingTimer);
    if (relativeTimeTimer) clearInterval(relativeTimeTimer);
  });

  const normalizePositiveInteger = (value: number, fallback: number) => {
    if (!Number.isFinite(value) || value <= 0) return fallback;
    return Math.floor(value);
  };

  const normalizeReward = (value: number) => {
    if (!Number.isFinite(value) || value < 0) return DEFAULT_REWARDS;
    return Math.floor(value);
  };

  const parseEntries = (input: string) =>
    input
      .split(/\n/)
      .map((name) => name.trim())
      .filter(Boolean);

  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((item) => typeof item === 'string');

  const isNumberArray = (value: unknown): value is number[] =>
    Array.isArray(value) && value.every((item) => Number.isFinite(item));

  const isStoredRandomization = (value: unknown): value is StoredRandomization => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

    const randomization = value as Partial<StoredRandomization>;

    return (
      typeof randomization.timestamp === 'string' &&
      typeof randomization.rawInput === 'string' &&
      isStringArray(randomization.randomizedNames) &&
      Number.isFinite(randomization.winnerCount) &&
      isNumberArray(randomization.rewardCounts)
    );
  };

  const getLocalStorage = () => {
    try {
      return globalThis.localStorage;
    } catch {
      return undefined;
    }
  };

  const getStoredRandomizationKey = (timestamp: string) => `${LOCAL_STORAGE_KEY_PREFIX}${timestamp}`;

  const readStoredRandomizations = () => {
    const storage = getLocalStorage();

    if (!storage) return [];

    const randomizations: StoredRandomization[] = [];

    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);

      if (!key?.startsWith(LOCAL_STORAGE_KEY_PREFIX)) continue;

      const storedDraw = storage.getItem(key);

      if (!storedDraw) continue;

      try {
        const parsed: unknown = JSON.parse(storedDraw);

        if (!isStoredRandomization(parsed)) continue;

        randomizations.push({
          ...parsed,
          timestamp: key.slice(LOCAL_STORAGE_KEY_PREFIX.length)
        });
      } catch {
        continue;
      }
    }

    return randomizations;
  };

  const getTimestampMilliseconds = (timestamp: string) => {
    const milliseconds = Date.parse(timestamp);
    return Number.isNaN(milliseconds) ? 0 : milliseconds;
  };

  const sortStoredRandomizations = (randomizations: StoredRandomization[]) =>
    randomizations.sort(
      (first, second) =>
        getTimestampMilliseconds(second.timestamp) - getTimestampMilliseconds(first.timestamp)
    );

  const loadStoredRandomizations = () => {
    now = Date.now();
    storedRandomizations = sortStoredRandomizations(readStoredRandomizations());
  };

  const saveStoredRandomization = (randomization: StoredRandomization) => {
    try {
      const storage = getLocalStorage();

      if (!storage) {
        throw new Error('localStorage is unavailable');
      }

      storage.setItem(getStoredRandomizationKey(randomization.timestamp), JSON.stringify(randomization));
      loadStoredRandomizations();
    } catch {
      addToast('Unable to save this randomization to local storage.', 'warning');
    }
  };

  const deleteStoredRandomization = (timestamp: string) => {
    try {
      const storage = getLocalStorage();

      if (!storage) {
        throw new Error('localStorage is unavailable');
      }

      storage.removeItem(getStoredRandomizationKey(timestamp));
      loadStoredRandomizations();
      addToast('Stored randomization deleted.', 'success');
    } catch {
      addToast('Unable to delete this stored randomization.', 'error');
    }
  };

  const normalizeRewardsForWinnerCount = (count: number, rewards: number[]) =>
    Array.from({ length: count }, (_, index) => normalizeReward(rewards[index] ?? DEFAULT_REWARDS));

  const replayStoredRandomization = (randomization: StoredRandomization) => {
    const nextWinnerCount = normalizePositiveInteger(randomization.winnerCount, DEFAULT_WINNERS);
    const normalizedRewards = normalizeRewardsForWinnerCount(nextWinnerCount, randomization.rewardCounts);
    const randomized = [...randomization.randomizedNames];

    clearCountdown();
    autoplay = false;
    loading = false;
    rawInput = randomization.rawInput;
    winnerCount = nextWinnerCount;
    rewardCounts = normalizedRewards;
    submittedWinnerCount = nextWinnerCount;
    submittedRewardCounts = normalizedRewards;
    randomizedNames = randomized;
    left = randomized.map((name, index) => ({ id: index, name }));
    drawn = [];
    confettiPieces = [];

    addToast('Stored randomization loaded.', 'success');
  };

  const formatRelativeTimestamp = (timestamp: string) => {
    const timestampMilliseconds = getTimestampMilliseconds(timestamp);

    if (timestampMilliseconds === 0) return timestamp;

    const difference = timestampMilliseconds - now;
    const absoluteDifference = Math.abs(difference);
    const unit =
      RELATIVE_TIME_UNITS.find(({ milliseconds }) => absoluteDifference >= milliseconds) ??
      RELATIVE_TIME_UNITS[RELATIVE_TIME_UNITS.length - 1];

    return relativeTimeFormatter.format(Math.round(difference / unit.milliseconds), unit.unit);
  };

  const formatLocalTimestamp = (timestamp: string) => {
    const timestampMilliseconds = getTimestampMilliseconds(timestamp);

    if (timestampMilliseconds === 0) return timestamp;

    return localTimestampFormatter.format(new Date(timestampMilliseconds));
  };

  const getStoredNamesPreview = (randomization: StoredRandomization) => {
    const preview = parseEntries(randomization.rawInput).join(', ');

    if (preview.length <= 100) return preview;

    return `${preview.slice(0, 97)}...`;
  };

  const supportsWebCrypto = () => typeof globalThis.crypto?.getRandomValues === 'function';

  const getSecureRandomInt = (maxExclusive: number) => {
    if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > UINT32_RANGE) {
      throw new Error('Random range must be a positive 32-bit integer');
    }

    const randomSource = globalThis.crypto;

    if (!randomSource?.getRandomValues) {
      throw new Error('Secure random values are unavailable');
    }

    const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
    const buffer = new Uint32Array(1);

    do {
      randomSource.getRandomValues(buffer);
    } while (buffer[0] >= limit);

    return buffer[0] % maxExclusive;
  };

  const shuffleWithWebCrypto = (names: string[]) => {
    const randomized = [...names];

    for (let index = randomized.length - 1; index > 0; index -= 1) {
      const swapIndex = getSecureRandomInt(index + 1);
      [randomized[index], randomized[swapIndex]] = [randomized[swapIndex], randomized[index]];
    }

    return randomized;
  };

  const shuffleWithMathRandom = (names: string[]) => {
    const unrandomized = [...names];
    const randomized: string[] = [];

    while (unrandomized.length > 0) {
      const nextIndex = Math.floor(Math.random() * unrandomized.length);
      const [pickedItem] = unrandomized.splice(nextIndex, 1);
      randomized.push(pickedItem);
    }

    return randomized;
  };

  const shuffle = (names: string[]): ShuffleResult => {
    if (!supportsWebCrypto()) {
      return {
        names: shuffleWithMathRandom(names),
        usesWeakRandomization: true
      };
    }

    return {
      names: shuffleWithWebCrypto(names),
      usesWeakRandomization: false
    };
  };

  const trackRandomization = (
    entryCount: number,
    submittedWinnerCount: number,
    submittedRewardCount: number,
    usesWeakRandomization: boolean
  ) => {
    if (typeof window === 'undefined') return;

    window.gtag?.('event', 'randomizer_randomize', {
      entry_count: entryCount,
      winner_count: submittedWinnerCount,
      reward_count: submittedRewardCount,
      uses_weak_randomization: usesWeakRandomization
    });
  };

  const placeToString = (place: number) => {
    const lastTwoDigits = place % 100;
    const lastDigit = place % 10;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${place}th place`;
    if (lastDigit === 1) return `${place}st place`;
    if (lastDigit === 2) return `${place}nd place`;
    if (lastDigit === 3) return `${place}rd place`;
    return `${place}th place`;
  };

  const addToast = (message: string, tone: Toast['tone']) => {
    const id = ++toastId;
    toasts = [{ id, message, tone }, ...toasts];

    setTimeout(() => {
      toasts = toasts.filter((toast) => toast.id !== id);
    }, 3600);
  };

  const updateRewardCount = (index: number, value: number) => {
    rewardCounts = rewardCounts.map((reward, currentIndex) =>
      currentIndex === index ? normalizeReward(value) : reward
    );
  };

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const names = parseEntries(rawInput);

    if (names.length === 0) {
      addToast('Please input some data before submitting.', 'error');
      return;
    }

    clearCountdown();
    autoplay = false;
    loading = true;

    if (loadingTimer) clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      loadingTimer = undefined;

      try {
        const nextWinnerCount = normalizePositiveInteger(winnerCount, DEFAULT_WINNERS);
        const normalizedRewards = normalizeRewardsForWinnerCount(nextWinnerCount, rewardCounts);
        const randomized = shuffle(names);
        const timestamp = new Date().toISOString();

        submittedWinnerCount = nextWinnerCount;
        submittedRewardCounts = normalizedRewards;
        randomizedNames = randomized.names;
        left = randomized.names.map((name, index) => ({ id: index, name }));
        drawn = [];
        confettiPieces = [];
        loading = false;

        saveStoredRandomization({
          timestamp,
          rawInput,
          randomizedNames: randomized.names,
          winnerCount: nextWinnerCount,
          rewardCounts: normalizedRewards
        });

        trackRandomization(
          names.length,
          nextWinnerCount,
          normalizedRewards.reduce((total, rewardCount) => total + rewardCount, 0),
          randomized.usesWeakRandomization
        );

        addToast('Randomization complete!', 'success');

        if (randomized.usesWeakRandomization) {
          addToast(
            'Using weaker randomization because this browser does not support the Web Crypto API.',
            'warning'
          );
        }
      } catch {
        loading = false;
        addToast('Secure randomization is unavailable in this browser.', 'error');
      }
    }, 120);
  };

  const clearCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = undefined;
    }

    timeLeft = null;
  };

  const startCountdown = () => {
    clearCountdown();
    timeLeft = COUNTDOWN_TIME;

    countdownTimer = setInterval(() => {
      if (timeLeft === null) return;

      if (timeLeft > 1) {
        timeLeft -= 1;
        return;
      }

      clearCountdown();
      drawNext();

      if (autoplay && left.length > 0) {
        startCountdown();
      } else {
        autoplay = false;
      }
    }, 1000);
  };

  const toggleAutoplay = () => {
    if (autoplay) {
      autoplay = false;
      clearCountdown();
      return;
    }

    if (left.length === 0) return;

    autoplay = true;
    startCountdown();
  };

  const drawNext = () => {
    if (left.length === 0) return;

    const [next, ...remaining] = left;
    left = remaining;
    drawn = [next, ...drawn];
  };

  const showNext = () => {
    drawNext();

    if (!autoplay) return;

    if (left.length > 0) {
      startCountdown();
      return;
    }

    autoplay = false;
    clearCountdown();
  };

  const drawAll = () => {
    if (left.length === 0) return;

    drawn = [...left].reverse().concat(drawn);
    left = [];
    autoplay = false;
    clearCountdown();
  };

  const resetDraw = () => {
    clearCountdown();
    autoplay = false;
    randomizedNames = [];
    left = [];
    drawn = [];
    submittedRewardCounts = [];
    confettiPieces = [];
  };

  const isWinner = (index: number) => left.length + index < submittedWinnerCount;

  const getPlace = (index: number) => 1 + randomizedNames.length - (drawn.length - index);

  const getRewardCount = (index: number) => submittedRewardCounts[index] ?? DEFAULT_REWARDS;

  const getRewardIndex = (index: number) => randomizedNames.length - (drawn.length - index);

  const createConfettiPieces = () =>
    Array.from({ length: 54 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      drift: Math.random() * 32 - 16,
      sway: Math.random() * 22 - 11,
      delay: Math.random() * 0.7,
      duration: 2.6 + Math.random() * 1.7,
      size: 6 + Math.random() * 7,
      rotation: Math.random() * 360,
      halfSpin: 210 + Math.random() * 260,
      spin: 420 + Math.random() * 520,
      color: CONFETTI_COLORS[index % CONFETTI_COLORS.length]
    }));
</script>

<svelte:head>
  <title>Randomizer - Andreas Sjoberg</title>
  <meta
    name="description"
    content="A simple randomizer for drawing names, winners and rewards in a clean integrated web tool."
  />
  <meta property="og:title" content="Randomizer - Andreas Sjoberg" />
  <meta
    property="og:description"
    content="Paste entries, randomize the order, reveal winners and celebrate the final draw."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://andreassjoberg.com/randomizer" />
  <link rel="icon" href="/favicon.png" />
</svelte:head>

<main class="relative min-h-screen overflow-hidden px-5 py-10 sm:px-6 lg:px-8">
  <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
    <div class="randomizer-glow randomizer-glow-a"></div>
    <div class="randomizer-glow randomizer-glow-b"></div>
  </div>

  {#if confettiPieces.length > 0 && drawComplete}
    <div class="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden="true">
      {#each confettiPieces as piece}
        <span
          class="confetti-piece"
          style="--left: {piece.left}%; --drift: {piece.drift}; --sway: {piece.sway}; --delay: {piece.delay}s; --duration: {piece.duration}s; --size: {piece.size}px; --rotation: {piece.rotation}deg; --half-spin: {piece.halfSpin}deg; --spin: {piece.spin}deg; --color: {piece.color};"
        ></span>
      {/each}
    </div>
  {/if}

  <div class="fixed left-1/2 top-5 z-50 flex w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 flex-col items-center gap-3" aria-live="polite">
    {#each toasts as toast}
      <div
        class="toast-shell"
        class:toast-warning={toast.tone === 'warning'}
        class:toast-error={toast.tone === 'error'}
      >
        <Sparkles class="h-4 w-4 shrink-0" />
        <span>{toast.message}</span>
      </div>
    {/each}
  </div>

  {#if loading}
    <div class="fixed inset-0 z-30 grid place-items-center bg-bg/70 backdrop-blur-sm" aria-label="Randomizing entries">
      <div class="loader" aria-hidden="true"><span></span><span></span><span></span></div>
    </div>
  {/if}

  <section class="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-10 py-8 sm:py-14">
    <header class="max-w-3xl">
      <a
        href="/"
        class="mb-8 inline-flex items-center rounded-full uppercase border border-bg-border px-3 py-1.5 text-xs font-medium text-text-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent"
      >
        Andreas Sjöberg
      </a>
      <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-accent">
        <Shuffle class="h-3.5 w-3.5" />
        Randomizer
      </div>
      <h1 class="font-heading text-4xl font-bold leading-tight text-text sm:text-6xl">
        Randomizer
      </h1>
      <p class="mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
        Paste one entry per line, choose how many winners to mark, then reveal the randomized order one by one or all at once.
      </p>
    </header>

    <div class={hasResults ? 'grid gap-6' : 'grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start'}>
      {#if !hasResults}
      <form class="tool-panel space-y-6" onsubmit={handleSubmit}>
        <div>
          <label for="entries" class="mb-2 block text-sm font-semibold text-text">Entries</label>
          <textarea
            id="entries"
            bind:value={rawInput}
            rows="10"
            class="themed-field min-h-60 w-full resize-y rounded-2xl px-4 py-3 text-sm leading-relaxed"
          ></textarea>
        </div>

        <div class="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <div>
            <label for="winners" class="mb-2 block text-sm font-semibold text-text">Winners</label>
            <input
              id="winners"
              type="number"
              min="1"
              bind:value={winnerCount}
              class="themed-field h-11 w-full rounded-full px-4 text-sm"
            />
          </div>

          <div>
            <span class="mb-2 block text-sm font-semibold text-text">Rewards per winner</span>
            <div class="reward-grid">
              {#each rewardCounts as reward, index}
                <label class="reward-input">
                  <span>{index + 1}</span>
                  <input
                    type="number"
                    min="0"
                    value={reward}
                    aria-label="Rewards for winner {index + 1}"
                    oninput={(event) => updateRewardCount(index, Number(event.currentTarget.value))}
                  />
                </label>
              {/each}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 pt-3 sm:flex-row">
          <button type="submit" class="btn-primary justify-center">
            <Shuffle class="h-4 w-4" />
            Randomize
          </button>
        </div>
      </form>
      {/if}

      <section class="tool-panel min-h-112" aria-label="Randomized output">
        {#if hasResults}
          <div class="mb-6 flex flex-col gap-4 border-b border-bg-border/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-semibold text-text">{left.length} left to reveal</p>
              <p class="mt-1 text-xs text-text-muted">
                {drawn.length} shown from {randomizedNames.length} randomized entries
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" class="control-button secondary sm:ml-auto" onclick={resetDraw}>
                <RotateCcw class="h-4 w-4" />
                Reset
              </button>
              <button type="button" class="control-button" disabled={left.length === 0} onclick={toggleAutoplay}>
                {#if autoplay}
                  <Square class="h-4 w-4" />
                  Stop {timeLeft !== null ? `(${timeLeft})` : ''}
                {:else}
                  <Play class="h-4 w-4" />
                  Autoplay
                {/if}
              </button>
              <button type="button" class="control-button" disabled={left.length === 0} onclick={showNext}>
                Show next
              </button>
              <button type="button" class="control-button secondary" disabled={left.length === 0} onclick={drawAll}>
                Show all
              </button>
            </div>
          </div>

          {#if drawn.length > 0}
            <ol class="space-y-3">
              {#each drawn as entry, index (entry.id)}
                {@const place = getPlace(index)}
                {@const winner = isWinner(index)}
                {@const rewards = getRewardCount(getRewardIndex(index))}
                <li
                  class="result-card"
                  class:winner-card={winner}
                  style="--reveal-delay: {Math.min(index, 8) * 70}ms;"
                >
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="result-icon" class:winner-icon={winner}>
                      {#if winner}
                        <Trophy class="h-4 w-4" />
                      {:else}
                        <span>{place}</span>
                      {/if}
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
                        {placeToString(place)}
                      </p>
                      <p class="mt-1 wrap-break-word text-lg font-semibold text-text">{entry.name}</p>
                    </div>
                  </div>
                  {#if winner && rewards > 0}
                    <div class="reward-badge">
                      <Gift class="h-3.5 w-3.5" />
                      {rewards}
                    </div>
                  {/if}
                </li>
              {/each}
            </ol>
          {:else}
            <div class="empty-state">
              <Trophy class="h-9 w-9 text-accent" />
              <p class="font-heading text-2xl font-bold text-text">Ready to reveal</p>
              <p class="max-w-sm text-center text-sm leading-relaxed text-text-muted">
                Start with autoplay, reveal the next entry manually, or show the complete randomized order.
              </p>
            </div>
          {/if}
        {:else}
          <div class="stored-draws-shell">
            <div class="empty-state" class:empty-state-compact={storedRandomizations.length > 0}>
              <Shuffle class="h-10 w-10 text-accent" />
              <p class="font-heading text-2xl font-bold text-text">No draw yet</p>
              {#if storedRandomizations.length === 0}
                <p class="max-w-sm text-center text-sm leading-relaxed text-text-muted">
                  Add entries and run the randomizer to create the reveal list.
                </p>
              {/if}
            </div>

            {#if storedRandomizations.length > 0}
              <ol class="stored-draws-list" aria-label="Stored randomizations">
                {#each storedRandomizations as randomization (randomization.timestamp)}
                  {@const localTimestamp = formatLocalTimestamp(randomization.timestamp)}
                  <li class="stored-draw-item">
                    <button
                      type="button"
                      class="stored-draw-replay"
                      onclick={() => replayStoredRandomization(randomization)}
                    >
                      <span class="stored-draw-time" title={localTimestamp}>
                        {formatRelativeTimestamp(randomization.timestamp)}
                      </span>
                      <span class="stored-draw-details">
                        <span class="stored-draw-winners">
                          {randomization.winnerCount}
                          {randomization.winnerCount === 1 ? 'winner' : 'winners'}
                        </span>
                        <span class="stored-draw-names">{getStoredNamesPreview(randomization)}</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="stored-draw-delete"
                      aria-label="Delete randomization from {localTimestamp}"
                      title="Delete randomization"
                      onclick={() => deleteStoredRandomization(randomization.timestamp)}
                    >
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </li>
                {/each}
              </ol>
            {/if}
          </div>
        {/if}
      </section>
    </div>
  </section>
</main>

<style>
  .tool-panel {
    border: 1px solid var(--color-bg-border);
    border-radius: 1.25rem;
    background:
      linear-gradient(145deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.01)),
      var(--color-bg-card);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 18px 60px rgba(0, 0, 0, 0.28);
    padding: 1.25rem;
  }

  @media (min-width: 640px) {
    .tool-panel {
      padding: 1.5rem;
    }
  }

  :global(button:not(:disabled)),
  :global(a[role='button']) {
    cursor: pointer;
  }

  .themed-field {
    color-scheme: dark;
    border: 1px solid var(--color-bg-border);
    background: #07070b;
    color: var(--color-text);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      inset 0 0 0 999px rgba(7, 7, 11, 0.72);
    outline: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background 0.2s ease;
  }

  .themed-field:focus {
    border-color: rgba(245, 158, 11, 0.55);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 0 0 3px rgba(245, 158, 11, 0.16);
  }

  .themed-field::placeholder {
    color: rgba(104, 102, 138, 0.75);
  }

  .reward-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 7.5rem;
    border: 1px solid var(--color-bg-border);
    border-radius: 999px;
    background: #07070b;
    padding: 0.35rem 0.45rem 0.35rem 0.85rem;
  }

  .reward-input span {
    width: 1.25rem;
    color: var(--color-accent);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .reward-input input {
    color-scheme: dark;
    min-width: 0;
    width: 100%;
    min-height: 2rem;
    border: 0;
    background: #07070b;
    color: var(--color-text);
    font-size: 0.875rem;
    outline: none;
  }

  .reward-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
    gap: 0.5rem;
  }

  .control-button {
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    justify-content: center;
    gap: 0.45rem;
    cursor: pointer;
    border-radius: 999px;
    border: 1px solid rgba(245, 158, 11, 0.28);
    background: rgba(245, 158, 11, 0.1);
    padding: 0.55rem 0.9rem;
    color: var(--color-accent);
    font-size: 0.8125rem;
    font-weight: 700;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .control-button:hover:not(:disabled) {
    transform: translateY(-1px);
    border-color: rgba(245, 158, 11, 0.46);
    background: rgba(245, 158, 11, 0.16);
  }

  .control-button.secondary {
    border-color: var(--color-bg-border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--color-text);
  }

  .control-button:disabled {
    cursor: not-allowed;
    opacity: 0.42;
  }

  .result-card {
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    min-height: 5rem;
    border: 1px solid var(--color-bg-border);
    border-radius: 1rem;
    background: rgba(7, 7, 11, 0.48);
    padding: 0.9rem;
    overflow: hidden;
    animation:
      reveal-card 0.72s cubic-bezier(0.16, 1, 0.3, 1) both,
      reveal-glow 1.05s ease-out both;
    animation-delay: var(--reveal-delay), var(--reveal-delay);
  }

  .result-card::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      105deg,
      transparent 0%,
      transparent 34%,
      rgba(245, 158, 11, 0.16) 48%,
      rgba(255, 255, 255, 0.08) 52%,
      transparent 66%,
      transparent 100%
    );
    transform: translateX(-125%);
    animation: reveal-sweep 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--reveal-delay) + 90ms);
  }

  .result-card > * {
    animation: reveal-content 0.58s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--reveal-delay) + 120ms);
  }

  .winner-card {
    border-color: rgba(245, 158, 11, 0.38);
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.13), rgba(7, 7, 11, 0.52));
  }

  .result-icon {
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid var(--color-bg-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.035);
    color: var(--color-text-muted);
    font-size: 0.75rem;
    font-weight: 800;
    animation: reveal-rank 0.68s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--reveal-delay) + 80ms);
  }

  .winner-icon {
    border-color: rgba(245, 158, 11, 0.45);
    background: rgba(245, 158, 11, 0.13);
    color: var(--color-accent);
  }

  .reward-badge {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 0.35rem;
    border-radius: 999px;
    border: 1px solid rgba(245, 158, 11, 0.28);
    background: rgba(245, 158, 11, 0.1);
    padding: 0.35rem 0.65rem;
    color: var(--color-accent);
    font-size: 0.8125rem;
    font-weight: 800;
  }

  .empty-state {
    display: grid;
    min-height: 22rem;
    place-items: center;
    align-content: center;
    gap: 0.85rem;
  }

  .empty-state-compact {
    min-height: auto;
    padding: 0.5rem 0 0.2rem;
  }

  .stored-draws-shell {
    display: grid;
    min-height: 22rem;
    align-content: start;
    gap: 1rem;
  }

  .stored-draws-list {
    display: grid;
    gap: 0.65rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .stored-draw-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 2.75rem;
    gap: 0.55rem;
    min-width: 0;
  }

  .stored-draw-replay,
  .stored-draw-delete {
    border: 1px solid var(--color-bg-border);
    background: rgba(7, 7, 11, 0.48);
    color: var(--color-text);
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease;
  }

  .stored-draw-replay:hover,
  .stored-draw-delete:hover {
    transform: translateY(-1px);
    border-color: rgba(245, 158, 11, 0.42);
    background: rgba(245, 158, 11, 0.1);
  }

  .stored-draw-replay {
    display: grid;
    min-width: 0;
    gap: 0.42rem;
    border-radius: 1rem;
    padding: 0.85rem 0.95rem;
    text-align: left;
  }

  .stored-draw-time {
    min-width: 0;
    overflow: hidden;
    color: var(--color-text);
    font-size: 1.12rem;
    font-weight: 800;
    line-height: 1.18;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stored-draw-details {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 0.6rem;
  }

  .stored-draw-winners {
    flex: 0 0 auto;
    border-radius: 999px;
    border: 1px solid rgba(245, 158, 11, 0.28);
    background: rgba(245, 158, 11, 0.1);
    padding: 0.18rem 0.5rem;
    color: var(--color-accent);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .stored-draw-names {
    min-width: 0;
    overflow: hidden;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .stored-draw-delete {
    display: grid;
    width: 2.75rem;
    min-height: 100%;
    place-items: center;
    border-radius: 1rem;
    color: var(--color-text-muted);
  }

  .stored-draw-delete:hover {
    color: #ffe1e1;
  }

  .toast-shell {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 1rem;
    background: rgba(11, 33, 22, 0.92);
    padding: 0.85rem 1rem;
    color: #d8ffe8;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
    animation: toast-in 0.24s ease both;
    backdrop-filter: blur(16px);
  }

  .toast-error {
    border-color: rgba(248, 113, 113, 0.34);
    background: rgba(45, 17, 21, 0.93);
    color: #ffe1e1;
  }

  .toast-warning {
    border-color: rgba(245, 158, 11, 0.42);
    background: rgba(48, 30, 7, 0.94);
    color: #ffecbd;
  }

  .randomizer-glow {
    position: absolute;
    border-radius: 999px;
    filter: blur(12px);
  }

  .randomizer-glow-a {
    width: 32rem;
    height: 32rem;
    top: -8rem;
    right: -7rem;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.1), transparent 68%);
  }

  .randomizer-glow-b {
    width: 25rem;
    height: 25rem;
    bottom: -8rem;
    left: -8rem;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.06), transparent 70%);
  }

  .loader {
    display: flex;
    gap: 0.5rem;
  }

  .loader span {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 999px;
    background: var(--color-accent);
    animation: loader-bounce 0.75s ease-in-out infinite;
  }

  .loader span:nth-child(2) {
    animation-delay: 0.12s;
  }

  .loader span:nth-child(3) {
    animation-delay: 0.24s;
  }

  .confetti-piece {
    position: absolute;
    top: 0;
    left: var(--left);
    width: var(--size);
    height: calc(var(--size) * 1.6);
    border-radius: 2px;
    background: var(--color);
    opacity: 0;
    animation: confetti-fall var(--duration) linear var(--delay) both;
    transform: translate3d(0, -12vh, 0) rotate(var(--rotation));
    will-change: transform, opacity;
  }

  @keyframes reveal-card {
    0% {
      opacity: 0;
      transform: translateY(-24px) scale(0.96);
      clip-path: inset(0 0 100% 0 round 1rem);
    }

    55% {
      opacity: 1;
      transform: translateY(3px) scale(1.012);
      clip-path: inset(0 0 0 0 round 1rem);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      clip-path: inset(0 0 0 0 round 1rem);
    }
  }

  @keyframes reveal-content {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes reveal-rank {
    0% {
      opacity: 0;
      transform: scale(0.45) rotate(-10deg);
    }

    65% {
      opacity: 1;
      transform: scale(1.12) rotate(3deg);
    }

    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes reveal-sweep {
    0% {
      opacity: 0;
      transform: translateX(-125%);
    }

    20% {
      opacity: 1;
    }

    100% {
      opacity: 0;
      transform: translateX(125%);
    }
  }

  @keyframes reveal-glow {
    0% {
      box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.32);
    }

    60% {
      box-shadow: 0 0 34px rgba(245, 158, 11, 0.18);
    }

    100% {
      box-shadow: none;
    }
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes loader-bounce {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.45;
    }

    50% {
      transform: translateY(-0.55rem);
      opacity: 1;
    }
  }

  @keyframes confetti-fall {
    0% {
      opacity: 0;
      transform: translate3d(0, -12vh, 0) rotate(var(--rotation));
    }

    10% {
      opacity: 1;
    }

    55% {
      opacity: 1;
      transform: translate3d(calc(var(--sway) * 1vw), 52vh, 0) rotate(calc(var(--rotation) + var(--half-spin)));
    }

    100% {
      transform: translate3d(calc(var(--drift) * 1vw), 112vh, 0) rotate(calc(var(--rotation) + var(--spin)));
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .result-card,
    .result-card::before,
    .result-card > *,
    .result-icon {
      animation: none;
    }
  }
</style>
