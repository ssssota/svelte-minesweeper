<script lang="ts">
  import Minesweeper from "./lib/Minesweeper.svelte";

  let width = 10;
  let height = 10;
  let bombCount = 10;
  let minesweeper: Minesweeper;
</script>

<p>
  width: <input type="number" min={5} step={1} bind:value={width} /> / height:
  <input type="number" min={5} step={1} bind:value={height} />
  / bomb count: <input type="number" min={5} step={1} bind:value={bombCount} />
  /
  <button on:click={() => minesweeper.reset()}>RESET</button>
</p>

<Minesweeper
  {width}
  {height}
  {bombCount}
  bind:this={minesweeper}
  on:win={() => window.alert("🎉 You win!!")}
  on:lose={() => window.alert("🤯 You lose.")}
/>

<style>
  input {
    width: 5em;
  }
</style>
