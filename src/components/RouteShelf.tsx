import React from "react"
import { Bell, Code } from "react-native-feather"
import { Col } from "./common/Col"
import { Div } from "./common/Div"
import { Row } from "./common/Row"
import { Span } from "./common/Span"


const RouteShelf = () => {
    return(
        <Div relative zIndex={100}> 
        <Row h40 itemsCenter px20 bgWhite rounded20>
            <Col auto rounded20 backgroundColor={'rgb(242, 242, 247)'} px10 py5>
            <Row itemsCenter justifyEnd>
                <Col auto><Span bold>역삼동 793-18</Span></Col>
                <Col auto mx10>
                <Code color={"black"} height={15}></Code>
                </Col>
                <Col auto><Span bold>강남 WeWork</Span></Col>
                {/* <Col auto><Span bold>모든 노선</Span></Col> */}
            </Row>
            </Col>
            <Col ></Col>
            <Col auto ml5>
            <Div relative onPress={()=> {}} >
                {true && (
                <Div absolute bgDanger w10 h10 rounded16 zIndex5 top={-3} right />
                )}
                <Bell stroke="#2e2e2e" fill="#fff" strokeWidth={1.5} ></Bell>
            </Div>
            </Col>
        </Row>
            {/* <Row top40 itemsCenter absolute >
                <Col ></Col>
                <Col auto borderBottomLeftRadius={20} backgroundColor={'#0d3692'} px10 py5>
                <Row itemsCenter justifyEnd>
                    <Col auto><Span bold white>서울역</Span></Col> 
                </Row>
                </Col>
            </Row> */}
        </Div>
    )
}

export default RouteShelf