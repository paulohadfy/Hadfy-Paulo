import React from "react";
import { COLOR_GRADE } from "./constants";

/**
 * Wraps children with a CSS colour-grade filter layer.
 * Mimics a warm, slightly desaturated cinematic grade.
 */
export const ColorGrade: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { brightness, contrast, saturation, sepia } = COLOR_GRADE;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        filter: [
          `brightness(${brightness})`,
          `contrast(${contrast})`,
          `saturate(${saturation})`,
          `sepia(${sepia})`,
        ].join(" "),
      }}
    >
      {children}
    </div>
  );
};
