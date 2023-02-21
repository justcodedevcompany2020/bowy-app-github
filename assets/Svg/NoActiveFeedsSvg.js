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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.333 12.448c0-5.586 4.48-10.114 10.008-10.114 2.654 0 5.199 1.065 7.076 2.962a10.17 10.17 0 012.93 7.152c0 5.587-4.48 10.115-10.007 10.115-5.526 0-10.007-4.528-10.007-10.115zm19.85 8.149l2.98 2.406h.051c.603.61.603 1.597 0 2.207-.603.61-1.58.61-2.183 0l-2.474-2.835a1.262 1.262 0 010-1.778 1.15 1.15 0 011.625 0z"
                fill="#D1DAE5"
            />
        </Svg>
    )
}

export default SvgComponent
