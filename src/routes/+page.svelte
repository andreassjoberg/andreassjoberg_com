<script>
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  onMount(() => {
    let sections = gsap.utils.toArray('.h-scroll-panel');
    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.h-scroll-container',
        pin: true,
        scrub: 1,
        // snap: 1 / (sections.length - 1),
        // @ts-ignore
        end: () => '+=' + document.querySelector('.h-scroll-container').offsetWidth
      }
    });
  });
</script>

<div>
  <div class="selection:bg-palette-red text-palette-green text-center min-h-screen pt-8 px-5">
    <p>Hi, I'm</p>
    <h1 class="text-6xl font-bold my-3 text-palette-red selection:bg-palette-green md:text-9xl">Andreas</h1>
    <p>Sjöberg</p>
  </div>
  <div class="bg-palette-red selection:bg-palette-green text-palette-yellow text-center min-h-screen py-48 px-5">
    <p class="text-3xl">
      <span class="text-palette-purple selection:bg-palette-yellow">Developer<sup>*</sup></span>. Musician. Floorball
      enthusiast.
    </p>
    <p class="text-3xl">Nice to meet you.</p>
    <p class="text-palette-purple selection:bg-palette-yellow italic text-sm mt-3">
      * includes, but is not limited to, full-stack developer, software architect, tech lead, team leader, consultant
      manager, project management.
    </p>
  </div>
  <div class="bg-palette-yellow flex flex-nowrap h-scroll-container">
    <div class="h-scroll-panel w-dvw h-dvh bg-palette-green text-palette-purple selection:bg-palette-yellow">
      <div class="min-h-dvh flex justify-center items-center">
        <p>First</p>
      </div>
    </div>
    <div class="h-scroll-panel w-dvw h-dvh bg-palette-red">
      <div class="min-h-dvh flex justify-center items-center">
        <p>First</p>
      </div>
    </div>
    <div class="h-scroll-panel w-dvw h-dvh">
      <div class="min-h-dvh flex justify-center items-center">
        <p>First</p>
      </div>
    </div>
  </div>
  <div class="bg-palette-red selection:bg-palette-green text-palette-yellow text-center min-h-dvh py-48 px-5">
    <p class="text-3xl">
      <span class="text-palette-purple selection:bg-palette-yellow">Developer<sup>*</sup></span>. Musician. Floorball
      enthusiast.
    </p>
    <p class="text-3xl">Nice to meet you.</p>
    <p class="text-palette-purple selection:bg-palette-yellow italic text-sm mt-3">
      * includes, but is not limited to, full-stack developer, software architect, tech lead, team leader, consultant
      manager, project management.
    </p>
  </div>
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.palette-yellow);
  }

  .h-scroll-container {
    width: 300dvw;
  }
</style>
