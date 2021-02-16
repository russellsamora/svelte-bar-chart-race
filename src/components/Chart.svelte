<script>
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import Bars from "./Chart.Bars.svelte";
  import Axis from "./Chart.Axis.svelte";
  import Labels from "./Chart.Labels.svelte";
  import Ticker from "./Chart.Ticker.svelte";

  const duration = 2000;
  const timer = tweened(0, { duration });

  let keyframes;
  let width;
  let height;

  let date;

  onMount(async () => {
    const response = await fetch("keyframes.json");
    keyframes = await response.json();

    for (let frame of keyframes) {
      await timer.update((v) => v + 1);
      date = frame[0];
    }
  });
</script>

{#if keyframes}
  <figure
    class="chart-container"
    bind:offsetWidth={width}
    bind:offsetHeight={height}
  >
    <svg>
      <Bars />
      <Axis />
      <Labels />
      <Ticker {date} />
    </svg>
  </figure>
{/if}

<style>
  figure {
    position: relative;
    max-width: 40em;
    height: 50vh;
    margin: 0 auto;
    background: #efefef;
  }
  svg {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
