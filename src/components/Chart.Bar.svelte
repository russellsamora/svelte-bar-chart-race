<script>
  import { getContext } from "svelte";

  const { scales, dimensions } = getContext("Chart");

  export let value;
  export let rank;

  $: width = $scales.x(value) || 0;
  $: y = ($scales.y(rank) || 0) + $dimensions.barPadding / 2;
</script>

<rect x="0" {y} {width} height="{$dimensions.barHeight || 0}"></rect>
