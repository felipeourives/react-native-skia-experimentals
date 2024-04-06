import { ConstellationGestureMove } from '../constellation-gesture-move/constellation-gesture-move';
import { ConstellationGesture } from '../constellation-gesture/constellation-gesture';
import { ConstellationMoveCenter } from '../constellation-move-center/constellation-move-center';
import { Constellation } from '../constellation/constellation';

export const Screens = [
  { Name: "Highlight Stars", Component: ConstellationGesture },
  { Name: "Move Stars", Component: ConstellationGestureMove },
  { Name: "Move Starts to center", Component: ConstellationMoveCenter },
  { Name: "Constellations", Component: Constellation }
];

