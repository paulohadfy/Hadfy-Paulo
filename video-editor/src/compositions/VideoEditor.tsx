import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { VideoClip } from "./components/VideoClip";
import { TextOverlay } from "./components/TextOverlay";
import { AudioTrack } from "./components/AudioTrack";
import { videoClips, textOverlays, audioTracks, editConfig, fadeToBlackFrames } from "../editConfig";

export const VideoEditor: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = editConfig;

  // Fade in from black over first 20 frames
  const fadeInOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade to black over last `fadeToBlackFrames` frames
  const fadeOutOpacity = interpolate(
    frame,
    [durationInFrames - fadeToBlackFrames, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Video clips */}
      {videoClips.map((clip, i) => (
        <AbsoluteFill key={`clip-${i}`}>
          <VideoClip {...clip} />
        </AbsoluteFill>
      ))}

      {/* Text overlays / subtitles */}
      {textOverlays.map((overlay, i) => (
        <TextOverlay key={`text-${i}`} {...overlay} />
      ))}

      {/* Audio tracks */}
      {audioTracks.map((track, i) => (
        <AudioTrack key={`audio-${i}`} {...track} />
      ))}

      {/* Fade in from black */}
      <AbsoluteFill
        style={{ backgroundColor: "#000", opacity: 1 - fadeInOpacity, pointerEvents: "none" }}
      />

      {/* Fade to black */}
      <AbsoluteFill
        style={{ backgroundColor: "#000", opacity: fadeOutOpacity, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};
