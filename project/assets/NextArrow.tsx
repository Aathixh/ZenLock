import * as React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import Svg, { Path } from "react-native-svg";
const NextArrow = (props: any) => (
  <Svg
    width={RFValue(props.width || 12)}
    height={RFValue(props.height || 16)}
    viewBox="0 0 12 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1 1L10 7.75L1 14.5"
      stroke={props.color || "white"}
      strokeWidth={2}
    />
  </Svg>
);
export default NextArrow;
