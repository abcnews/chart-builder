<script lang="ts">
  import type { ColumnTypesType } from '../../../lib/types';

  interface Props {
    id: string;
    label: string;
    value: string | number | Date | boolean;
    columnType: ColumnTypesType;
  }
  let { id, value = $bindable(), columnType, label }: Props = $props();
  let type: 'text' | 'checkbox' | 'number' | 'date' = $derived(
    columnType === 'string' ? 'text' : columnType === 'boolean' ? 'checkbox' : columnType
  );
</script>

<label for={id}>{label}</label>
<input {id} {type} bind:value />
