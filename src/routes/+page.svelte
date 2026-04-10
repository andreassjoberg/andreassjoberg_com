<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Download, Mail, MapPin } from 'lucide-svelte';

  import Header from '$lib/components/Header.svelte';
  import Section from '$lib/components/Section.svelte';
  import Card from '$lib/components/Card.svelte';
  import Footer from '$lib/components/Footer.svelte';

  import { experience, education, contact, about } from '$lib/data';

  let currentSection = $state('');
  let heroVisible = $state(false);

  onMount(() => {
    heroVisible = true;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '50px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  });

  const handleContactClick = (e: Event) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };
</script>

<svelte:head>
  <title>Andreas Sjöberg — Software Architect</title>
  <meta
    name="description"
    content="Transforming business goals into scalable, sustainable architectures — with clarity, trust and people at the center."
  />
  <meta
    name="keywords"
    content="Software Architect, Chief Architect, Target Architecture, Scalability, Svenska Spel, TypeScript, React, .NET, Leadership"
  />
  <meta name="author" content="Andreas Sjöberg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <meta property="og:title" content="Andreas Sjöberg — Software Architect" />
  <meta
    property="og:description"
    content="Transforming business goals into scalable, sustainable architectures — with clarity, trust and people at the center."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://andreassjoberg.com" />
  <meta property="og:image" content="https://andreassjoberg.com/me-256x256.webp" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Andreas Sjöberg — Software Architect" />
  <meta
    name="twitter:description"
    content="Transforming business goals into scalable, sustainable architectures — with clarity, trust and people at the center."
  />
  <meta name="twitter:image" content="https://andreassjoberg.com/me-256x256.webp" />

  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/me-256x256.webp" />
</svelte:head>

<Header bind:currentSection />

<main>
  <!-- ── Hero ─────────────────────────────────────────────── -->
  <section
    id="hero"
    class="relative min-h-[100dvh] flex items-center overflow-hidden pt-20"
    aria-label="Introduction"
  >
    <!-- Ambient orbs -->
    <div aria-hidden="true" class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute rounded-full"
        style="
          width: 560px; height: 560px;
          top: -120px; right: -80px;
          background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 68%);
          animation: float-a 22s ease-in-out infinite;
          will-change: transform;
        "
      ></div>
      <div
        class="absolute rounded-full"
        style="
          width: 420px; height: 420px;
          bottom: -60px; left: -80px;
          background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
          animation: float-b 28s ease-in-out infinite;
          will-change: transform;
        "
      ></div>
      <div
        class="absolute rounded-full"
        style="
          width: 300px; height: 300px;
          top: 40%; left: 40%;
          background: radial-gradient(circle, rgba(245,158,11,0.04) 0%, transparent 70%);
          animation: float-a 18s ease-in-out infinite reverse;
          will-change: transform;
        "
      ></div>
    </div>

    <div class="relative z-10 max-w-6xl mx-auto px-6 w-full py-24">
      {#if heroVisible}
        <div class="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <!-- Content -->
          <div transition:fly={{ x: -40, duration: 700, delay: 100 }}>
            <!-- Eyebrow -->
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/8 mb-8"
              style="animation: fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.1s"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-accent" style="animation: ring-pulse 2.5s ease-in-out infinite;"></span>
              <span class="text-accent text-[11px] font-medium uppercase tracking-[0.15em]">Software Architect · Svenska Spel</span>
            </div>

            <h1 class="font-heading text-5xl lg:text-7xl font-bold leading-[1.02] mb-5" style="letter-spacing: -0.035em;">
              Andreas<br />
              <span class="text-accent">Sjöberg</span>
            </h1>

            <p class="text-xl lg:text-2xl text-text-muted font-normal leading-relaxed mb-5">
              Leverage technology for improvement
            </p>

            <p class="text-base text-text-muted leading-relaxed mb-10 max-w-[52ch]">
              Transforming business goals into scalable, sustainable architectures — with clarity, trust and people
              at the center.
            </p>

            <div class="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:{contact.email}?subject=CV Request&body=Hi Andreas,%0D%0A%0D%0AI would like to receive your CV.%0D%0A%0D%0ABest regards,"
                class="btn-primary"
              >
                <Download class="w-4 h-4" />
                Request CV
              </a>
              <a href="#contact" class="btn-secondary" onclick={handleContactClick}>
                <Mail class="w-4 h-4" />
                Contact
              </a>
            </div>
          </div>

          <!-- Profile image -->
          <div transition:fly={{ x: 40, duration: 700, delay: 300 }} class="flex justify-center lg:justify-end">
            <div class="relative">
              <!-- Outer pulsing ring -->
              <div
                class="absolute rounded-full border border-accent/20"
                style="inset: -24px; animation: ring-pulse-outer 4s ease-in-out infinite; will-change: transform, opacity;"
              ></div>
              <!-- Inner pulsing ring -->
              <div
                class="absolute rounded-full border border-accent/30"
                style="inset: -10px; animation: ring-pulse 3.5s ease-in-out infinite 0.8s; will-change: transform, opacity;"
              ></div>
              <!-- Glow -->
              <div
                class="absolute inset-0 rounded-full"
                style="background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%); filter: blur(20px); transform: scale(1.2);"
              ></div>
              <!-- Double-bezel image container -->
              <div
                class="relative z-10 p-1 rounded-full"
                style="background: linear-gradient(135deg, rgba(245,158,11,0.35) 0%, rgba(245,158,11,0.05) 50%, transparent 100%);"
              >
                <div class="p-1 rounded-full" style="background: var(--color-bg);">
                  <img
                    src="/me-256x256.webp"
                    alt="Andreas Sjöberg"
                    class="w-56 h-56 lg:w-64 lg:h-64 rounded-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll hint -->
        <div
          class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted/40"
          style="animation: fade-up 1s ease both 1.2s;"
        >
          <span class="text-[10px] uppercase tracking-widest">Scroll</span>
          <div class="w-px h-8 bg-gradient-to-b from-text-muted/30 to-transparent"></div>
        </div>
      {/if}
    </div>
  </section>

  <!-- ── About ──────────────────────────────────────────── -->
  <section id="about" class="max-w-6xl mx-auto px-6 py-28">
    <div class="reveal grid lg:grid-cols-[180px_1fr] gap-12 lg:gap-20">
      <!-- Left: sticky label -->
      <div class="hidden lg:block">
        <div class="sticky top-28 pt-1">
          <span class="text-[10px] uppercase tracking-[0.2em] text-text-muted block mb-3">About</span>
          <div class="w-6 h-px" style="background: var(--color-accent); opacity: 0.35;"></div>
        </div>
      </div>
      <!-- Right: content -->
      <div>
        <h2 class="font-heading text-3xl lg:text-[2.6rem] font-bold leading-tight mb-8">
          {about.title}
        </h2>
        <p class="text-base lg:text-lg text-text-muted leading-relaxed mb-6 max-w-[60ch]">
          {about.intro}
        </p>
        <div class="mb-10 space-y-4">
          {#each about.description.split('\n\n') as paragraph}
            <p class="text-sm text-text-muted leading-relaxed max-w-[68ch]">{paragraph}</p>
          {/each}
        </div>
        <div class="flex flex-wrap gap-2">
          {#each about.highlights as highlight}
            <span
              class="px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors duration-200"
              style="background: rgba(245,158,11,0.1); color: var(--color-accent);"
            >
              {highlight}
            </span>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- ── Experience ─────────────────────────────────────── -->
  <Section id="experience">
    <Card delay={150}>
      <!-- Eyebrow -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-bg-border bg-bg-hover mb-6">
        <span class="text-text-muted text-[10px] font-medium uppercase tracking-[0.18em]">Experience</span>
      </div>

      <h2 class="font-heading text-2xl lg:text-3xl font-bold mb-10">Work History</h2>

      <!-- Timeline -->
      <div class="relative">
        <!-- Vertical line -->
        <div
          class="absolute left-[7px] top-2 bottom-2 w-px"
          style="background: linear-gradient(to bottom, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0.1) 100%);"
          aria-hidden="true"
        ></div>

        <div class="space-y-10 pl-7">
          {#each experience as job, i}
            <div
              class="relative"
              style="animation: fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both; animation-delay: {i * 80}ms;"
            >
              <!-- Timeline dot -->
              <div
                class="absolute -left-7 top-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
                style="background: var(--color-accent); opacity: 0.85; box-shadow: 0 0 8px rgba(245,158,11,0.35);"
                aria-hidden="true"
              ></div>

              <!-- Job block -->
              <div class="group">
                <!-- Header row -->
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-1 mb-3">
                  <div>
                    <h3 class="font-heading font-bold text-text text-base leading-snug">{job.role}</h3>
                    <p class="text-accent text-sm font-medium">{job.company}</p>
                    <p class="text-text-muted text-xs mt-0.5 flex items-center gap-1">
                      <MapPin class="w-3 h-3 flex-shrink-0" />
                      {job.location}
                    </p>
                  </div>
                  <span class="text-text-muted text-xs font-medium whitespace-nowrap mt-0.5 lg:mt-0 shrink-0">
                    {job.period}
                  </span>
                </div>

                <!-- Bullets -->
                <ul class="space-y-1.5 mb-4">
                  {#each job.bullets as bullet}
                    <li class="text-text-muted text-sm leading-relaxed flex gap-2">
                      <span class="text-accent mt-1.5 flex-shrink-0" style="font-size: 6px; line-height: 1;">&#9679;</span>
                      {bullet}
                    </li>
                  {/each}
                </ul>

                <!-- Skill tags -->
                <div class="flex flex-wrap gap-1.5">
                  {#each job.skills as skill}
                    <span
                      class="px-2.5 py-1 rounded-full text-xs text-text-muted border border-bg-border bg-bg-hover transition-colors duration-200 hover:border-accent/25 hover:text-text"
                    >
                      {skill}
                    </span>
                  {/each}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </Card>
  </Section>

  <!-- ── Education ──────────────────────────────────────── -->
  <Section id="education">
    <Card delay={200}>
      <!-- Eyebrow -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-bg-border bg-bg-hover mb-6">
        <span class="text-text-muted text-[10px] font-medium uppercase tracking-[0.18em]">Education</span>
      </div>

      <h2 class="font-heading text-2xl lg:text-3xl font-bold mb-10">Academic Background</h2>

      <div class="relative">
        <div
          class="absolute left-[7px] top-2 bottom-2 w-px"
          style="background: linear-gradient(to bottom, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0.1) 100%);"
          aria-hidden="true"
        ></div>

        <div class="space-y-8 pl-7">
          {#each education as edu}
            <div class="relative" style="animation: fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both;">
              <!-- Timeline dot -->
              <div
                class="absolute -left-7 top-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0"
                style="background: var(--color-accent); opacity: 0.85; box-shadow: 0 0 8px rgba(245,158,11,0.35);"
                aria-hidden="true"
              ></div>

              <div>
                <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-1 mb-3">
                  <div>
                    <h3 class="font-heading font-bold text-text text-base leading-snug">{edu.degree}</h3>
                    <p class="text-accent text-sm font-medium">{edu.school}</p>
                  </div>
                  <span class="text-text-muted text-xs font-medium whitespace-nowrap shrink-0">
                    {edu.period}
                  </span>
                </div>
                <p class="text-text-muted text-sm leading-relaxed">{edu.notes}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </Card>
  </Section>

  <!-- ── Contact ────────────────────────────────────────── -->
  <section id="contact" class="border-t border-bg-border mt-4">
    <div class="max-w-6xl mx-auto px-6 py-32">
      <div class="reveal max-w-3xl">
        <span class="text-[10px] uppercase tracking-[0.2em] text-text-muted block mb-10">Contact</span>
        <h2 class="font-heading text-5xl lg:text-[5.5rem] font-bold leading-none mb-8" style="letter-spacing: -0.03em;">
          Let's work<br />together.
        </h2>
        <p class="text-base text-text-muted leading-relaxed mb-14 max-w-[52ch]">
          Open to discussing architecture, leadership, and new opportunities.
        </p>
        <a
          href="mailto:{contact.email}"
          class="group inline-flex items-center gap-4 mb-12"
        >
          <span class="font-heading text-xl lg:text-2xl font-semibold text-text group-hover:text-accent transition-colors duration-300">
            Get in touch
          </span>
          <span
            class="w-10 h-10 rounded-full border border-text-muted/20 flex items-center justify-center text-text-muted group-hover:border-accent group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
            aria-hidden="true"
          >→</span>
        </a>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
          <span class="flex items-center gap-1.5">
            <MapPin class="w-3.5 h-3.5 flex-shrink-0" />
            {contact.location}, Sweden
          </span>
          {#each contact.links as link}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-text transition-colors duration-200"
            >
              {link.label} ↗
            </a>
          {/each}
        </div>
      </div>
    </div>
  </section>
</main>

<Footer />


