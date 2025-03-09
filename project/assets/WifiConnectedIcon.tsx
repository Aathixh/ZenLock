import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
const WifiConnectedIcon = (props: any) => (
  <Svg
    width={35}
    height={35}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={100} height={100} fill="url(#pattern0_110_32)" />
    <Defs>
      <Pattern
        id="pattern0_110_32"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use xlinkHref="#image0_110_32" transform="scale(0.01)" />
      </Pattern>
      <Image
        id="image0_110_32"
        width={100}
        height={100}
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </Defs>
  </Svg>
);
export default WifiConnectedIcon;
