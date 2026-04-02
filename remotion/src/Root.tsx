import React from "react";
import { Composition } from "remotion";
import { BlandatVideo } from "./BlandatVideo";
import {
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
  FPS,
  TOTAL_FRAMES,
} from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BlandatVideo"
        component={BlandatVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
