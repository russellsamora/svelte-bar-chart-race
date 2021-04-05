<script>
  import { getContext } from "svelte";

  const { scales, dimensions } = getContext("Chart");

  export let value;
  export let rank;
  export let fill;

  const borderWidth = 4;

  $: width = $scales.x(value) || 0;
  $: y = ($scales.y(rank) || 0) + $dimensions.barMargin / 2;
  $: barColor = `--bar-color: ${fill}88;`;
  $: transform = `transform: translateY(${y}px);`;
  $: width = `width: ${width - borderWidth}px;`;
  $: height = `height: ${$dimensions.barHeight || 0}px;`;
</script>

<div style="{barColor} {transform} {width} {height}"></div>

<style>
  div {
    top: 0;
    left: 0;
    position: absolute;
    background: var(--bar-color);
    border-left: 4px solid var(--bar-color);
  }
</style>
