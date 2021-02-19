<script>
  import { onMount } from "svelte";

  import Timer from "./Timer.svelte";
  import Bars from "./Chart.Bars.svelte";
  import Axis from "./Chart.Axis.svelte";
  import Labels from "./Chart.Labels.svelte";
  import Ticker from "./Chart.Ticker.svelte";

  let step = 0;
  let keyframes = [];
  let enabled = false;
  let date;
  let data;
  let frame;
  let width;
  let height;

  $: maxStep = keyframes.length;

  $: if (keyframes.length) {
    const index = Math.min(step, maxStep - 1);
    enabled = step < maxStep;
    frame = keyframes[index];
    date = frame[0];
    data = frame[1];
  }

  onMount(async () => {
    const response = await fetch("keyframes.json");
    keyframes = await response.json();
  });
</script>

{#if keyframes}
  <Timer
    bind:step
    duration="{50}"
    enabled="{enabled}"
    max="{keyframes.length}"
    on:ended="{() => (enabled = false)}"
  />

  <figure bind:offsetWidth="{width}" bind:offsetHeight="{height}">
    <svg>
      <Bars data="{data}" />
      <Axis />
    </svg>

    <div>
      <Labels />
      <Ticker date="{date}" />
    </div>
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

  figure > * {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
