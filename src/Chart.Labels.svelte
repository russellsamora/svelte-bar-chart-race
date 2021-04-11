<script>
  import { getContext } from "svelte";
  import Label from "./Chart.Label.svelte";
  const { data } = getContext("Chart");

  export let maxRank = 10;
</script>

{#each $data as { value, rank }, i (i)}
  {#if rank < maxRank}
    <Label value="{value}" rank="{rank}" i="{i}" />
  {/if}
{/each}
