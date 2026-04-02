import { staticFile } from "remotion";

// ─────────────────────────────────────────────────
//  OUTPUT SETTINGS
//  Adjust durationInFrames to match your final cut length (fps × seconds).
//  e.g. 2 min video = 30 * 120 = 3600
// ─────────────────────────────────────────────────
export const editConfig = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationInFrames: 30 * 117, // ~1m57s — trim 3s opener + keep rest
};

const FPS = editConfig.fps;

// ─────────────────────────────────────────────────
//  VIDEO CLIPS
//  Edit: skip the first 3 awkward seconds of bland1.mov,
//  then play the full remaining clip.
// ─────────────────────────────────────────────────
export const videoClips = [
  {
    src: staticFile("videos/bland1.mp4"),
    startAt: 0,
    endAt: editConfig.durationInFrames,
    trimStart: 3, // skip first 3 seconds
    volume: 1,
  },
];

// ─────────────────────────────────────────────────
//  TEXT OVERLAYS
//  • Opening title fades in at 1s, stays for 4s
//  • Lower-third credit at 10s
//  • Closing tag at the end
// ─────────────────────────────────────────────────
export const textOverlays = [
  // Opening title
  {
    text: "bland1",
    startAt: FPS * 1,
    endAt: FPS * 5,
    position: "center" as const,
    fontSize: 80,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0)",
    fadeDuration: 20,
  },
  // Lower-third label
  {
    text: "videoklean",
    startAt: FPS * 10,
    endAt: FPS * 14,
    position: "bottom" as const,
    fontSize: 40,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.55)",
    fadeDuration: 12,
  },
  // Outro
  {
    text: "fin.",
    startAt: editConfig.durationInFrames - FPS * 4,
    endAt: editConfig.durationInFrames,
    position: "center" as const,
    fontSize: 64,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0)",
    fadeDuration: 20,
  },
];

// ─────────────────────────────────────────────────
//  AUDIO TRACKS
//  Original video audio is kept via VideoClip volume: 1.
//  Uncomment below to layer in background music.
//  Place the file in public/audio/ first.
// ─────────────────────────────────────────────────
export const audioTracks = [
  // {
  //   src: staticFile("audio/music.mp3"),
  //   startAt: 0,
  //   endAt: editConfig.durationInFrames,
  //   volume: 0.25,
  //   trimStart: 0,
  // },
];

// ─────────────────────────────────────────────────
//  FADE TO BLACK duration in frames at end of video
// ─────────────────────────────────────────────────
export const fadeToBlackFrames = 30; // 1 second
