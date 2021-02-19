<script>
  import Bar from "./Chart.Bar.svelte";
  export let data = [];
</script>

{#each data as { name, value, rank } (name)}
  <Bar value="{value}" rank="{rank}" />
{/each}
