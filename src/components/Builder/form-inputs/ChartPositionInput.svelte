<script lang="ts">
  import type { ChartPositionType, ColumnTypesType } from '../../../lib/types';
  import AxisPositionInput from './AxisPositionInput.svelte';
  import FieldGroup from './FieldGroup.svelte';

  interface Props {
    id: string;
    label: string;
    value: ChartPositionType;
    columnTypes: { x: ColumnTypesType; y: ColumnTypesType };
  }

  let { id, value = $bindable(), label, columnTypes }: Props = $props();
</script>

<FieldGroup {label}>
  <AxisPositionInput id={`${id}-x`} label="x" bind:value={value.x} columnType={columnTypes.x} />
  <AxisPositionInput id={`${id}-y`} label="y" bind:value={value.y} columnType={columnTypes.y} />
</FieldGroup>
