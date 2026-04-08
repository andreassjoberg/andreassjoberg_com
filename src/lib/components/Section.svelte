<script lang="ts">
  interface Props {
    id: string;
    className?: string;
    children?: import('svelte').Snippet;
  }

  let { id, className = '', children }: Props = $props();
</script>

<section {id} class="max-w-5xl mx-auto px-6 py-20 {className}">
  {@render children?.()}
</section>
