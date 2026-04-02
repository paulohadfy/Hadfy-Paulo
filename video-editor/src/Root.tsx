import React from "react";
import { Composition } from "remotion";
import { VideoEditor } from "./compositions/VideoEditor";
import { editConfig } from "./editConfig";

const { fps, durationInFrames, width, height } = editConfig;

export const Root: React.FC = () => {
  return (
    <Composition
      id="VideoEditor"
      component={VideoEditor}
      durationInFrames={durationInFrames}
      fps={fps}
      width={width}
      height={height}
    />
  );
};
