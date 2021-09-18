import React from "react"
import { Bell, Code } from "react-native-feather"
import { HAS_NOTCH } from "src/modules/contants"
import { Col } from "./common/Col"
import { Div } from "./common/Div"
import { Row } from "./common/Row"
import { Span } from "./common/Span"


const RouteShelf = (props) => {

    const absoluteProp ={absolute: props?.absolute}
    const shadowProp = props?.shadow ? {shadowOffset: {height: 1, width: 1}, shadowColor: "gray", shadowOpacity: 1, shadowRadius: 2} : {}

    return(
        <Row itemsCenter py5 px10 {...shadowProp} rounded20 auto>
            <Col auto><Span bold fontSize={14} color={"black"}>역삼동 793-18</Span></Col>
            <Col auto mx5>
            <Code color={"black"} height={14}></Code>
            </Col>
            <Col auto><Span bold fontSize={14} color={"black"}>강남 WeWork</Span></Col>
        </Row>
    )
}

export default RouteShelf