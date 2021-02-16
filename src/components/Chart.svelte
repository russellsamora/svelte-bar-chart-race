<script>
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { timer, elapsed } from "./timer.js";
  import Bars from "./Chart.Bars.svelte";
  import Axis from "./Chart.Axis.svelte";
  import Labels from "./Chart.Labels.svelte";
  import Ticker from "./Chart.Ticker.svelte";

  const duration = 1000;
  const frameIndex = tweened(0, { duration });

  let keyframes;
  let width;
  let height;

  let date;

  onMount(async () => {
    const response = await fetch("keyframes.json");
    keyframes = await response.json();
    timer.start();

    for (let frame of keyframes) {
      await frameIndex.update((v) => v + 1);
      date = frame[0];
    }
  });
</script>

<button on:click={() => timer.start()}>start</button>
<button on:click={() => timer.stop()}>stop</button>
<button on:click={() => timer.toggle()}>toggle</button>
<button on:click={() => timer.reset()}>reset</button>
<button on:click={() => timer.set(1000)}>set 1000</button>

<h1>{$elapsed}</h1>
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

<!-- <p>{Math.floor($elapsed / 1000)}</p> -->
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
