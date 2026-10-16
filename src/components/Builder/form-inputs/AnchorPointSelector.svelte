<script lang="ts">
  import { AnnotationAnchorType } from '../../../lib/types';

  let { value = $bindable(AnnotationAnchorType.TopLeft) }: { value: AnnotationAnchorType | undefined } = $props();
</script>

<div class="frame">
  <button aria-label="middle" onclick={() => (value = AnnotationAnchorType.Middle)}></button>
  <button aria-label="top left" onclick={() => (value = AnnotationAnchorType.TopLeft)}></button>
  <button aria-label="top" onclick={() => (value = AnnotationAnchorType.Top)}></button>
  <button aria-label="top right" onclick={() => (value = AnnotationAnchorType.TopRight)}></button>
  <button aria-label="right" onclick={() => (value = AnnotationAnchorType.Right)}></button>
  <button aria-label="bottom right" onclick={() => (value = AnnotationAnchorType.BottomRight)}></button>
  <button aria-label="bottom" onclick={() => (value = AnnotationAnchorType.Bottom)}></button>
  <button aria-label="bottom left" onclick={() => (value = AnnotationAnchorType.BottomLeft)}></button>
  <button aria-label="left" onclick={() => (value = AnnotationAnchorType.Left)}></button>
</div>

<style>
  .frame {
    --button-size: 8px;
    position: relative;
    min-width: calc(var(--button-size) * 3 + 5px);
    min-height: calc(var(--button-size) * 3 + 5px);
    margin: var(--button-size);
    border: 1px solid grey;
    border-radius: 3px;
  }
  button {
    position: absolute;
    width: var(--button-size);
    height: var(--button-size);
    padding: 0;
    border: none;
    background-color: red;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  [aria-label='middle'] {
    left: 50%;
    top: 50%;
  }
  [aria-label='top left'] {
    left: 0%;
    top: 0%;
  }
  [aria-label='top'] {
    left: 50%;
    top: 0%;
  }
  [aria-label='top right'] {
    left: 100%;
    top: 0%;
  }
  [aria-label='right'] {
    left: 100%;
    top: 50%;
  }
  [aria-label='bottom right'] {
    left: 100%;
    top: 100%;
  }
  [aria-label='bottom'] {
    left: 50%;
    top: 100%;
  }
  [aria-label='bottom left'] {
    left: 0%;
    top: 100%;
  }
  [aria-label='left'] {
    left: 0%;
    top: 50%;
  }
</style>
