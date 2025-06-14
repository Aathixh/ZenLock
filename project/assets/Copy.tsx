import * as React from "react";
import Svg, { Rect, Defs, Pattern, Use, Image } from "react-native-svg";
const SVGComponent = (props: any) => (
  <Svg
    width={21}
    height={24}
    viewBox="0 0 21 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <Rect width={21} height={24} fill="url(#pattern0_156_139)" />
    <Defs>
      <Pattern
        id="pattern0_156_139"
        patternContentUnits="objectBoundingBox"
        width={1}
        height={1}
      >
        <Use
          xlinkHref="#image0_156_139"
          transform="matrix(0.01 0 0 0.00875 0 0.0625)"
        />
      </Pattern>
      <Image
        id="image0_156_139"
        width={100}
        height={100}
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAACIUlEQVR4nO3dsU4UYRRH8X9CoxTGxhhrQ294CN5ACfAMRFsqbGhMpMFHgIJJNDwFYELpE0hFYiGoBY2XbJzaoSA7Z/Y7v+S2ZOaeJZPZ4ttEkiRJkqbhaZLNJPtJjpJ0jQzOcpK9JH+SVIOD8iLJBWApZZDkcZKvgIWUQf7ZAyyjAIN5gLf6zChikC3AIgoyCPuARRRkEI4GLvIS8H7QtfQe0g0EwVxoKwwCYxAYg8AYBMYgMAaBMUgDQZ4l2UlyluQK8AZeDzS3/Yvy5yQbSZamEGQ7yQ1geTWH+ZZklRzkALCkmvPMvilfIwbZBiynRpqfSVZIQWbPjGvAYmrEOSEF2QEspADzkhLkFLCMAsxbSpAfgGUUYD5Rgvwd+Bsfk7xegDkbuM9jSpChT87sZhbBXL7VMMj9GQTGIDAGgTEIjEFgDAJjEBiDwBgExiAwBoExCIxBYAwCYxAYg8AYBMYgMAaBMQiMQWAMAmMQGIPAGATGIDAGgTEIjEFgDAJjEBiDwBgExiAwBoExCIxBYAwCYxCYyZy+58EBMcgY/A+BMQiMQWAMAmMQGIPATCbI7cCFngJ+zqh7gLkcuM/DQHwHnHdYgPkQiC+AZRRg3gRiA7CMGnl+JXkSiKX+YPpqeHYD8yrJb8BiaoS56H/gGWetP5i+GprzJM8DttIfTF8NPDPeJ3mUiZgdTP+u/02RbkHmsD+le530AJckSZKk/McdUd5TTQJ93XYAAAAASUVORK5CYII="
      />
    </Defs>
  </Svg>
);
export default SVGComponent;
