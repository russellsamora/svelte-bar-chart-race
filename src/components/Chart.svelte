<script>
  import { range, scaleLinear, scaleQuantile } from "d3";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { tweened } from "svelte/motion";

  import Timer from "./Timer.svelte";
  import Bars from "./Chart.Bars.svelte";
  import Axis from "./Chart.Axis.svelte";
  import Labels from "./Chart.Labels.svelte";
  import Ticker from "./Chart.Ticker.svelte";

  import keyframes from "./keyframes.json";

  const duration = 300; // ms between keyframes
  const maxRank = 10; // how many bars to show
  const names = keyframes[0][1].map((d) => d.name); // all company names
  const keyframeCount = keyframes.length; // number of keyframes
  const barMargin = 4; // space between bars

  const dimensions = writable({});
  const scales = writable({});
  const data = tweened(null, { duration });
  const xMax = tweened(null, { duration });

  let figureWidth;
  let figureHeight;
  let currentKeyframe = 0;
  let isEnabled = false;

  $: frameIndex = Math.min(currentKeyframe, keyframeCount - 1);
  $: frame = keyframes[frameIndex];
  $: isEnabled = currentKeyframe < keyframeCount;
  $: keyframeDate = frame[0];
  $: keyframeData = frame[1];
  $: width = figureWidth;
  $: height = figureHeight;
  $: barHeight = height / maxRank - barMargin;
  $: currentData = names.map((name) => {
    const { rank, value } = keyframeData.find((d) => d.name == name) || {};
    return { rank, value };
  });

  // update stores
  $: data.set(currentData);

  $: dimensions.set({
    width,
    height,
    barHeight,
    barMargin,
  });

  $: xMax.set(Math.max(...keyframeData.map((d) => d.value)));

  $: scales.set({
    x: scaleLinear().domain([0, $xMax]).range([0, $dimensions.width]),
    y: scaleLinear().domain([0, maxRank]).range([0, $dimensions.height]),
  });

  $: chartContext = { dimensions, scales, data, names };

  $: setContext("Chart", chartContext);
</script>

{#if keyframes}
  <Timer
    bind:currentKeyframe
    keyframeCount="{keyframes.length}"
    duration="{duration}"
    isEnabled="{isEnabled}"
    on:end="{() => (isEnabled = false)}"
  />

  <figure bind:offsetWidth="{figureWidth}" bind:offsetHeight="{figureHeight}">
    <svg>
      <g>
        <Bars maxRank="{maxRank}" />
        <Axis />
      </g>
    </svg>

    <div>
      <Labels maxRank="{maxRank}" />
      <Ticker date="{keyframeDate}" />
    </div>
  </figure>
{/if}

<style>
  figure {
    position: relative;
    max-width: 50em;
    height: 60vh;
    margin: 0 auto;
    /* background: #efefef; */
    font-family: sans-serif;
  }

  figure > * {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
