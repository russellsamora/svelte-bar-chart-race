<script>
  let sliderValue;

  const onInput = () => {
    isEnabled = false;
  };

  const onChange = () => {
    currentKeyframe = sliderValue;
  };

  $: if (isEnabled) sliderValue = currentKeyframe;
</script>

<input
  type="range"
  min="{0}"
  max="{keyframeCount}"
  on:input="{onInput}"
  on:change="{onChange}"
  bind:value="{sliderValue}"
/>
