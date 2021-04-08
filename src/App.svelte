<script>
  import Chart from "./Chart.svelte";
</script>

<main>
  <section class="intro">
    <h1>Languages on Stack Overflow</h1>
    <p>% of questions by programming language</p>
  </section>

  <Chart />

  <section class="outro">
    <p>
      Data from <a
        href="https://insights.stackoverflow.com/trends?tags=java%2Cc%2Cc%2B%2B%2Cpython%2Cc%23%2Cvb.net[…]mbly%2Cphp%2Cperl%2Cruby%2Cvb%2Cswift%2Cr%2Cobjective-c"
        >Stack Overflow</a
      >. This visualization was created for the
      <a href="https://sveltesummit.com/">Svelte Summit 2021</a>
      talk entitled
      <strong>Declarative Data Visualization: Creating a bar chart race</strong>
      by <a href="https://twitter.com/wattenberger">Amelia Wattenberger</a> and
      <a href="https://twitter.com/codenberg">Russell Goldenberg</a>. View the
      source code on
      <a href="https://github.com/russellgoldenberg/svelte-bar-chart-race"
        >Github</a
      >.
    </p>
  </section>
</main>

<style>
  @import url("https://rsms.me/inter/inter.css");

  main {
    font-family: "Inter", sans-serif;
    padding: 0 1em;
    max-width: 50em;
    margin: 0 auto;
  }

  .intro {
    text-align: center;
    margin: 1em 0;
  }

  .intro h1 {
    font-weight: 900;
    font-size: 3em;
    margin: 0;
  }

  .intro p {
    margin: 0;
    font-size: 1.5em;
  }

  .outro {
    margin-top: 3em;
    border-top: 1px solid gray;
  }

  .outro p {
    line-height: 1.4;
  }
</style>
