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
    font-size: 5em;
    letter-spacing: -0.09em;
    font-weight: 600;
    font-feature-settings: "tnum" 1;
  }
</style>
