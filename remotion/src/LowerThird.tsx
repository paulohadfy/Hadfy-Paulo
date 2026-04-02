import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface LowerThirdProps {
  title: string;
  subtitle: string;
  startFrame: number;
  durationFrames: number;
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  title,
  subtitle,
  startFrame,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - startFrame;
  const endFrame = durationFrames;
  const outFrame = durationFrames - 18; // start exit 18 frames early

  if (localFrame < 0 || localFrame > endFrame) return null;

  // Slide-in from left
  const slideIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.7 },
  });

  // Slide-out to left
  const slideOut =
    localFrame > outFrame
      ? interpolate(localFrame, [outFrame, endFrame], [0, -1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  const translateX = interpolate(slideIn, [0, 1], [-60, 0]) + slideOut * 60;
  const opacity =
    localFrame > outFrame
      ? interpolate(localFrame, [outFrame, endFrame], [1, 0])
      : slideIn;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 80,
        opacity,
        transform: `translateX(${translateX}px)`,
        fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: 4,
          height: "100%",
          backgroundColor: "#e8b400",
          position: "absolute",
          left: -14,
          top: 0,
          borderRadius: 2,
        }}
      />
      {/* Title */}
      <div
        style={{
          fontSize: 36,
          fontWeight: 900,
          color: "#ffffff",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          letterSpacing: "0.02em",
          lineHeight: 1,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>
      {/* Subtitle */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 400,
          color: "#e8b400",
          marginTop: 6,
          letterSpacing: "0.08em",
          textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};
