import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M14 2.333a5.547 5.547 0 00-5.542 5.542c0 2.998 2.345 5.425 5.402 5.53a.939.939 0 01.257 0h.081a5.528 5.528 0 005.344-5.53A5.547 5.547 0 0014 2.333zM19.927 16.508c-3.255-2.17-8.564-2.17-11.842 0-1.482.992-2.298 2.334-2.298 3.769s.816 2.765 2.286 3.745c1.634 1.096 3.78 1.645 5.927 1.645s4.293-.549 5.927-1.645c1.47-.992 2.286-2.322 2.286-3.769-.011-1.435-.816-2.765-2.286-3.745z"
                fill="#D1DAE6"
            />
        </Svg>
    )
}

export default SvgComponent
