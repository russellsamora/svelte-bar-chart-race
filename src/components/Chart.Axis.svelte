<script>
  import { getContext } from "svelte";
  import Tick from "./Chart.Tick.svelte";
  const { scales, dimensions } = getContext("Chart");
  $: ticks = $scales.x.ticks(5).slice(1); // don't need to show 0
</script>

{#each ticks as value (value)}
  <Tick x="{$scales.x(value)}" value="{value}" />
{/each}
