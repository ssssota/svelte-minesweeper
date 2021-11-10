export const shuffle = <T>(arr: T[]): T[] => {
  const cloned = arr.slice();
  for (let i = arr.length - 1; i > 1; i--) {
    const rand = Math.floor(Math.random() * i);
    [cloned[i], cloned[rand]] = [cloned[rand], cloned[i]];
  }
  return cloned;
};

export const clone = <T extends Record<string, unknown>>(arr: T[]): T[] =>
  arr.map((item) => ({ ...item }));
