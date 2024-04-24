<script lang="ts">
  import { onMount } from 'svelte';

  let counter = 0;
  onMount(() => {
    const countdown = document.querySelector('.countdown > span') as HTMLSpanElement;
    if (countdown) {
      const value = Number(countdown.innerHTML);
      counter = value;
    }
  });

  let show = false;
  let o = ['gmail.com', '@', 'andreassjoberg86'];
  $: e = show ? o[2] + o[1] + o[0] : '';

  let darkMode = false;

  $: {
    if (typeof document !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
</script>

<main
  class="font-sans antialiased text-gray-900 dark:text-gray-100 leading-normal tracking-wider min-h-dvh bg-cover bg-fixed"
  style="background-image:url('/bg.webp');"
>
  <div class="max-w-4xl flex items-center h-auto flex-wrap mx-auto py-32">
    <div id="profile" class="w-full rounded-lg shadow-2xl bg-white dark:bg-black mx-6">
      <div class="p-4 text-center">
        <div
          class="block rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center"
          style="background-image: url('me-256x256.webp')"
        />

        <h1 class="text-3xl font-bold pt-8">Andreas Sjöberg</h1>
        <div class="mx-auto w-4/5 pt-3 border-b-2 border-slate-500 dark:border-slate-200 opacity-25" />
        <p class="pt-4 text-base font-bold">Building great things, by building great teams</p>
        <p class="pt-8 text-sm">I believe great software helps businesses and individuals excel.</p>
        <p class="pt-2 text-sm">
          Building great software requires great individuals, a great mindset and pshycological safety.
        </p>
        <p class="pt-4 text-sm">
          If you're looking for someone to help your business towards your next target, feel free to contact me.
        </p>
        <p class="pt-2 text-xs italic">
          If you're looking for a CTO, Domain Architect, Engineering Manager, or similar, that's where I'll make the
          most of my experience.
        </p>
        <p class="text-xs italic">
          In the right context, I'm also open to roles as a Senior Full-Stack Developer or similar.
        </p>

        <div class="pt-12 pb-8">
          {#if e}
            <a href={`mailto:${e}`} class="font-bold py-4">{e}</a>
          {:else}
            <button
              class="bg-slate-700 hover:bg-slate-900 text-white dark:bg-slate-500 dark:hover:bg-slate-700 font-bold py-2 px-4 rounded-full"
              on:click={() => (show = !show)}
            >
              Get in touch
            </button>
          {/if}
        </div>

        <div class="stats shadow stats-vertical md:stats-horizontal bg-slate-700 dark:bg-slate-500">
          <div class="stat transition-colors duration-700 hover:bg-red-800">
            <div class="stat-figure">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                >
                </path>
              </svg>
            </div>
            <div class="stat-title text-slate-300">Years in tech</div>
            <div class="stat-value text-white">
              <span class="countdown">
                <span style="--value:{counter}">15</span>
              </span>+
            </div>
          </div>

          <div class="stat transition-colors duration-700 hover:bg-indigo-700">
            <div class="stat-figure">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                </path>
              </svg>
            </div>
            <div class="stat-title text-slate-300">Still learning?</div>
            <div class="stat-value text-white">YES!</div>
          </div>
        </div>

        <div class="flex flex-col mx-auto md:flex-row md:space-x-5 space-y-5 md:space-y-0 pt-5 max-w-96 md:max-w-none">
          <div
            class="card w-full bg-slate-700 dark:bg-slate-500 text-gray-100 transition-colors duration-700 hover:bg-purple-700"
          >
            <div class="card-body items-center text-center">
              <h2 class="card-title">Really simple randomizer</h2>
              <p>Simple project for randomizing, works well for simple lotteries.</p>
              <div class="card-actions justify-end">
                <a href="https://andreassjoberg.com/randomizer" target="_blank">
                  <button
                    class="bg-slate-500 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-900 font-bold py-2 px-4 rounded-full"
                    >Show me</button
                  >
                </a>
              </div>
            </div>
          </div>
          <div
            class="card w-full bg-slate-700 dark:bg-slate-500 text-gray-100 transition-colors hover:bg-orange-700 duration-700"
          >
            <div class="card-body items-center text-center">
              <h2 class="card-title">Share a secret</h2>
              <p>Share a one-time secret with someone, using OpenPGP.</p>
              <div class="card-actions justify-end">
                <a href="https://andreassjoberg.com/shareasecret" target="_blank">
                  <button
                    class="bg-slate-500 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-900 font-bold py-2 px-4 rounded-full"
                    >Show me</button
                  >
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-auto w-4/5 py-3 border-b-2 border-slate-500 dark:border-slate-200 opacity-25" />

        <div class="my-8 flex flex-row justify-center space-x-10">
          <a class="link" href="https://www.linkedin.com/in/andreassjoberg/" target="_blank" rel="noreferrer">
            <svg
              class="h-6 fill-current text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-500"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>LinkedIn</title>
              <path
                d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
              />
            </svg>
          </a>
          <a class="link" href="https://github.com/andreassjoberg/" target="_blank" rel="noreferrer">
            <svg
              class="h-6 fill-current text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-500"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
          </a>
        </div>

        <div>
          <label class="swap swap-rotate">
            <input
              type="checkbox"
              class="theme-controller"
              value={darkMode}
              on:change={() => (darkMode = !darkMode)}
              aria-label="Change theme"
            />
            <svg
              class="swap-off fill-current w-10 h-10 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
              />
            </svg>
            <svg
              class="swap-on fill-current w-10 h-10 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
              />
            </svg>
          </label>
        </div>

        <!-- Use https://simpleicons.org/ to find the svg for your preferred product -->
      </div>
    </div>
  </div>
</main>
