import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"

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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.333 14.018c0-6.146 4.912-11.685 11.69-11.685 6.627 0 11.644 5.434 11.644 11.65 0 7.209-5.88 11.684-11.667 11.684-1.913 0-4.037-.514-5.74-1.52-.595-.361-1.096-.63-1.738-.42l-2.357.701c-.595.187-1.131-.28-.957-.911L3.99 20.9c.128-.362.105-.748-.082-1.052-1.003-1.846-1.575-3.867-1.575-5.83zm10.15 0c0 .83.665 1.495 1.494 1.507.828 0 1.493-.678 1.493-1.496a1.49 1.49 0 00-1.493-1.495 1.487 1.487 0 00-1.494 1.484zm5.379.011c0 .818.665 1.496 1.493 1.496.828 0 1.494-.678 1.494-1.496a1.49 1.49 0 00-1.494-1.495 1.49 1.49 0 00-1.493 1.495zm-9.264 1.496a1.505 1.505 0 01-1.493-1.496c0-.83.665-1.495 1.493-1.495a1.49 1.49 0 011.494 1.495c0 .818-.665 1.484-1.494 1.496z"
                fill="url(#paint0_linear_121_252)"
            />
            <Defs>
                <LinearGradient
                    id="paint0_linear_121_252"
                    x1={2.3335}
                    y1={2.3335}
                    x2={27.4045}
                    y2={4.38011}
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
