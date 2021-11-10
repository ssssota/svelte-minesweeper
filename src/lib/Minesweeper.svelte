<script lang="ts" context="module">
  export type EventMap = {
    win: never;
    lose: never;
  };
</script>

<script lang="ts">
  import type { Minesweeper } from "./Minesweeper";
  import {
    createMinesweeper,
    makeMap,
    open,
    toggleFlag,
    getAroundBombCount,
    checkResult,
  } from "./Minesweeper";
  import { createEventDispatcher } from "svelte";

  export let width = 10;
  export let height = 10;
  export let bombCount = 10;

  const dispatch = createEventDispatcher<EventMap>();

  let minesweeper: Minesweeper = createMinesweeper(width, height, bombCount);
  $: minesweeper = createMinesweeper(width, height, bombCount);

  $: switch (checkResult(minesweeper)) {
    case "win":
      dispatch("win");
      break;
    case "lose":
      dispatch("lose");
      break;
  }

  export const reset = () => {
    minesweeper = createMinesweeper(width, height, bombCount);
  };
</script>

<table>
  {#each makeMap(minesweeper) as line, y}
    <tr>
      {#each line as block, x}
        <td>
          <button
            class:opened={block.state === "opened"}
            disabled={block.state === "opened"}
            on:click={() => {
              if (block.state !== "unopened") return;
              minesweeper = open(minesweeper, x, y);
            }}
            on:contextmenu|preventDefault={() =>
              (minesweeper = toggleFlag(minesweeper, x, y))}
          >
            {#if block.state === "opened"}
              {block.isBomb ? "💥" : getAroundBombCount(minesweeper, x, y)}
            {:else if block.state === "flagged"}
              🚩
            {:else}
              &nbsp;
            {/if}
          </button>
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style>
  table {
    border-collapse: collapse;
    table-layout: fixed;
  }
  button {
    width: 2em;
    height: 2em;
    box-sizing: border-box;
    border: outset 2px #ccc;
  }
  button.opened {
    border: 2px solid transparent;
  }
</style>
