<script>
  export let date;
  $: year = new Date(date).getFullYear();
</script>

<text x="0" y="12">{year}</text>
