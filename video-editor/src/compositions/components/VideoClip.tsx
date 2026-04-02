import React from "react";
import { OffthreadVideo, useVideoConfig, useCurrentFrame } from "remotion";

export type VideoClipProps = {
  /** Path to the video file, relative to /public/videos/ */
  src: string;
  /** Frame within the final composition where this clip starts */
  startAt: number;
  /** Frame within the final composition where this clip ends */
  endAt: number;
  /** Trim: skip this many seconds from the start of the source video */
  trimStart?: number;
  /** Volume multiplier: 0 = muted, 1 = full */
  volume?: number;
};

export const VideoClip: React.FC<VideoClipProps> = ({
  src,
  startAt,
  endAt,
  trimStart = 0,
  volume = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const visible = frame >= startAt && frame < endAt;

  if (!visible) return null;

  return (
    <OffthreadVideo
      src={src}
      startFrom={Math.round(trimStart * fps)}
      endAt={Math.round((trimStart + (endAt - startAt) / fps) * fps)}
      volume={volume}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};
