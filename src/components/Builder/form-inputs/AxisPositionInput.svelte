<script lang="ts">
  interface Props {
    id: string;
    label?: string;
    value?: string | number | null;
    type: 'number' | 'date';
  }
  let { id, value = $bindable(), type, label }: Props = $props();
</script>

{#if label}<label for={id}>{label}</label>{/if}
<input {id} {type} bind:value />
