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
                d="M18.491 2.918c.736 0 1.471.103 2.17.338 4.306 1.4 5.858 6.125 4.562 10.255a14.848 14.848 0 01-3.51 5.61 44.868 44.868 0 01-7.387 5.787l-.291.176-.304-.188a44.441 44.441 0 01-7.43-5.786 15.088 15.088 0 01-3.513-5.599c-1.318-4.13.233-8.855 4.586-10.28a5.273 5.273 0 011.037-.243h.14c.328-.048.654-.07.98-.07h.129c.735.022 1.446.15 2.136.385h.069a.406.406 0 01.105.069c.257.082.501.176.735.304l.443.198c.107.057.227.145.331.22.066.048.125.091.17.119.02.01.04.022.059.034.1.058.204.119.292.186a7.307 7.307 0 014.491-1.515zm3.104 8.4a.96.96 0 00.921-.888v-.139c.035-1.635-.955-3.115-2.461-3.687a.934.934 0 00-1.179.584.954.954 0 00.584 1.2 1.953 1.953 0 011.248 1.832v.036c-.022.267.058.525.222.723a.977.977 0 00.665.339z"
                fill="url(#paint0_linear_121_208)"
            />
            <Defs>
                <LinearGradient
                    id="paint0_linear_121_208"
                    x1={2.33301}
                    y1={2.91748}
                    x2={27.3864}
                    y2={5.0703}
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
