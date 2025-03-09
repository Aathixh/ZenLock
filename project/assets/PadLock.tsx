import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
const PadLock = (props: any) => (
  <Svg
    width={100}
    height={100}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={100} height={100} fill="url(#pattern0_13_18)" />
    <Defs>
      <Pattern
        id="pattern0_13_18"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_13_18" transform="scale(0.01)" />
      </Pattern>
      <Image
        id="image0_13_18"
        width={100}
        height={100}
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default PadLock;
