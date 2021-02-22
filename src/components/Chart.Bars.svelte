<script>
  import { getContext } from "svelte";
  import Bar from "./Chart.Bar.svelte";

  const { data } = getContext("Chart");

  export let maxRank = 10;
</script>

{#each $data as { value, rank }, i (i)}
  {#if rank < maxRank}
    <Bar {value} {rank} />
  {/if}
{/each}
