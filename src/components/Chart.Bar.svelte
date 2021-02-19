<script>
  export let value;
  export let rank;

  $: width = value * 0.01;
</script>

<rect x="0" y="{rank * 15}" width="{width}" height="{10}"></rect>
