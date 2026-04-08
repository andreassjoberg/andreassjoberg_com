<script lang="ts">
  interface Props {
    href: string;
    className?: string;
    external?: boolean;
    children?: import('svelte').Snippet;
  }

  let { href, className = '', external = false, children }: Props = $props();
</script>

<a
  {href}
  class="text-accent hover:text-accent/80 transition-colors duration-200 underline decoration-2 underline-offset-4 hover:underline-offset-8 {className}"
  target={external ? '_blank' : undefined}
  rel={external ? 'noopener noreferrer' : undefined}
>
  {@render children?.()}
</a>
