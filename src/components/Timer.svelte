<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { timer, elapsed } from "./timer.js";
  export let duration = 1000;
  export let currentKeyframe = 0;
  export let maxKeyframe = 0;
  export let isEnabled;

  let sliderValue;

  const dispatch = createEventDispatcher();
  $: {
    currentKeyframe = Math.floor($elapsed / duration);
    sliderValue = currentKeyframe;
  }

  $: if (currentKeyframe === maxKeyframe) dispatch("ended");

  $: isEnabled ? timer.start() : timer.stop();
</script>

<h1>{$elapsed}</h1>
<h1>{currentKeyframe}</h1>

<input type="range" min="{0}" max="{maxKeyframe}" bind:value="{sliderValue}" />
<button on:click="{() => timer.start()}">start</button>
<button on:click="{() => timer.stop()}">stop</button>
<button on:click="{() => timer.toggle()}">toggle</button>
<button on:click="{() => timer.reset()}">reset</button>
<button on:click="{() => timer.set(1000)}">set 1000</button>
<button on:click="{() => timer.set(50000)}">set 50000</button>
