<script lang="ts">
  interface Props {
    value?: string;
    defaultValue?: string; // This is just for display, it doesn't actually set any values
  }

  let { value = $bindable(), defaultValue }: Props = $props();
</script>

<label for="colour">Colour</label>
<input type="text" id="colour" bind:value placeholder={defaultValue ? `Default: ${defaultValue}` : ''} />
