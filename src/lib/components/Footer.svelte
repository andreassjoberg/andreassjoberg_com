<script lang="ts">
  import { contact } from '$lib/data';
  import { Github, Linkedin, Mail, MapPin } from 'lucide-svelte';
  import Card from './Card.svelte';
</script>

<footer class="bg-black border-t border-bg-border">
  <div class="max-w-5xl mx-auto px-6 py-12">
    <Card className="text-center" hover={false}>
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Contact Info -->
        <div class="flex flex-col md:flex-row items-center gap-4 text-text-muted">
          <div class="flex items-center gap-2">
            <Mail class="w-4 h-4" />
            <span class="text-sm">{contact.email}</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPin class="w-4 h-4" />
            <span class="text-sm">{contact.location}</span>
          </div>
        </div>

        <!-- Social Links -->
        <div class="flex items-center gap-6">
          {#each contact.links as link}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="p-2 rounded-full bg-bg-hover hover:bg-accent transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={link.label}
            >
              {#if link.label === 'LinkedIn'}
                <Linkedin class="w-5 h-5 text-text" />
              {:else if link.label === 'GitHub'}
                <Github class="w-5 h-5 text-text" />
              {/if}
            </a>
          {/each}
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-bg-border text-center">
        <p class="text-text-muted text-sm">
          © {new Date().getFullYear()} Andreas Sjöberg
        </p>
      </div>
    </Card>
  </div>
</footer>
