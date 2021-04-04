<script>
  import Chart from "$components/Chart.svelte";
</script>

<main>
  <h1>Languages on Stack Overflow</h1>
  <h2>% of questions by programming language</h2>
  <div class="intro">
    <p>
      Data from <a
        href="https://insights.stackoverflow.com/trends?tags=java%2Cc%2Cc%2B%2B%2Cpython%2Cc%23%2Cvb.net[…]mbly%2Cphp%2Cperl%2Cruby%2Cvb%2Cswift%2Cr%2Cobjective-c"
        >Stack Overflow</a
      >
    </p>
  </div>
  <Chart />
</main>

<style>
  @import url("https://rsms.me/inter/inter.css");
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: "Inter", sans-serif;
  }
  .intro {
    margin-bottom: 1.3em;
  }

  h1 {
    font-weight: 900;
    font-size: 3em;
    text-align: center;
    margin-bottom: 0.1em;
  }
  h2 {
    margin: 0 0 0.5em;
    font-weight: 300;
    font-size: 1.6em;
    text-align: center;
    color: #747294;
  }
  p {
  }
</style>
