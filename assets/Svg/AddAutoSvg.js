import * as React from "react"
import Svg, {
    G,
    Circle,
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
            width={116}
            height={114}
            viewBox="0 0 116 114"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G filter="url(#filter0_d_121_227)">
                <Circle cx={58} cy={54} r={28} fill="url(#paint0_linear_121_227)" />
            </G>
            <G clipPath="url(#clip0_121_227)">
                <Path
                    d="M56.417 46v6.416H50a1.583 1.583 0 100 3.167h6.417V62a1.583 1.583 0 103.166 0v-6.417H66a1.583 1.583 0 000-3.166h-6.417V46a1.583 1.583 0 00-3.166 0z"
                    fill="#fff"
                    stroke="#fff"
                    strokeWidth={0.5}
                />
            </G>
            <Defs>
                <LinearGradient
                    id="paint0_linear_121_227"
                    x1={30}
                    y1={26}
                    x2={90.1705}
                    y2={30.9119}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#34BE7C" />
                    <Stop offset={1} stopColor="#2EB6A5" />
                </LinearGradient>
                <ClipPath id="clip0_121_227">
                    <Path fill="#fff" transform="translate(42 38)" d="M0 0H32V32H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export default SvgComponent
