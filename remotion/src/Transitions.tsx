import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TRANSITION_FRAMES } from "./constants";

/**
 * Cross-dissolve / fade-to-black between two segments.
 * `transitionFrame` = the output timeline frame at which the cut happens.
 */
export const CutTransition: React.FC<{
  transitionFrame: number;
}> = ({ transitionFrame }) => {
  const frame = useCurrentFrame();
  const half = TRANSITION_FRAMES / 2;

  const opacity = (() => {
    if (frame < transitionFrame - half) return 0;
    if (frame < transitionFrame) {
      // Fade to black
      return interpolate(
        frame,
        [transitionFrame - half, transitionFrame],
        [0, 1]
      );
    }
    if (frame < transitionFrame + half) {
      // Fade from black
      return interpolate(
        frame,
        [transitionFrame, transitionFrame + half],
        [1, 0]
      );
    }
    return 0;
  })();

  if (opacity === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "black",
        opacity,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
};

/**
 * Renders all segment transition overlays.
 */
export const AllTransitions: React.FC<{
  segmentBoundaries: number[];
}> = ({ segmentBoundaries }) => {
  return (
    <>
      {segmentBoundaries.map((frame) => (
        <CutTransition key={frame} transitionFrame={frame} />
      ))}
    </>
  );
};
