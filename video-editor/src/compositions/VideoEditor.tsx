import React from "react";
import { AbsoluteFill } from "remotion";
import { VideoClip } from "./components/VideoClip";
import { TextOverlay } from "./components/TextOverlay";
import { AudioTrack } from "./components/AudioTrack";
import { videoClips, textOverlays, audioTracks } from "../editConfig";

export const VideoEditor: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Video clips — rendered in order, each shows only during its window */}
      {videoClips.map((clip, i) => (
        <AbsoluteFill key={`clip-${i}`}>
          <VideoClip {...clip} />
        </AbsoluteFill>
      ))}

      {/* Text overlays / subtitles */}
      {textOverlays.map((overlay, i) => (
        <TextOverlay key={`text-${i}`} {...overlay} />
      ))}

      {/* Audio tracks (music / voiceover) */}
      {audioTracks.map((track, i) => (
        <AudioTrack key={`audio-${i}`} {...track} />
      ))}
    </AbsoluteFill>
  );
};
