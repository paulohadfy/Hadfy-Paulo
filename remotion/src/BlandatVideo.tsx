import React from "react";
import { AbsoluteFill, OffthreadVideo, useCurrentFrame } from "remotion";
import { AllTransitions } from "./Transitions";
import { ColorGrade } from "./ColorGrade";
import { LowerThird } from "./LowerThird";
import { TitleCard } from "./TitleCard";
import { EndCard } from "./EndCard";
import {
  SOURCE_VIDEO,
  SEGMENTS,
  LOWER_THIRDS,
  TOTAL_FRAMES,
  FPS,
} from "./constants";

/**
 * Main composition — assembles all segments on the timeline with:
 *  • Cut-based editing (only selected segments play)
 *  • Cross-dissolve transitions between cuts
 *  • Warm cinematic colour grade
 *  • Lower-third text overlays
 *  • Opening title card & closing end card
 */
export const BlandatVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Find which segment is active at the current timeline frame
  const activeSegment = SEGMENTS.find(
    (seg) => frame >= seg.timelineStart && frame < seg.timelineEnd
  );

  // The source video playback offset for the active segment
  const srcTimeSec = activeSegment
    ? activeSegment.srcStartSec +
      (frame - activeSegment.timelineStart) / FPS
    : 0;

  // Segment boundaries for transition overlays (all segment start frames except first)
  const segmentBoundaries = SEGMENTS.slice(1).map((s) => s.timelineStart);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* ── Video layer ── */}
      <ColorGrade>
        <AbsoluteFill>
          {activeSegment ? (
            <OffthreadVideo
              src={SOURCE_VIDEO}
              startFrom={Math.round(activeSegment.srcStartSec * FPS)}
              endAt={Math.round(activeSegment.srcEndSec * FPS)}
              // Seek to the correct position within the segment
              // by remapping the timeline frame → source frame
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted={false}
            />
          ) : (
            // Black frame when between segments (edge case)
            <div style={{ width: "100%", height: "100%", backgroundColor: "black" }} />
          )}
        </AbsoluteFill>
      </ColorGrade>

      {/* ── Transitions ── */}
      <AllTransitions segmentBoundaries={segmentBoundaries} />

      {/* ── Lower thirds ── */}
      {LOWER_THIRDS.map((lt, i) => (
        <LowerThird
          key={i}
          title={lt.title}
          subtitle={lt.subtitle}
          startFrame={lt.frame}
          durationFrames={lt.durationFrames}
        />
      ))}

      {/* ── Opening title card ── */}
      <TitleCard />

      {/* ── Closing end card ── */}
      <EndCard totalFrames={TOTAL_FRAMES} />
    </AbsoluteFill>
  );
};
