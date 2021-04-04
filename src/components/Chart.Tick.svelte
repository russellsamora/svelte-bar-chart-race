<script>
  import { format } from "d3";
  import { fade } from "svelte/transition";
  export let value;
  export let x;

  const duration = 250;
  const formatNumber = (d) => format(",.0f")(d * 100) + "%";
  $: formattedValue = formatNumber(value);
</script>

<div
  transition:fade="{{ duration }}"
  class="tick"
  style="transform: translate({x}px, 0);"
>
  <div class="line"></div>
  <p class="value">{formattedValue}</p>
</div>

<style>
  .tick {
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
  }
  .line {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 1px;
    background: #fff;
  }
  .value {
    margin: 0;
    transform: translate(-50%, -100%);
    font-size: 0.75em;
    color: #666;
  }
</style>
