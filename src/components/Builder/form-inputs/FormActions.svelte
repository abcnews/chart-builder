<script lang="ts" generics="Item extends DeletableType">
  import { type DeletableType } from '../../../lib/types';
  interface Props {
    item: Item | undefined;
  }

  let { item = $bindable() }: Props = $props();
</script>

<button onclick={() => (item = undefined)}>Done</button>
