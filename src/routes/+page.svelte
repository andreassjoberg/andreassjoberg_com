<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Download, Mail, ExternalLink, Calendar, MapPin } from 'lucide-svelte';
  
  import Header from '$lib/components/Header.svelte';
  import Section from '$lib/components/Section.svelte';
  import Card from '$lib/components/Card.svelte';
  import Footer from '$lib/components/Footer.svelte';
  
  import { experience, education, contact, about } from '$lib/data';
  
  let currentSection = '';
  let heroVisible = false;
  
  onMount(() => {
    heroVisible = true;
  });

  const handleContactClick = (e: Event) => {
    e.preventDefault();
    const target = document.querySelector('#contact');
    if (target) {
      const headerHeight = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };
</script>

<svelte:head>
  <title>Andreas Sjöberg - Leverage technology for improvement</title>
  <meta name="description" content="Transforming business goals into scalable, sustainable architectures — with clarity, trust and people at the center." />
  <meta name="keywords" content="Software Architect, Chief Architect, Target Architecture, Scalability, Svenska Spel, TypeScript, React, .NET, Leadership" />
  <meta name="author" content="Andreas Sjöberg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Open Graph -->
  <meta property="og:title" content="Andreas Sjöberg - Leverage technology for improvement" />
  <meta property="og:description" content="Transforming business goals into scalable, sustainable architectures — with clarity, trust and people at the center." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://andreassjoberg.com" />
  <meta property="og:image" content="https://andreassjoberg.com/me-256x256.webp" />
  <meta property="og:image:width" content="256" />
  <meta property="og:image:height" content="256" />
  <meta property="og:locale" content="en_US" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Andreas Sjöberg - Leverage technology for improvement" />
  <meta name="twitter:description" content="Transforming business goals into scalable, sustainable architectures — with clarity, trust and people at the center." />
  <meta name="twitter:image" content="https://andreassjoberg.com/me-256x256.webp" />
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/me-256x256.webp" />
  
  <!-- Language -->
  <html lang="en" />
</svelte:head>

<Header bind:currentSection />

<main>
  <!-- Hero Section -->
  <section id="hero" class="min-h-screen flex items-center justify-center pt-48 sm:pt-20">
    <div class="max-w-6xl mx-auto px-6">
      {#if heroVisible}
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <!-- Content -->
          <div transition:fly={{ x: -50, duration: 600, delay: 200 }}>
            <h1 class="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Andreas <span class="text-accent">Sjöberg</span>
            </h1>
            <h2 class="text-xl lg:text-2xl text-text-muted mb-6 leading-relaxed">
              Leverage technology for improvement
            </h2>
            <p class="text-lg text-text-muted mb-8 leading-relaxed max-w-lg">
              Transforming business goals into scalable, sustainable architectures — with clarity, trust and people at the center.
            </p>
            
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:{contact.email}?subject=CV Request&body=Hi Andreas,%0D%0A%0D%0AI would like to receive your CV.%0D%0A%0D%0ABest regards,"
                class="btn-primary flex items-center gap-2"
              >
                <Download class="w-5 h-5" />
                Request CV
              </a>
              <a 
                href="#contact" 
                class="btn-secondary flex items-center gap-2"
                on:click={handleContactClick}
              >
                <Mail class="w-5 h-5" />
                Contact
              </a>
            </div>
          </div>
          
          <!-- Profile Image -->
          <div transition:fly={{ x: 50, duration: 600, delay: 400 }} class="flex justify-center lg:justify-end">
            <div class="relative">
              <div class="absolute inset-0 bg-accent/20 rounded-full blur-2xl scale-110"></div>
              <img 
                src="/me-256x256.webp"
                alt="Andreas Sjöberg"
                class="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full object-cover border-4 border-accent/30 shadow-2xl"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      {/if}
    </div>
  </section>

  <!-- About Section -->
  <Section id="about">
    <Card delay={100}>
      <h2 class="text-3xl lg:text-4xl font-bold mb-6">{about.title}</h2>
      
      <p class="text-lg text-text-muted leading-relaxed mb-6">
        {about.intro}
      </p>
      
      <div class="prose prose-lg prose-invert max-w-none mb-8">
        {#each about.description.split('\n\n') as paragraph}
          <p class="text-text-muted leading-relaxed mb-4">{paragraph}</p>
        {/each}
      </div>
      
      <!-- Highlight Chips -->
      <div class="flex flex-wrap gap-3">
        {#each about.highlights as highlight, i}
          <span 
            class="px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl text-accent font-medium"
            transition:fade={{ delay: 200 + (i * 100) }}
          >
            {highlight}
          </span>
        {/each}
      </div>
    </Card>
  </Section>

  <!-- Experience Section -->
  <Section id="experience">
    <Card delay={200}>
      <h2 class="text-3xl lg:text-4xl font-bold mb-8">Experience</h2>
      
      <div class="space-y-8">
        {#each experience as job, i}
          <div transition:fly={{ y: 20, duration: 300, delay: 300 + (i * 100) }}>
            <Card className="border-l-4 border-l-accent" hover={false}>
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div>
                  <h3 class="text-xl font-bold text-text">{job.role}</h3>
                  <p class="text-accent font-medium">{job.company}</p>
                  <p class="text-text-muted flex items-center gap-1">
                    <MapPin class="w-4 h-4" />
                    {job.location}
                  </p>
                </div>
                <div class="flex items-center gap-1 text-text-muted">
                  <Calendar class="w-4 h-4" />
                  <span class="font-medium whitespace-nowrap">{job.period}</span>
                </div>
              </div>
              
              <ul class="space-y-2 mb-6">
                {#each job.bullets as bullet}
                  <li class="text-text-muted leading-relaxed">
                    <span class="text-accent mr-2">•</span>
                    {bullet}
                  </li>
                {/each}
              </ul>
              
              <div class="flex flex-wrap gap-2">
                {#each job.skills as skill}
                  <span class="px-3 py-1 bg-bg-hover border border-bg-border rounded-lg text-sm text-text-muted">
                    {skill}
                  </span>
                {/each}
              </div>
            </Card>
          </div>
        {/each}
      </div>
    </Card>
  </Section>

  <!-- Education Section -->
  <Section id="education">
    <Card delay={400}>
      <h2 class="text-3xl lg:text-4xl font-bold mb-8">Education</h2>
      
      {#each education as edu}
        <Card className="border-l-4 border-l-accent" hover={false}>
          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            <div>
              <h3 class="text-xl font-bold text-text">{edu.degree}</h3>
              <p class="text-accent font-medium">{edu.school}</p>
            </div>
            <div class="flex items-center gap-1 text-text-muted">
              <Calendar class="w-4 h-4" />
              <span class="font-medium">{edu.period}</span>
            </div>
          </div>
          
          <p class="text-text-muted leading-relaxed">
            {edu.notes}
          </p>
        </Card>
      {/each}
    </Card>
  </Section>

  <!-- Contact Section -->
  <Section id="contact">
    <Card delay={500}>
      <h2 class="text-3xl lg:text-4xl font-bold mb-8 text-center">Contact</h2>
      
      <div class="text-center max-w-2xl mx-auto">
        <p class="text-lg text-text-muted mb-8 leading-relaxed">
          Let's discuss how we can collaborate to create future-proof solutions.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <a 
            href="mailto:{contact.email}"
            class="flex items-center gap-3 px-6 py-3 bg-accent hover:bg-accent/90 text-black font-medium rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Mail class="w-5 h-5" />
            Send Email
          </a>
          
          {#each contact.links as link}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-3 px-6 py-3 bg-bg-card hover:bg-bg-hover border border-bg-border text-text font-medium rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ExternalLink class="w-5 h-5" />
              {link.label}
            </a>
          {/each}
        </div>
        
        <div class="flex items-center justify-center gap-2 text-text-muted">
          <MapPin class="w-4 h-4" />
          <span>{contact.location}</span>
        </div>
      </div>
    </Card>
  </Section>
</main>

<Footer />
