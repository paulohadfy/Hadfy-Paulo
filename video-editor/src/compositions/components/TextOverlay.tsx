import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export type TextOverlayProps = {
  text: string;
  /** Frame within the composition where the text appears */
  startAt: number;
  /** Frame within the composition where the text disappears */
  endAt: number;
  /** Vertical position: "top" | "center" | "bottom" */
  position?: "top" | "center" | "bottom";
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  /** Fade duration in frames (applied at start and end) */
  fadeDuration?: number;
};

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  startAt,
  endAt,
  position = "bottom",
  fontSize = 48,
  color = "#ffffff",
  backgroundColor = "rgba(0,0,0,0.5)",
  fadeDuration = 10,
}) => {
  const frame = useCurrentFrame();
  const visible = frame >= startAt && frame < endAt;

  if (!visible) return null;

  const opacity = interpolate(
    frame,
    [startAt, startAt + fadeDuration, endAt - fadeDuration, endAt],
    [0, 1, 1, 0],
    { easing: Easing.ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const verticalAlignment: React.CSSProperties =
    position === "top"
      ? { top: "5%" }
      : position === "center"
      ? { top: "50%", transform: "translateY(-50%)" }
      : { bottom: "5%" };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        padding: "12px 24px",
        opacity,
        ...verticalAlignment,
      }}
    >
      <span
        style={{
          fontSize,
          color,
          backgroundColor,
          padding: "8px 20px",
          borderRadius: 8,
          fontFamily: "sans-serif",
          fontWeight: "bold",
          textAlign: "center",
          maxWidth: "90%",
        }}
      >
        {text}
      </span>
    </div>
  );
};
