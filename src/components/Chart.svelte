<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { tweened } from "svelte/motion";
  import { range, scaleLinear, scaleQuantile } from "d3";
  import keyframes from "./keyframes.json";

  import Timer from "./Timer.svelte";
  import Bars from "./Chart.Bars.svelte";
  import Axis from "./Chart.Axis.svelte";
  import Labels from "./Chart.Labels.svelte";
  import Ticker from "./Chart.Ticker.svelte";

  const duration = 500;
  const maxRank = 10;

  let currentKeyframe = 0;
  // let keyframes = [];
  let isEnabled = false;
  let date;
  let data = [];
  let frame;
  let containerWidth;
  let containerHeight;

  const margins = [0, 0, 0, 200];

  $: maxKeyframe = keyframes.length;
  const names = keyframes[0][1].map(d => d.name);

  $: {
    const index = Math.min(currentKeyframe, maxKeyframe - 1);
    isEnabled = currentKeyframe < maxKeyframe;
    frame = keyframes[index];
    date = frame[0];
    data = frame[1];
  }

  // onMount(async () => {
  //   const response = await fetch("keyframes.json");
  //   keyframes = await response.json();
  // });

  $: currentData = names.map(name => {
    const d = data.find(d => d.name == name) || {};
    return { rank: d.rank, value: d.value };
  });
  const tweenedData = tweened(currentData, { duration });
  $: tweenedData.set(currentData);

  let dimensions = writable({});
  const barPadding = 2;
  $: width = containerWidth - margins[1] - margins[3];
  $: height = containerHeight - margins[0] - margins[2];
  $: $dimensions = {
    containerWidth,
    containerHeight,
    margins,
    width,
    height,
    barHeight: height / maxRank - barPadding,
    barPadding
  };

  let scales = writable({});
  $: $scales = {
    x: scaleLinear()
      .domain([0, Math.max(...data.map(d => d.value))])
      .range([0, $dimensions.width]),
    y: scaleLinear()
      .domain([0, maxRank])
      .range([0, $dimensions.height])
  };

  setContext("Chart", {
    dimensions,
    scales,
    data: tweenedData,
    names
  });
</script>

{#if keyframes}
  <Timer
    bind:currentKeyframe
    maxKeyframe="{keyframes.length}"
    {duration}
    {isEnabled}
    on:ended="{() => (isEnabled = false)}" />

  <figure
    bind:offsetWidth="{containerWidth}"
    bind:offsetHeight="{containerHeight}">
    <svg>
      <Bars {maxRank} {data} />
      <Axis />
    </svg>

    <div>
      <Labels {maxRank} />
      <Ticker {date} />
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
