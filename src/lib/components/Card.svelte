<script lang="ts">
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  export let className = '';
  export let hover = true;
  export let delay = 0;

  let cardElement: HTMLDivElement;
  let isInView = false;

  onMount(() => {
    if (!cardElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInView = true;
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    observer.observe(cardElement);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div bind:this={cardElement}>
  {#if isInView}
    <div
      transition:fly={{ y: 20, duration: 300, delay }}
      class="rounded-2xl bg-bg-card border border-bg-border shadow-soft p-6 {className}"
      class:hover:bg-bg-hover={hover}
      class:hover:shadow-glow={hover}
      class:hover:scale-[1.02]={hover}
      class:transition-all={hover}
      class:duration-200={hover}
    >
      <slot />
    </div>
  {:else}
    <div class="opacity-0 rounded-2xl p-6 {className}">
      <slot />
    </div>
  {/if}
</div>
