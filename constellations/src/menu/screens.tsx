import { ConstellationGestureMove } from '../constellation-gesture-move/constellation-gesture-move';
import { ConstellationGesture } from '../constellation-gesture/constellation-gesture';
import { Constellation } from '../constellation/constellation';

export const Screens = [
  { Name: "Highlight Stars", Component: ConstellationGesture },
  { Name: "Move Stars", Component: ConstellationGestureMove },
  { Name: "Constellations", Component: Constellation }
];

