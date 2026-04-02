import { staticFile } from "remotion";

// ─────────────────────────────────────────────────
//  OUTPUT SETTINGS
// ─────────────────────────────────────────────────
export const editConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
  /** Total duration of the final video in frames (fps × seconds) */
  durationInFrames: 30 * 60, // change to match your total edited length
};

// ─────────────────────────────────────────────────
//  VIDEO CLIPS
//  Add one entry per clip in playback order.
//  startAt / endAt = frames in the OUTPUT timeline.
//  trimStart = seconds to skip from the SOURCE video.
// ─────────────────────────────────────────────────
export const videoClips = [
  {
    src: staticFile("videos/bland1.mov"),
    startAt: 0,
    endAt: 30 * 30,   // first 30 seconds
    trimStart: 0,     // start from beginning of source
    volume: 1,
  },
  // Add more clips below to combine them:
  // {
  //   src: staticFile("videos/bland1.mov"),
  //   startAt: 30 * 30,
  //   endAt: 30 * 60,
  //   trimStart: 40,   // skip first 40 seconds of source
  //   volume: 1,
  // },
];

// ─────────────────────────────────────────────────
//  TEXT OVERLAYS / SUBTITLES
//  startAt / endAt = frames in the OUTPUT timeline.
// ─────────────────────────────────────────────────
export const textOverlays = [
  // {
  //   text: "Welcome!",
  //   startAt: 0,
  //   endAt: 30 * 5,
  //   position: "center" as const,
  //   fontSize: 72,
  //   color: "#ffffff",
  //   backgroundColor: "rgba(0,0,0,0.6)",
  //   fadeDuration: 15,
  // },
  // {
  //   text: "Subtitle text here",
  //   startAt: 30 * 10,
  //   endAt: 30 * 15,
  //   position: "bottom" as const,
  // },
];

// ─────────────────────────────────────────────────
//  AUDIO TRACKS (background music / voiceover)
//  Place audio files in public/audio/
// ─────────────────────────────────────────────────
export const audioTracks = [
  // {
  //   src: staticFile("audio/music.mp3"),
  //   startAt: 0,
  //   endAt: editConfig.durationInFrames,
  //   volume: 0.3,  // background music at 30%
  //   trimStart: 0,
  // },
];
