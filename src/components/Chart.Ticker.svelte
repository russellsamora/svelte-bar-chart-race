<script>
  export let date;
  $: year = new Date(date).getFullYear();
</script>

{#if date}
  <p>{year}</p>
{/if}
