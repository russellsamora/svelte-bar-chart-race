<script>
  import { getContext } from "svelte";
  import Bar from "./Chart.Bar.svelte";
  import colors from "./colors.json";

  const { data } = getContext("Chart");
  const colorCount = colors.length;

  export let maxRank;
</script>

{#each $data as { value, rank }, i (i)}
  {#if rank < maxRank}
    <Bar value="{value}" rank="{rank}" fill="{colors[i % colorCount]}" />
  {/if}
{/each}
