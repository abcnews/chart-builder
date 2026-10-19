<script lang="ts">
  import type { ChartPositionType, ColumnTypesType } from '../../../lib/types';
  import AxisPositionInput from './AxisPositionInput.svelte';
  import FieldGroup from './FieldGroup.svelte';

  interface Props {
    id: string;
    label: string;
    value: ChartPositionType;
    types: { x: 'number' | 'date'; y: 'number' | 'date' };
  }

  let { id, value = $bindable(), label, types }: Props = $props();
</script>

<FieldGroup {label}>
  <AxisPositionInput id={`${id}-x`} label="x" bind:value={value.x} type={types.x} />
  <AxisPositionInput id={`${id}-y`} label="y" bind:value={value.y} type={types.y} />
</FieldGroup>
