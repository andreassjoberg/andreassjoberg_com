<script lang="ts">
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  interface Props {
    className?: string;
    hover?: boolean;
    delay?: number;
    children?: import('svelte').Snippet;
  }

  let { className = '', hover = true, delay = 0, children }: Props = $props();

  let cardElement: HTMLDivElement | undefined = $state();
  let isInView = $state(false);

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
      { threshold: 0.08, rootMargin: '50px' }
    );

    observer.observe(cardElement);

    return () => observer.disconnect();
  });
</script>

<div bind:this={cardElement}>
  {#if isInView}
    <div
      transition:fly={{ y: 24, duration: 500, delay }}
      class="card-shell {className}"
      class:card-hover={hover}
    >
      <div class="card-inner">
        {@render children?.()}
      </div>
    </div>
  {:else}
    <div class="opacity-0 {className}">
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  .card-shell {
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.06) 0%,
      rgba(255, 255, 255, 0.01) 60%,
      transparent 100%
    );
    border-radius: 1.25rem;
    padding: 1px;
  }

  .card-hover {
    transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .card-hover:hover {
    transform: translateY(-3px);
  }

  .card-hover:hover .card-inner {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 8px 32px rgba(0, 0, 0, 0.5),
      0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .card-inner {
    background: var(--color-bg-card);
    border-radius: calc(1.25rem - 1px);
    padding: 1.75rem;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 1px 3px rgba(0, 0, 0, 0.3);
  }


</style>
