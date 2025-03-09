import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
const Lock = (props: any) => (
  <Svg
    width={100}
    height={100}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={100} height={100} fill="url(#pattern0_54_12)" />
    <Defs>
      <Pattern
        id="pattern0_54_12"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_54_12" transform="scale(0.01)" />
      </Pattern>
      <Image
        id="image0_54_12"
        width={100}
        height={100}
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default Lock;
