<script>
  import { getContext } from "svelte";
  import { format } from "d3";

  const { data, names, scales, dimensions } = getContext("Chart");

  export let maxRank = 10;

  const formatNumber = format(",.0f");
</script>

<div>
  {#each $data as { value, rank }, i (i)}
    {#if rank < maxRank}
      <div
        class="label"
        style="height: {$dimensions.barHeight}px; transform: translate({$scales.x(
          value
        )}px,
        {$scales.y(rank) + $dimensions.barMargin / 2}px)"
      >
        <div class="name">{names[i]}</div>
        <div class="value">{formatNumber(value)}</div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .label {
    position: absolute;
    left: -0.5em;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    width: 0;
    white-space: nowrap;
  }
  .name {
    font-weight: 600;
    font-size: 0.9em;
    line-height: 1.3em;
  }
  .value {
    font-size: 0.7em;
    line-height: 1.3em;
  }
</style>
