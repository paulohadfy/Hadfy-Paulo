// Video editing constants
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const FPS = 30;

// The source video file — place Blandat.mov in public/videos/
export const SOURCE_VIDEO = "/videos/Blandat.mov";

// Total duration of the source video in seconds (update after inspecting the file)
export const SOURCE_DURATION_SEC = 60;
export const SOURCE_DURATION_FRAMES = SOURCE_DURATION_SEC * FPS;

// ---------- Edit decisions (EDL) ----------
// Each segment: { start, end } in seconds of the source clip
// Silence / bad takes / pauses are cut out — only the good parts remain.
export const EDIT_DECISIONS = [
  { start: 0, end: 8 },    // Intro — keep first 8 s
  { start: 10, end: 22 },  // Cut dead air at 8–10 s
  { start: 25, end: 40 },  // Best middle section
  { start: 44, end: 55 },  // Strong closing material
];

// Derived timeline: compute frame offsets for each segment on the output timeline
export const SEGMENTS = (() => {
  let timelineFrame = 0;
  return EDIT_DECISIONS.map((seg) => {
    const durationSec = seg.end - seg.start;
    const durationFrames = Math.round(durationSec * FPS);
    const entry = {
      srcStartSec: seg.start,
      srcEndSec: seg.end,
      timelineStart: timelineFrame,
      timelineEnd: timelineFrame + durationFrames,
      durationFrames,
    };
    timelineFrame += durationFrames;
    return entry;
  });
})();

export const TOTAL_FRAMES = SEGMENTS[SEGMENTS.length - 1].timelineEnd;

// ---------- Text overlays ----------
export const LOWER_THIRDS: Array<{
  frame: number;
  durationFrames: number;
  title: string;
  subtitle: string;
}> = [
  {
    frame: 10,
    durationFrames: 90,
    title: "Blandat",
    subtitle: "Hallgrens Plåt",
  },
  {
    frame: SEGMENTS[1]?.timelineStart + 20 ?? 260,
    durationFrames: 75,
    title: "Verkstad & Hantverk",
    subtitle: "Sheet Metal Craftsmanship",
  },
  {
    frame: SEGMENTS[2]?.timelineStart + 15 ?? 570,
    durationFrames: 75,
    title: "Precision i varje detalj",
    subtitle: "Precision in every detail",
  },
];

// Transition duration in frames between segments
export const TRANSITION_FRAMES = 12;

// Colour grade LUT-style values (applied via CSS filter)
export const COLOR_GRADE = {
  // Warm, slightly cinematic look
  brightness: 1.05,
  contrast: 1.08,
  saturation: 0.92,
  sepia: 0.04,
};
