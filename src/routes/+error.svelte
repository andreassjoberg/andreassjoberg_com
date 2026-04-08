<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { page } from '$app/state';
  import { Home, ArrowLeft } from 'lucide-svelte';

  let visible = $state(false);
  onMount(() => { visible = true; });

  const status = $derived(page.status);
  const message = $derived(
    status === 404
      ? 'This page doesn\'t exist — or maybe it never did.'
      : 'Something went wrong on our end.'
  );
  const label = $derived(status === 404 ? 'Page not found' : 'Something went wrong');
</script>

<svelte:head>
  <title>{status} — Andreas Sjöberg</title>
</svelte:head>

<main class="relative min-h-dvh flex items-center justify-center overflow-hidden bg-bg">
  <!-- Ambient orbs -->
  <div aria-hidden="true" class="absolute inset-0 pointer-events-none overflow-hidden">
    <div
      class="absolute rounded-full"
      style="
        width: 600px; height: 600px;
        top: -160px; right: -120px;
        background: radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 68%);
        animation: float-a 24s ease-in-out infinite;
        will-change: transform;
      "
    ></div>
    <div
      class="absolute rounded-full"
      style="
        width: 440px; height: 440px;
        bottom: -80px; left: -100px;
        background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
        animation: float-b 30s ease-in-out infinite;
        will-change: transform;
      "
    ></div>
    <div
      class="absolute rounded-full"
      style="
        width: 280px; height: 280px;
        top: 55%; left: 45%;
        background: radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%);
        animation: float-a 20s ease-in-out infinite reverse;
        will-change: transform;
      "
    ></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 max-w-2xl mx-auto px-6 text-center">
    {#if visible}
      <div transition:fly={{ y: 32, duration: 650, delay: 80 }}>

        <!-- Status badge -->
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/8 mb-8"
          style="animation: fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.05s"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-accent" style="animation: ring-pulse 2.5s ease-in-out infinite;"></span>
          <span class="text-accent text-[11px] font-medium uppercase tracking-[0.15em]">{label}</span>
        </div>

        <!-- Large status code -->
        <h1
          class="font-heading font-bold leading-none tracking-tight text-accent mb-6 select-none"
          style="font-size: clamp(7rem, 22vw, 14rem); opacity: 0.92; animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.1s;"
        >
          {status}
        </h1>

        <!-- Sub-heading -->
        <p
          class="font-heading font-semibold text-text text-2xl lg:text-3xl mb-4 tracking-tight"
          style="animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.2s;"
        >
          {label}
        </p>

        <!-- Body copy -->
        <p
          class="text-text-muted text-base leading-relaxed mb-10 max-w-sm mx-auto"
          style="animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.3s;"
        >
          {message}
        </p>

        <!-- CTA -->
        <div
          class="flex flex-col sm:flex-row gap-3 justify-center"
          style="animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both 0.4s;"
        >
          <a href="/" class="btn-primary">
            <Home class="w-4 h-4" />
            Back to home
          </a>
        </div>

      </div>
    {/if}
  </div>

  <!-- Subtle horizontal rule at the bottom -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-bg-border to-transparent"></div>
</main>
