import React from "react";
import { Home, Map, User } from "react-native-feather";
import { Col } from "./common/Col";
import { Row } from "./common/Row";

const BottomNav = () => {
    const shadowProp = {shadowOffset: {height: 1, width: 1}, shadowColor: "gray", shadowOpacity: 1, shadowRadius: 2}
    return(
        <Row absolute bottom={30} w={"100%"} justifyCenter {...shadowProp} itemsCenter activeOpacity={1.0}>
          <Col w60 h60 rounded20 overflowHidden bgWhite auto itemsCenter justifyCenter>
            <Home color={"black" || "gray"} strokeWidth={1.5}></Home>
          </Col>
          <Col w50 h50 rounded20 overflowHidden bgWhite auto mx50 itemsCenter justifyCenter>
            <Map color={"black" || "gray"} strokeWidth={1.5}></Map>
          </Col>
          <Col w50 h50 rounded20 overflowHidden bgWhite auto itemsCenter justifyCenter>
            <User color={"black" || "gray"} strokeWidth={1.5}></User>
          </Col>
      </Row>
    )
}

export default BottomNav