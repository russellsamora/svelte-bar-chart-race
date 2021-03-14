<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { timer, elapsed } from "./timer.js";
  export let duration = 1000;
  export let currentKeyframe = 0;
  export let keyframeCount = 0;
  export let isEnabled = false;

  let sliderValue;

  const dispatch = createEventDispatcher();
  $: {
    currentKeyframe = Math.floor($elapsed / duration);
    sliderValue = currentKeyframe;
  }

  $: if (currentKeyframe === keyframeCount) dispatch("end");

  $: isEnabled ? timer.start() : timer.stop();
</script>

<div>
  <!-- <input
    type="range"
    min="{0}"
    max="{keyframeCount}"
    bind:value="{sliderValue}"
  /> -->
  <button on:click="{() => timer.start()}">start</button>
  <button on:click="{() => timer.stop()}">stop</button>
  <button on:click="{() => timer.reset()}">reset</button>
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    margin-bottom: 3em;
  }
</style>
