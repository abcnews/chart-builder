<script lang="ts">
  import type { ColumnTypesType } from '../../../lib/types';

  interface Props {
    id: string;
    label?: string;
    value?: string | number | null;
    columnType: ColumnTypesType;
  }
  let { id, value = $bindable(), columnType, label }: Props = $props();
</script>

{#if label}<label for={id}>{label}</label>{/if}
<input {id} type={columnType} bind:value />
