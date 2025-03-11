import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const BatteryIcon = (props: any) => (
  <Svg
    width={24}
    height={26}
    viewBox="0 0 30 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_78_160)">
      <Path
        d="M6.25 23.4782H3.75C3.08696 23.4782 2.45107 23.2034 1.98223 22.7142C1.51339 22.2249 1.25 21.5614 1.25 20.8695V10.4347C1.25 9.74288 1.51339 9.07934 1.98223 8.59012C2.45107 8.10089 3.08696 7.82605 3.75 7.82605H7.7375M18.75 7.82605H21.25C21.913 7.82605 22.5489 8.10089 23.0178 8.59012C23.4866 9.07934 23.75 9.74288 23.75 10.4347V20.8695C23.75 21.5614 23.4866 22.2249 23.0178 22.7142C22.5489 23.2034 21.913 23.4782 21.25 23.4782H17.2625M28.75 16.9565V14.3478M13.75 7.82605L8.75 15.6521H16.25L11.25 23.4782"
        stroke="#1E1E1E"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_78_160">
        <Rect width={30} height={31.3043} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default BatteryIcon;
