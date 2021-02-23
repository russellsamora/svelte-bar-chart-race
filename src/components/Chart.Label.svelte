<script>
  import { getContext } from "svelte";
  import { format } from "d3";

  export let value;
  export let rank;
  export let i;

  const { names, scales, dimensions } = getContext("Chart");
  const formatNumber = format(",.0f");

  $: x = $scales.x(value);
  $: y = $scales.y(rank) + $dimensions.barMargin / 2;
  $: height = $dimensions.barHeight;
</script>

<div
  class="label"
  style="height: {height}px; transform: translate({x}px, {y}px);"
>
  <div class="inner">
    <p class="name">{names[i]}</p>
    <p class="value">{formatNumber(value)}</p>
  </div>
</div>

<style>
  .label {
    position: absolute;
    left: 0;
    top: 0;
  }
  .inner {
    transform: translate(-100%, 0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 0.5em;
    height: 100%;
  }
  p {
    margin: 0;
    font-size: 0.9em;
    text-align: right;
  }
  .name {
    font-weight: bold;
  }
  .value {
    font-size: 0.75em;
  }
</style>
