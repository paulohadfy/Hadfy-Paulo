import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Opening title card — fades in over black, holds, then dissolves.
 * Designed to cover the first segment cold open.
 */
export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const HOLD_END = 60;    // 2 s hold
  const FADE_OUT_START = HOLD_END;
  const FADE_OUT_END = HOLD_END + 20;

  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.2 },
  });

  const opacity =
    frame < FADE_OUT_START
      ? interpolate(frame, [0, 20], [0, 1], {
          extrapolateRight: "clamp",
        })
      : interpolate(frame, [FADE_OUT_START, FADE_OUT_END], [1, 0], {
          extrapolateRight: "clamp",
        });

  const scale = interpolate(scaleSpring, [0, 1], [0.92, 1]);

  if (frame > FADE_OUT_END) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.65)",
        opacity,
        zIndex: 20,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: "center",
          fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#e8b400",
            margin: "0 auto 24px",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          BLANDAT
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "#e8b400",
            letterSpacing: "0.22em",
            marginTop: 12,
            textTransform: "uppercase",
          }}
        >
          Hallgrens Plåt
        </div>
        {/* Decorative bottom line */}
        <div
          style={{
            width: 80,
            height: 3,
            backgroundColor: "#e8b400",
            margin: "24px auto 0",
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};
