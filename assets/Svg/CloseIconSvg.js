import * as React from "react"
import Svg, {
    G,
    Path,
    Defs,
    LinearGradient,
    Stop,
    ClipPath
} from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgComponent(props) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G filter="url(#filter0_d_1_93)" clipPath="url(#clip0_1_93)">
                <Path
                    d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636l4.95 4.95z"
                    fill="url(#paint0_linear_1_93)"
                />
            </G>
            <Defs>
                <LinearGradient
                    id="paint0_linear_1_93"
                    x1={5.63599}
                    y1={5.63599}
                    x2={19.3119}
                    y2={6.75239}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#34BE7C" />
                    <Stop offset={1} stopColor="#2EB6A5" />
                </LinearGradient>
                <ClipPath id="clip0_1_93">
                    <Path fill="#fff" d="M0 0H24V24H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default SvgComponent
