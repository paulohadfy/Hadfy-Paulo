import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Closing end card — fades in over the last 2 seconds.
 * Logo + call-to-action style outro.
 */
interface EndCardProps {
  totalFrames: number;
}

export const EndCard: React.FC<EndCardProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const FADE_IN_DURATION = 20;
  const startFrame = totalFrames - 90; // last 3 s

  const localFrame = frame - startFrame;
  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, FADE_IN_DURATION], [0, 1], {
    extrapolateRight: "clamp",
  });

  const logoSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });
  const translateY = interpolate(logoSpring, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
        opacity,
        zIndex: 20,
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
          fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Hallgrens Plåt
        </div>
        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: "#e8b400",
            margin: "20px auto",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontSize: 22,
            color: "#cccccc",
            letterSpacing: "0.1em",
          }}
        >
          hallgrensplat.se
        </div>
      </div>
    </div>
  );
};
