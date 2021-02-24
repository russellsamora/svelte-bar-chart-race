<script>
  import { getContext } from "svelte";

  const { scales, dimensions } = getContext("Chart");

  export let value;
  export let rank;
  export let fill;

  $: width = $scales.x(value) || 0;
  $: y = ($scales.y(rank) || 0) + $dimensions.barMargin / 2;
</script>

<rect
  x="0"
  y="{y}"
  width="{width}"
  height="{$dimensions.barHeight || 0}"
  style="fill: {fill};"></rect>

<style>
  rect {
    opacity: 0.5;
  }
</style>
