<script lang="ts">
  import { onMount } from 'svelte';
  import { ChevronUp } from 'lucide-svelte';

  interface Props {
    currentSection?: string;
  }

  let { currentSection = $bindable('') }: Props = $props();

  const links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' }
  ];

  let showBackToTop = $state(false);
  let scrollY = $state(0);
  let scrolled = $state(false);
  let mobileOpen = $state(false);

  onMount(() => {
    const handleScroll = () => {
      scrollY = window.scrollY;
      showBackToTop = scrollY > 500;
      scrolled = scrollY > 60;
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          currentSection = entry.target.id || 'top';
        }
      });
    }, observerOptions);

    document.querySelectorAll('section[id], #hero').forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  });

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const smoothScrollTo = (target: number, duration = 700) => {
    const start = window.scrollY;
    const distance = target - start;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const scrollToTop = () => {
    smoothScrollTo(0);
    mobileOpen = false;
  };

  const handleClick = (href: string) => {
    mobileOpen = false;
    if (href === '#top') {
      scrollToTop();
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
      smoothScrollTo(targetPosition);
    }
  };
</script>

<svelte:window bind:scrollY />

<!-- Floating pill nav -->
<header class="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
  <nav
    class="pointer-events-auto flex items-center gap-1 px-1.5 py-1.5 rounded-full border transition-all duration-500 {scrolled
      ? 'bg-bg-card border-bg-border shadow-soft'
      : 'border-bg-border/40'}"
    style="backdrop-filter: blur(24px); background-color: {scrolled ? 'var(--color-bg-card)' : 'rgba(15,15,24,0.4)'};"
  >
    <!-- Monogram -->
    <a
      href="#hero"
      onclick={() => scrollToTop()}
      class="px-3 py-1.5 text-sm font-heading font-semibold text-text hover:text-accent transition-colors duration-200 rounded-full hover:bg-bg-hover"
    >
      AS
    </a>

    <span class="w-px h-4 bg-bg-border/60 mx-0.5"></span>

    <!-- Desktop links -->
    <div class="hidden md:flex items-center gap-1">
      {#each links as link}
        <a
          href={link.href}
          onclick={() => handleClick(link.href)}
          class="px-3.5 py-1.5 text-sm rounded-full transition-all duration-200 {currentSection === link.href.slice(1)
            ? 'text-accent bg-accent/10'
            : 'text-text-muted hover:text-text hover:bg-bg-hover'}"
        >
          {link.label}
        </a>
      {/each}
    </div>

    <!-- Mobile hamburger -->
    <button
      class="md:hidden px-3 py-1.5 text-text-muted hover:text-text transition-colors duration-200 rounded-full hover:bg-bg-hover"
      onclick={() => (mobileOpen = !mobileOpen)}
      aria-label="Toggle menu"
      aria-expanded={mobileOpen}
    >
      <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
        {#if mobileOpen}
          <line x1="5" y1="5" x2="15" y2="15" class="transition-all duration-200" />
          <line x1="15" y1="5" x2="5" y2="15" class="transition-all duration-200" />
        {:else}
          <line x1="3" y1="6" x2="17" y2="6" class="transition-all duration-200" />
          <line x1="3" y1="10" x2="17" y2="10" class="transition-all duration-200" />
          <line x1="3" y1="14" x2="17" y2="14" class="transition-all duration-200" />
        {/if}
      </svg>
    </button>
  </nav>
</header>

<!-- Mobile dropdown -->
{#if mobileOpen}
  <div
    class="fixed inset-0 z-40 flex flex-col items-center justify-center"
    style="background: rgba(7,7,11,0.96); backdrop-filter: blur(20px);"
  >
    <div class="flex flex-col items-center gap-8">
      {#each links as link, i}
        <a
          href={link.href}
          onclick={() => handleClick(link.href)}
          class="text-3xl font-heading font-bold transition-colors duration-200 hover:text-accent"
          class:text-accent={currentSection === link.href.slice(1)}
          class:text-text={currentSection !== link.href.slice(1)}
          style="animation: fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both; animation-delay: {i * 60}ms"
        >
          {link.label}
        </a>
      {/each}
    </div>
  </div>
{/if}

<!-- Back to top -->
{#if showBackToTop}
  <button
    onclick={scrollToTop}
    class="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-bg-card border border-bg-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-200 hover:scale-110 shadow-soft"
    aria-label="Back to top"
    style="animation: fade-up 0.3s ease both;"
  >
    <ChevronUp class="w-4 h-4" />
  </button>
{/if}
