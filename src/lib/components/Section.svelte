<script lang="ts">
  export let id: string;
  export let className = '';
</script>

<section id={id} class="max-w-5xl mx-auto px-6 py-20 {className}">
  <slot />
</section>
