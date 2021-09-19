import React from "react"
import { Bell, Code } from "react-native-feather"
import { HAS_NOTCH } from "src/modules/contants"
import { Col } from "./common/Col"
import { Div } from "./common/Div"
import { Row } from "./common/Row"
import { Span } from "./common/Span"


const RouteShelf = ({origin, destination}) => {

    
    return(
        <Row itemsCenter py5 px10 rounded20 auto >
            <Col flex={1}><Span bold fontSize={14} color={"black"} numberOfLines={1} ellipsizeMode='head'>{origin}</Span></Col>
            <Col auto mx5>
            <Code color={"black"} height={14}></Code>
            </Col>
            <Col flex={1}><Span bold fontSize={14} color={"black"} numberOfLines={1} ellipsizeMode='head'>{destination}</Span></Col>
        </Row>
    )
}

export default RouteShelf