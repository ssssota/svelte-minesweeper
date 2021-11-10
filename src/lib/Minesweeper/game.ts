import type { Minesweeper, Block } from "./types";
import { clone, shuffle } from "./utils";

const createBlankMinesweeper = (width: number, height: number): Minesweeper =>
  Array(width)
    .fill(0)
    .flatMap((_, x) =>
      Array(height)
        .fill(0)
        .map<Block>((_, y) => ({
          x,
          y,
          state: "unopened",
          isBomb: false,
        }))
    );

const makeBombs = (
  minesweeper: Minesweeper,
  bombCount: number
): Minesweeper => {
  const cloned = clone(minesweeper);
  const noBombBlocks = shuffle(cloned.filter((b) => !b.isBomb));
  if (noBombBlocks.length <= bombCount)
    throw new Error(`Invalid bomb count ${bombCount}`);
  for (let i = 0; i < bombCount; i++) noBombBlocks[i].isBomb = true;
  return cloned;
};

export const createMinesweeper = (
  width: number,
  height: number,
  bombCount: number
): Minesweeper => makeBombs(createBlankMinesweeper(width, height), bombCount);

export const getBlock = (
  minesweeper: Minesweeper,
  x: number,
  y: number
): Block | undefined => minesweeper.find((b) => b.x === x && b.y === y);

export const getAroundBlocks = (
  minesweeper: Minesweeper,
  x: number,
  y: number
): Block[] =>
  minesweeper
    .filter((b) => x - 1 <= b.x && b.x <= x + 1 && y - 1 <= b.y && b.y <= y + 1)
    .filter((b) => b.x !== x || b.y !== y);

export const getAroundBombCount = (
  minesweeper: Minesweeper,
  x: number,
  y: number
): number => getAroundBlocks(minesweeper, x, y).filter((b) => b.isBomb).length;

export const open = (
  minesweeper: Minesweeper,
  x: number,
  y: number
): Minesweeper => {
  let cloned = clone(minesweeper);
  const block = getBlock(cloned, x, y);
  if (!block) throw new Error(`Invalid position (${x},${y})`);
  if (block.state === "flagged") throw new Error("Flagged");
  block.state = "opened";

  if (getAroundBombCount(cloned, x, y) === 0)
    getAroundBlocks(cloned, x, y).forEach((b) => {
      if (b.state === "opened") return;
      cloned = open(cloned, b.x, b.y);
    });
  return cloned;
};

export const toggleFlag = (
  minesweeper: Minesweeper,
  x: number,
  y: number
): Minesweeper => {
  const cloned = clone(minesweeper);
  const block = getBlock(cloned, x, y);
  if (!block) throw new Error(`Invalid position (${x},${y})`);
  if (block.state === "opened") throw new Error("Already opened");
  block.state = block.state === "flagged" ? "unopened" : "flagged";
  return cloned;
};

export const makeMap = (minesweeper: Minesweeper): Block[][] => {
  const map: Block[][] = [];
  for (const block of minesweeper) {
    map[block.y] = map[block.y] ?? [];
    map[block.y][block.x] = block;
  }
  return map;
};

export const checkWin = (minesweeper: Minesweeper): boolean =>
  minesweeper.every((b) => b.state === "opened" || b.isBomb);
export const checkLose = (minesweeper: Minesweeper): boolean =>
  minesweeper.some((b) => b.isBomb && b.state === "opened");
export const checkResult = (
  minesweeper: Minesweeper
): "win" | "lose" | undefined =>
  checkLose(minesweeper) ? "lose" : checkWin(minesweeper) ? "win" : undefined;
