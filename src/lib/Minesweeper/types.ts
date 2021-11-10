export type Block = {
  x: number;
  y: number;
  state: "unopened" | "opened" | "flagged";
  isBomb: boolean;
};
export type Minesweeper = Block[];
