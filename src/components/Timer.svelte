<script>
  import { onMount, createEventDispatcher } from "svelte";
  import { timer, elapsed } from "./timer.js";
  export let duration = 1000;
  export let step = 0;
  export let max = 0;
  export let enabled;

  let sliderValue;

  const dispatch = createEventDispatcher();
  $: {
    step = Math.floor($elapsed / duration);
    sliderValue = step;
  }

  $: if (step === max) dispatch("ended");

  $: enabled ? timer.start() : timer.stop();
</script>

<h1>{$elapsed}</h1>

<input type="range" min="{0}" max="{max}" bind:value="{sliderValue}" />
<button on:click="{() => timer.start()}">start</button>
<button on:click="{() => timer.stop()}">stop</button>
<button on:click="{() => timer.toggle()}">toggle</button>
<button on:click="{() => timer.reset()}">reset</button>
<button on:click="{() => timer.set(1000)}">set 1000</button>
