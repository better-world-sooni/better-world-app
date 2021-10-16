  import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
  import { Col } from 'src/components/common/Col';
  import { Div } from 'src/components/common/Div';
  import { Img } from 'src/components/common/Img';
  import { Row } from 'src/components/common/Row';
  import { Span } from 'src/components/common/Span';
  import APIS from 'src/modules/apis';
  import { IMAGES } from 'src/modules/images';
  import { NAV_NAMES } from 'src/modules/navNames';
  import { ScrollView, View } from 'src/modules/viewComponents';
  import { useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
  import { shallowEqual, useDispatch, useSelector } from 'react-redux';
  import { PlusSquare, Bell, MessageCircle, AlertCircle, Heart, Send, Search, ChevronLeft } from 'react-native-feather';
  import { setUserSearchDestination, setUserSearchOrigin } from 'src/redux/pathReducer';
  import { shortenAddress } from 'src/modules/utils';
  import { RootState } from 'src/redux/rootReducer';
import { Checkbox, Input, NativeBaseProvider } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import TopHeader from 'src/components/TopHeader';
import { useNavigation } from '@react-navigation/core';
import { GO_COLOR } from 'src/modules/constants';
  
  const ReportScreen = (props) => {
  
    const iconSettings = {
      strokeWidth:2,
      color: "black", 
      height: 20,
    }
  
    return (
      
    <Div flex>
      <Div flex
      bgWhite
      relative
      >
      <TopHeader headerColor={ "rgb(255, 224, 222)"} route={useNavigation} title={"신고"} nextText={"공유"} onPressNext={console.log}></TopHeader>
    <ScrollView 
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
    >
        <Div mx20> 
        <NativeBaseProvider>
            <Row rounded20 overflowHidden flex py5>
              <Col>
                <Row py20 borderGray300 borderBottom>
                  <Col auto rounded20 p20 bg={"rgb(255, 224, 222)"}>
                    <Row justifyCenter><Span fontSize={50}>{"🚨"}</Span></Row>
                    <Row justifyCenter><Span medium color={GO_COLOR} fontSize={10}>{"첨부파일 변경"}</Span></Row>
                  </Col>
                  <Col px20>
                      <Input 
                      isFullWidth 
                      flex={1}
                      numberOfLines={5}
                      placeholder={"불편 사항 입력"}
                      paddingX={0}
                      paddingY={0}
                      borderWidth={0}></Input>
                  </Col>
                </Row>
                <Row itemsCenter py20 borderGray300 borderBottom>
                  <Col>
                    <Row mb10>
                      <Span color={'black'} medium>교통 수단</Span>
                    </Row>
                    <Row itemsCenter >
                      <Col auto rounded20 bg={"black"} px10 py5 mr10>
                        <Span medium fontSize={14} white><FontAwesomeIcon icon="subway" color={"white"}></FontAwesomeIcon> 지하철</Span>
                      </Col>
                      <Col auto rounded20 bg={"gray"} px10 py5 mr10>
                        <Span medium fontSize={14} white><FontAwesomeIcon icon="bus" color={"white"}></FontAwesomeIcon> 버스</Span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row itemsCenter py20 borderGray300 borderBottom>
                  <Col>
                    <Row mb10>
                      <Span color={'black'} medium>호선</Span>
                    </Row>
                    <Row itemsCenter>
                      <Col auto rounded20 bg={"#0d3692"} px10 py5 mr10>
                        <Span medium fontSize={14} white>1호선</Span>
                      </Col>
                      <Col auto rounded20 bg={"gray"} px10 py5 mr10>
                        <Span medium fontSize={14} white>2호선</Span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row itemsCenter py20 borderGray300 borderBottom>
                  <Col>
                    <Row mb10>
                      <Span color={'black'} medium>차량번호</Span>
                    </Row>
                    <Row>
                      <Input 
                      paddingX={0}
                      paddingY={0}
                      placeholder={'칸이동 문 위에 있는 차량번호 입력'}
                      borderWidth={0}></Input>
                    </Row>
                  </Col>
                </Row>
                <Row itemsCenter py20 borderGray300 borderBottom>
                  <Col>
                    <Row>
                      <Checkbox value={"true"} aria-label={"공유하기"}></Checkbox><Span color={'black'} medium ml10>피드에 같이 올리기</Span>
                    </Row>
                  </Col>
                </Row>
                <Row></Row>
              </Col>
            </Row>
            </NativeBaseProvider>
            </Div>
          </ScrollView>
        </Div>
      </Div>
    
    )
          
  }
          
  export default ReportScreen;
  