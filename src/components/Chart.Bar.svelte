<script>
  import { getContext } from "svelte";

  const { scales, dimensions } = getContext("Chart");

  export let value;
  export let rank;
  export let fill;

  $: width = $scales.x(value) || 0;
  $: y = ($scales.y(rank) || 0) + $dimensions.barMargin / 2;
</script>

<div
  style="transform: translateY({y}px; --bar-color: {fill}88; width: {width -
    3}px; height: {$dimensions.barHeight || 0}px"
></div>

<style>
  div {
    position: absolute;
    background: var(--bar-color);
    border-left: 3px solid var(--bar-color);
  }
</style>
