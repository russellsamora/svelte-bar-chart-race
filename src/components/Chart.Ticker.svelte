<script>
  export let date;
  $: year = new Date(date).getFullYear();
</script>

{#if date}
  <p>{year}</p>
{/if}

<style>
  p {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 0;
    font-size: 3em;
    font-weight: 900;
    font-feature-settings: "tnum" 1;
  }
</style>
