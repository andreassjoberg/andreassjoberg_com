<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { ChevronUp } from 'lucide-svelte';

  export let currentSection: string = '';

  const links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' }
  ];

  let showBackToTop = false;
  let scrollY = 0;

  onMount(() => {
    const handleScroll = () => {
      scrollY = window.scrollY;
      showBackToTop = scrollY > 400;
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

    // Observe all sections
    document.querySelectorAll('section[id], #hero').forEach((section) => {
      observer.observe(section);
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClick = (href: string) => {
    if (href === '#top') {
      scrollToTop();
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };
</script>

<svelte:window bind:scrollY />

<header class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-bg-border">
  <nav class="max-w-6xl mx-auto px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Logo/Name -->
      <a 
        href="#top" 
        class="text-xl font-bold text-text hover:text-accent transition-colors duration-200"
        on:click|preventDefault={() => scrollToTop()}
      >
        Andreas Sjöberg
      </a>

      <!-- Navigation Links -->
      <div class="hidden md:flex items-center space-x-8">
        {#each links as link}
          <a
            href={link.href}
            class="text-text-muted hover:text-text transition-colors duration-200 relative group"
            class:text-accent={currentSection === link.href.slice(1)}
            on:click|preventDefault={() => handleClick(link.href)}
          >
            {link.label}
            <span 
              class="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-200 group-hover:w-full"
              class:w-full={currentSection === link.href.slice(1)}
            ></span>
          </a>
        {/each}
      </div>

      <!-- Back to Top Button -->
      {#if showBackToTop}
        <button
          transition:fade={{ duration: 200 }}
          on:click={scrollToTop}
          class="p-2 rounded-full bg-bg-card hover:bg-bg-hover border border-bg-border transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent"
          aria-label="Back to top"
        >
          <ChevronUp class="w-5 h-5 text-text" />
        </button>
      {/if}
    </div>

    <!-- Mobile Navigation -->
    <div class="md:hidden mt-4 flex flex-wrap gap-4">
      {#each links as link}
        <a
          href={link.href}
          class="text-sm text-text-muted hover:text-accent transition-colors duration-200"
          class:text-accent={currentSection === link.href.slice(1)}
          on:click|preventDefault={() => handleClick(link.href)}
        >
          {link.label}
        </a>
      {/each}
    </div>
  </nav>
</header>
