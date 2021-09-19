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
  
  const PostScreen = (props) => {
    const {data: defaultTo, isLoading} = useApiSelector(APIS.route.default);
    const { origin, destination} = useSelector(
        (root: RootState) => (root.path.userSearch), shallowEqual
    );
    const apiGET = useReloadGET();
    const dispatch = useDispatch()
  
    const setOrigin = (origin) => {
      dispatch(setUserSearchOrigin(origin))
    }
  
    const setDestination = (destination) => {
      dispatch(setUserSearchDestination(destination))
    }
  
    const pullToRefresh = () => {
      apiGET(APIS.route.default())
    };

    useEffect(() => {
      pullToRefresh();
    }, []);

    useEffect(() => {
      if(defaultTo){
        setOrigin(shortenAddress(defaultTo.default_route.route.legs[0].start_address))
        setDestination(shortenAddress(defaultTo.default_route.route.legs[0].end_address))
      };
    }, [isLoading]);
  
    const iconSettings = {
      strokeWidth:2,
      color: "black", 
      height: 20,
    }
  
    return (
      
    <Div flex>
      <Div flex
      relative
      borderTopRightRadius={20}
      borderTopLeftRadius={20}
      >
    <ScrollView 
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[1]}
    >
        <Div mx20 > 
            <Row my5 >
              <Col>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Div bgWhite rounded20 overflowHidden px20 py5 mr10>
                  <Span bold>#순간인기</Span>
                </Div>
                <Div bgWhite rounded20 overflowHidden px20 py5 mr10>
                  <Span bold>#유머</Span>
                </Div>
                <Div bgWhite rounded20 overflowHidden px20 py5 mr10>
                  <Span bold>#뉴스</Span>
                </Div>
                <Div bgWhite rounded20 overflowHidden px20 py5 mr10>
                  <Span bold>#빌런</Span>
                </Div>
                <Div bgWhite rounded20 overflowHidden px20 py5 mr10>
                  <Span bold>#기타</Span>
                </Div>
              </ScrollView>
              </Col>
            </Row>
            <Row rounded20 overflowHidden my10 bgWhite flex py5>
              <Col>
                <Row itemsCenter px20 py10>
                  <Col auto rounded30 overflowHidden  mr10><Img source={IMAGES.example2} w30 h30 ></Img></Col>
                  <Col auto>
                    <Span medium fontSize={14}>irlglo</Span>
                  </Col>
                  <Col>
                  </Col>
                  <Col auto rounded20 bg={"#0d3692"} px10 py5>
                  <Span medium fontSize={14} white>1호선</Span>
                  </Col>
                </Row>
                <Row itemsCenter>
                  <Col></Col>
                  <Col auto><Span fontSize={100}>{"🤭"}</Span></Col>
                  <Col></Col>
                </Row>
                <Row itemsCenter px20 pt10 pb5 bgWhite>
                  <Col justifyEnd auto ><Span medium color={'black'} bold>에바야...</Span></Col>
                  <Col></Col>
                  <Col auto>
                    <Row>
                      <Col auto px5><Send {...iconSettings}></Send></Col>
                      <Col auto px5><MessageCircle {...iconSettings}></MessageCircle></Col>
                      <Col auto px5><Heart {...iconSettings}></Heart></Col>
                    </Row>
                  </Col>
                </Row>
                <Row itemsCenter px20 pb10 pt5 bgWhite>
                  <Span color={'black'}>ㅈㄴ 늦었다 진짜 와</Span><Span ml5 color={'gray'}>...더보기</Span>
                </Row>
                <Row itemsCenter px20 py5 bgWhite>
                  <Span color={'gray'}>50개 댓글 더보기</Span>
                </Row>
                <Row itemsCenter justifyCenter px20 pb10 pt5 bgWhite flex>
                  <Col auto itemsCenter justifyCenter rounded20 overflowHidden><Img source={IMAGES.example2} w15 h15 ></Img></Col>
                  <Col mx10 justifyCenter><Row><Span medium color={'black'}>irlyglo</Span><Span ml5 >그래서 어떻게 했어?</Span></Row></Col>
                  <Col auto itemsCenter justifyCenter><Heart color={"black"} height={14}></Heart></Col>
                </Row>
              </Col>
            </Row>
            </Div>
          </ScrollView>
        </Div>
      </Div>
    
    )
          
  }
          
  export default PostScreen;
  