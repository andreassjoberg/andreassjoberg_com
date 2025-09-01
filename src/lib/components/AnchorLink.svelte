<script lang="ts">
  export let href: string;
  export let className = '';
  export let external = false;
</script>

<a
  href={href}
  class="text-accent hover:text-accent/80 transition-colors duration-200 underline decoration-2 underline-offset-4 hover:underline-offset-8 {className}"
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
>
  <slot />
</a>
