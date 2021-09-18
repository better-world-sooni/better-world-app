import {
  useNavigation
} from '@react-navigation/native';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { RefreshControl, StyleSheet, Animated } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import '@react-native-firebase/auth';
import { Col } from 'src/components/common/Col';
import { Div } from 'src/components/common/Div';
import { Img } from 'src/components/common/Img';
import { Row } from 'src/components/common/Row';
import { Span } from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import { IMAGES } from 'src/modules/images';
import { NAV_NAMES } from 'src/modules/navNames';
import { FlatList, ScrollView, View } from 'src/modules/viewComponents';
import { useApiPOST, useApiSelector, useReloadGET } from 'src/redux/asyncReducer';
import { useDispatch } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'src/components/MapViewDirections';
import { Dimensions } from 'react-native';
import { ICONS } from 'src/modules/icons';
import { confirmCurrentRoute } from 'src/redux/pathReducer';
import { Map, PlusSquare, Menu, Plus, ChevronRight, ArrowRight, Code, ChevronDown, Bell, Sun, Thermometer, Rss, Bluetooth, MessageCircle, AlertCircle, Heart, Send, Search } from 'react-native-feather';
import RouteShelf from 'src/components/RouteShelf';
import MapboxGL from "@react-native-mapbox-gl/maps";
import type {CameraSettings} from "@react-native-mapbox-gl/maps"
import { HAS_NOTCH } from 'src/modules/contants';
import BottomNav from 'src/components/BottomNav';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from "@react-native-community/blur";

