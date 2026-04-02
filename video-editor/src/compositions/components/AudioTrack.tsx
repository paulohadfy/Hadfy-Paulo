import React from "react";
import { Audio, useVideoConfig } from "remotion";

export type AudioTrackProps = {
  /** Path to the audio file, relative to /public/audio/ */
  src: string;
  /** Frame in the composition where the audio starts playing */
  startAt: number;
  /** Frame in the composition where the audio stops */
  endAt: number;
  /** Volume multiplier: 0 = muted, 1 = full */
  volume?: number;
  /** Seconds to skip at the start of the audio file */
  trimStart?: number;
};

export const AudioTrack: React.FC<AudioTrackProps> = ({
  src,
  startAt,
  endAt,
  volume = 1,
  trimStart = 0,
}) => {
  const { fps } = useVideoConfig();

  return (
    <Audio
      src={src}
      startFrom={Math.round(trimStart * fps)}
      endAt={Math.round((trimStart + (endAt - startAt) / fps) * fps)}
      volume={volume}
    />
  );
};
