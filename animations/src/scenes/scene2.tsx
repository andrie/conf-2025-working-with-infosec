import { makeScene2D, Circle } from "@motion-canvas/2d";
import { createRef, all } from "@motion-canvas/core";

export default makeScene2D(function* (view) {
  const myCircle = createRef<Circle>();

  view.add(
    <Circle ref={myCircle} x={-300} width={140} height={140} fill="#e13238" />
  );

  yield* all(
    myCircle().position([300, 100], 1).back(1),
    myCircle().fill("#00f", 1).back(1),
  );
});
