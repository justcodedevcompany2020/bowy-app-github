import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

function SvgComponent(props) {
    return (
        <Svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M13 14h-2a8.999 8.999 0 00-7.968 4.81C3.011 18.54 3 18.27 3 18 3 12.477 7.477 8 13 8V3l10 8-10 8v-5z"
                fill="url(#paint0_linear_121_477)"
            />
            <Defs>
                <LinearGradient
                    id="paint0_linear_121_477"
                    x1={3}
                    y1={3}
                    x2={24.4097}
                    y2={5.18467}
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
