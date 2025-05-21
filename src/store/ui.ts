import { atom } from "jotai";

export const selectedPointAtom = atom<number | null>(null);

export interface InstructionsOpenState {
  rules: boolean;
  objective: boolean;
  basicRules: boolean;
  hitting: boolean;
  bearing: boolean;
  using: boolean;
  getting: boolean;
  playing: boolean;
  tips: boolean;
}

export const instructionsOpenAtom = atom<InstructionsOpenState>({
  rules: true,
  objective: true,
  basicRules: true,
  hitting: true,
  bearing: true,
  using: true,
  getting: true,
  playing: true,
  tips: true,
});
