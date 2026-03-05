<script lang="ts">
  import { Modal } from '@abcnews/components-builder';
  import type { Snippet } from 'svelte';

  interface Props {
    title: string;
    onClose: () => void;
    children: Snippet;
    footer?: Snippet;
    titleIcon?: Snippet;
  }

  let { title, onClose, children, footer, titleIcon }: Props = $props();
</script>

<Modal {onClose} {title} {titleIcon} position="right">
  <div class="item-collection-modal-content">
    {@render children()}
  </div>
  {#snippet footerChildren()}
    {#if footer}
      {@render footer()}
    {:else}
      <button onclick={onClose}>Close</button>
    {/if}
  {/snippet}
</Modal>

<style>
  .item-collection-modal-content {
    width: 25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