const HomeScreen = (props) => {
  MapboxGL.setAccessToken("pk.eyJ1Ijoibm9tYWNndWZmaW5zIiwiYSI6ImNrdGp2cHozYzBxZHAzMW1zcWZ3c2p2aXAifQ.NsgkwiPWRhtBN5RX4wwa5w");
  
  const {data: defaultTo, isLoading} = useApiSelector(APIS.route.default);
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const dispatch = useDispatch()

  const pullToRefresh = () => {
    apiGET(APIS.route.default())
  };


  const [Route, setRoute] = useState(null)

  useEffect(() => {
    pullToRefresh();
  }, []);
  useEffect(() => {
    if(defaultTo){
      setRoute(defaultTo.default_route.route)
    };
  }, [isLoading]);

  const onPressMyRoute = () => {
    navigation.navigate(NAV_NAMES.Map);
  }
  // const onPressSunganCam = () => {
  //   navigation.navigate(NAV_NAMES.SunganCam);
  // }
  const expandSearchTab = () => {
		dispatch(confirmCurrentRoute(false));
	}
  const onPressFind = () => {
    navigation.navigate(NAV_NAMES.Map);
    expandSearchTab()
  }
  const onPressMood = () => {
    navigation.navigate(NAV_NAMES.Mood)
  }
  

  const calculatInitialMapRegion = () => {
		const bounds = Route?.bounds
		if (bounds){
			return {
        ne: [
          bounds.northeast.lng, 
          bounds.northeast.lat,
        ], 
        sw: [
          bounds.southwest.lng,
          bounds.southwest.lat, 
        ]
      }
    }
		else {
			return {
        ne: [37.715133, 127.269311], 
        sw:  [37.413294, 126.734086],
      }
    }

	}


  const [scrollOffset, setScrollOffset] = useState(0)
  const handleScroll = (scrollEvent) => {
    const offset = scrollEvent.nativeEvent.contentOffset.y  
    if(offset <= 120 && offset >= 0){
      console.log(offset)
      setScrollOffset(offset/100)
    }
  }

  const HEADER_MAX_HEIGHT = 100;
  const HEADER_MIN_HEIGHT = 0;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const animatedScrollYValue = useRef(new Animated.Value(0)).current;
  const headerOpacity = animatedScrollYValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const dividerOpacity = animatedScrollYValue.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });


  const iconSettings = {
    strokeWidth:2,
    color: "black", 
    height: 20,
  }

  return (
    
  <Div flex>
    <LinearGradient style={{flex:1}} colors={["#edfffe", "#f5f5f5"]}>
    <Div flex
    relative
    borderTopRightRadius={20}
    borderTopLeftRadius={20}
    >
    <Div h={HAS_NOTCH ? 44 : 20} />
    <Div px20 >
      <Row rounded20 overflowHidden >
        <Col auto itemsCenter justifyCenter>
          <RouteShelf></RouteShelf>
        </Col>
        <Col/>
        <Col auto>
          {/* <Animated.View style={{opacity: headerOpacity, transform: [{scaleX: headerOpacity, }]}}> */}
          <Animated.View >
              <Row py10 rounded20 overflowHidden my10 w120>
                <Col itemsCenter justifyCenter >
                    <AlertCircle {...iconSettings} color={"red"}></AlertCircle>
                </Col>
                <Col itemsCenter justifyCenter >
                    <PlusSquare {...iconSettings} color={"black"}></PlusSquare>
                </Col>
                <Col itemsCenter justifyCenter>
                    <Bell {...iconSettings} color={"black"}></Bell>
                </Col>
              </Row>
              <Animated.View
                  style={{
                    opacity: dividerOpacity,
                    borderBottomColor: 'gray',
                    borderBottomWidth: 0.2,
                  }}
                />
          </Animated.View>
        </Col>
      </Row>
    </Div>
  <Animated.ScrollView 
    showsVerticalScrollIndicator={false}
    stickyHeaderIndices={[1]}
    onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedScrollYValue } } }], {useNativeDriver: true})}
    scrollEventThrottle={16}
    refreshControl={
    <RefreshControl refreshing={isLoading} onRefresh={pullToRefresh} />
    }
  >
  <LinearGradient style={{flex:1}} colors={["#edfffe", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5"]}>
    {/* <Animated.View style={{opacity: headerOpacity, transform: [{scaleX: headerOpacity, }]}}>
        <Row py10 rounded20 overflowHidden mb10 mx20 bgWhite>
          <Col itemsCenter justifyCenter>
              <AlertCircle {...iconSettings}></AlertCircle>
          </Col>
          <Col itemsCenter justifyCenter>
              <Plus {...iconSettings}></Plus>
          </Col>
          <Col itemsCenter justifyCenter>
              <Bell {...iconSettings}></Bell>
          </Col>
        </Row>
      </Animated.View> */}
        <Div mx20> 
          <Row h250 rounded20 overflowHidden my10 bgWhite>
            <Col w={"50%"} px20 py10>
              <Row><Span fontSize={14}>예상도착 시간</Span></Row>
              <Row><Span bold fontSize={30}>31분</Span></Row>
            </Col>
            <Col w={"50%"}>
              <MapboxGL.MapView
                style={{flex: 1}} 
                styleURL={"mapbox://styles/nomacguffins/cktjvxy3m0sd017qwn660ct0g"}
                logoEnabled={false}
                compassEnabled={false}
                zoomEnabled={false}
                scrollEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
                >
                  <MapboxGL.UserLocation></MapboxGL.UserLocation>
                  <MapboxGL.Camera 
                    // maxBounds={{
                    //   ne: [37.715133, 127.269311], 
                    //   sw:  [37.413294, 126.734086],
                    // }}
                    defaultSettings={{bounds: calculatInitialMapRegion()}}
                    bounds={calculatInitialMapRegion()}
                    zoomLevel={11}></MapboxGL.Camera>
                  {Route && (
                    <MapViewDirections
                      route={Route}
                    />
                  )}
              </MapboxGL.MapView>
            </Col>
          </Row>
          <Row my5 >
            <Col>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Div bgWhite rounded20 overflowHidden py5 px10 mr10>
                <Search {...iconSettings}></Search>
              </Div>
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
            <Row rounded20 overflowHidden my10 backgroundColor={'rgb(255, 224, 222)'} flex py5>
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
                  <Col auto><Span fontSize={100}>{"🚨"}</Span></Col>
                  <Col></Col>
                </Row>
                <Row itemsCenter px20 pt10 pb5>
                  <Col justifyEnd auto ><Span medium color={'black'} fontSize={14} bold>에바야...</Span></Col>
                  <Col></Col>
                  <Col auto>
                    <Row>
                      <Col auto px5><Send {...iconSettings}></Send></Col>
                      <Col auto px5><MessageCircle {...iconSettings}></MessageCircle></Col>
                      <Col auto px5><Heart {...iconSettings}></Heart></Col>
                    </Row>
                  </Col>
                </Row>
                <Row itemsCenter px20 pb10 pt5>
                  <Span color={'black'}>ㅈㄴ 늦었다 진짜 와</Span><Span ml5 color={'gray'}>...더보기</Span>
                </Row>
                <Row itemsCenter px20 py5>
                  <Span color={'gray'}>50개 댓글 더보기</Span>
                </Row>
                <Row itemsCenter justifyCenter px20 pb10 pt5 flex>
                  <Col auto itemsCenter justifyCenter rounded20 overflowHidden><Img source={IMAGES.example2} w15 h15 ></Img></Col>
                  <Col mx10 justifyCenter><Row><Span medium color={'black'} fontSize={14} >irlyglo</Span><Span ml5 fontSize={14}>그래서 어떻게 했어?</Span></Row></Col>
                  <Col auto itemsCenter justifyCenter><Heart color={"black"} height={14}></Heart></Col>
                </Row>
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
                <Row itemsCenter px20 pt10 pb5>
                  <Col justifyEnd auto ><Span fontSize={14} medium color={'black'} bold>에바야...</Span></Col>
                  <Col></Col>
                  <Col auto>
                    <Row>
                      <Col auto px5><Send {...iconSettings}></Send></Col>
                      <Col auto px5><MessageCircle {...iconSettings}></MessageCircle></Col>
                      <Col auto px5><Heart {...iconSettings}></Heart></Col>
                    </Row>
                  </Col>
                </Row>
                <Row itemsCenter px20 pb10 pt5>
                  <Span color={'black'}>ㅈㄴ 늦었다 진짜 와</Span><Span ml5 color={'gray'}>...더보기</Span>
                </Row>
                <Row itemsCenter px20 py5 bgWhite>
                  <Span color={'gray'}>50개 댓글 더보기</Span>
                </Row>
                <Row itemsCenter justifyCenter px20 pb10 pt5 flex>
                  <Col auto itemsCenter justifyCenter rounded20 overflowHidden><Img source={IMAGES.example2} w15 h15 ></Img></Col>
                  <Col mx10 justifyCenter><Row><Span medium color={'black'} fontSize={14} >irlyglo</Span><Span ml5 fontSize={14} >그래서 어떻게 했어?</Span></Row></Col>
                  <Col auto itemsCenter justifyCenter><Heart color={"black"} height={14}></Heart></Col>
                </Row>
              </Col>
            </Row>
          </Div>
          </LinearGradient>
        </Animated.ScrollView>
      </Div>
    </LinearGradient>
    </Div>
  
  )
        
}
        
export default HomeScreen;
