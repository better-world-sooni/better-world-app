import React from "react"
import { ArrowRight} from "react-native-feather"
import { Col } from "./common/Col"
import { Row } from "./common/Row"
import { Span } from "./common/Span"


const RouteShelf = ({origin, destination}) => {

    
    return (
      <Row itemsCenter py10 px10 bgWhite>
        <Col flex={1} itemsCenter>
          <Span
            bold
            fontSize={14}
            color={'black'}
            numberOfLines={1}
            ellipsizeMode="head">
            {origin}
          </Span>
        </Col>
        <Col auto mx5>
          <ArrowRight color={'black'} height={14}></ArrowRight>
        </Col>
        <Col flex={1} itemsCenter>
          <Span
            bold
            fontSize={14}
            color={'black'}
            numberOfLines={1}
            ellipsizeMode="head">
            {destination}
          </Span>
        </Col>
      </Row>
    );
}

export default RouteShelf