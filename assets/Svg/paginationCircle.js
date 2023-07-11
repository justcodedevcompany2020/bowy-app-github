import * as React from "react"
import Svg, { G, Circle, Defs, LinearGradient, Stop } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgComponent(props) {
    return (
        <Svg
            width={94}
            height={94}
            viewBox="0 0 94 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <G filter="url(#filter0_d_101_52)">
                <Circle cx={47} cy={43} r={17} fill="url(#paint0_linear_101_52)" />
            </G>
            <Defs>
                <LinearGradient
                    id="paint0_linear_101_52"
                    x1={30}
                    y1={26}
                    x2={66.5321}
                    y2={28.9822}
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#34BE7C" />
                    <Stop offset={1} stopColor="#2EB6A5" />
                </LinearGradient>
            </Defs>
        </Svg>
    )
}

export default SvgComponent
