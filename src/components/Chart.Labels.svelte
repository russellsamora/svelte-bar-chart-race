<script>
  import { getContext } from "svelte";

  const { data, names, scales, dimensions } = getContext("Chart");

  export let maxRank = 10;
</script>

<div>
  {#each $data as { value, rank }, i (i)}
    {#if rank < maxRank}
      <div
        class="label"
        style="height: {$dimensions.barHeight}px; transform: translate({$scales.x(value)}px,
        {$scales.y(rank) + $dimensions.barPadding / 2}px)">
        {names[i]}
      </div>
    {/if}
  {/each}
</div>

<style>
  .label {
    position: absolute;
    padding-left: 0.5em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
