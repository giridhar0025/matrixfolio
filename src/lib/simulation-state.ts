export type SimulationState = {
  hero: number;
  core: number;
  intensity: number;
  pointerX: number;
  pointerY: number;
  work: number;
  scroll: number;
  dilation: number;
  construct: number;
};

export const simulationState: SimulationState = {
  hero: 0,
  core: 0,
  intensity: 1,
  pointerX: 0,
  pointerY: 0,
  work: 0,
  scroll: 0,
  dilation: 1,
  construct: 0,
};
