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
import { ScrollView, View } from 'src/modules/viewComponents';
import { useApiSelector, useReloadGET, useReloadPOST } from 'src/redux/asyncReducer';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'src/components/MapViewDirections';
import { PlusSquare, Bell, MessageCircle, AlertCircle, Heart, Send, Search } from 'react-native-feather';
import RouteShelf from 'src/components/RouteShelf';
import MapboxGL from "@react-native-mapbox-gl/maps";
import type {CameraSettings} from "@react-native-mapbox-gl/maps"
import { HAS_NOTCH } from 'src/modules/constants';
import LinearGradient from 'react-native-linear-gradient';
import { setUserSearchDestination, setUserSearchOrigin } from 'src/redux/pathReducer';
import { shortenAddress } from 'src/modules/utils';
import { RootState } from 'src/redux/rootReducer';
import { setNewPosts, setPrevPosts } from 'src/redux/feedReducer';

const HomeScreen = (props) => {
  MapboxGL.setAccessToken("pk.eyJ1Ijoibm9tYWNndWZmaW5zIiwiYSI6ImNrdGp2cHozYzBxZHAzMW1zcWZ3c2p2aXAifQ.NsgkwiPWRhtBN5RX4wwa5w");
  
  const {data: starredResponse, isLoading: starredLoading } = useApiSelector(APIS.route.starred);
  const {data: mainBeforeResponse, isLoading: postsBeforeLoading } = useApiSelector(APIS.post.main.before);
  const {data: mainAfterResponse, isLoading: postsAfterLoading } = useApiSelector(APIS.post.main.after);
  const defaultRoute = starredResponse?.data?.[0]
  const { origin, destination} = useSelector(
      (root: RootState) => (root.path.userSearch), shallowEqual
  );
  const { prevPosts, newPosts } = useSelector(
    (root: RootState) => (root.feed), shallowEqual
  );
  
  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const apiPOST = useReloadPOST();
  const dispatch = useDispatch()
  const setOrigin = (origin) => dispatch(setUserSearchOrigin(origin))
  const setDestination = (destination) => dispatch(setUserSearchDestination(destination))
  const goToMap = () => navigation.navigate(NAV_NAMES.Map)
  const goToPost = () => navigation.navigate(NAV_NAMES.Post)
  const goToReport = () => navigation.navigate(NAV_NAMES.Report)

  const pullToRefresh = () => {
    apiGET(APIS.route.starred())
    apiPOST(APIS.post.main.before(1), {
      vehicleName: "2호선",
      orderBy: 0,
      size: 100
    });
    apiPOST(APIS.post.main.after(newPosts.length > 0 ? newPosts[0].sungan.id : 1), {
      vehicleName: "2호선",
      orderBy: 0,
      size: 10
    });
  }
  const [Route, setRoute] = useState(null)

  useEffect(() => {
    pullToRefresh();
  }, []);

  useEffect(() => {
    if(mainBeforeResponse){
      console.log('mainBeforeResponse',mainBeforeResponse)
      dispatch(setPrevPosts(mainBeforeResponse.data))
    };
  }, [postsBeforeLoading]);

  useEffect(() => {
    if(mainAfterResponse){
      console.log('mainAfterResponse',mainAfterResponse)
      dispatch(setNewPosts(mainAfterResponse.data))
    };
  }, [postsAfterLoading]);

  useEffect(() => {
    if(defaultRoute){
      setRoute(defaultRoute.route)
      setOrigin(shortenAddress(defaultRoute.route.legs[0].start_address))
      setDestination(shortenAddress(defaultRoute.route.legs[0].end_address))
      console.log('mainBeforeResponse', mainBeforeResponse)
    };
  }, [starredLoading]);


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
        <Col itemsCenter justifyCenter>
          <RouteShelf origin={origin} destination={destination}></RouteShelf>
        </Col>
        <Col auto>
          {/* <Animated.View style={{opacity: headerOpacity, transform: [{scaleX: headerOpacity, }]}}> */}
          <View >
              <Row py10 rounded20 overflowHidden my7 w120>
                <Col itemsCenter justifyCenter onPress={goToReport}>
                    <AlertCircle {...iconSettings} color={"red"}></AlertCircle>
                </Col>
                <Col itemsCenter justifyCenter onPress={goToPost}>
                    <PlusSquare {...iconSettings} color={"black"}></PlusSquare>
                </Col>
                <Col itemsCenter justifyCenter>
                    <Bell {...iconSettings} color={"black"}></Bell>
                </Col>
              </Row>
          </View>
        </Col>
      </Row>
    </Div>
  <Animated.ScrollView 
    showsVerticalScrollIndicator={false}
    stickyHeaderIndices={[1]}
    // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedScrollYValue } } }], {useNativeDriver: true})}
    scrollEventThrottle={16}
    refreshControl={
    <RefreshControl refreshing={starredLoading} onRefresh={pullToRefresh} />
    }
  >
  <LinearGradient style={{flex:1}} colors={["#edfffe", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5", "#f5f5f5"]}>
        <Div mx20> 
          <Row h250 rounded20 overflowHidden my10 bgWhite onPress={goToMap}>
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
                    maxBounds={{
                      ne: [37.715133, 127.269311], 
                      sw:  [37.413294, 126.734086],
                    }}
                    defaultSettings={{bounds: calculatInitialMapRegion()}}
                    bounds={calculatInitialMapRegion()}
                    zoomLevel={9}></MapboxGL.Camera>
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
          {/* {newPosts.map((item) => {
            return(
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
                    <Span color={'black'} bold >늦었다 진짜 와</Span><Span ml5 color={'gray'}>...더보기</Span>
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
            )
          })} */}
          {prevPosts.map((item) => {
            const sungan = item.sungan;
            return(
              <Row rounded20 overflowHidden my10 bgWhite flex py5>
                <Col>
                  <Row itemsCenter px20 py10>
                    <Col auto rounded30 overflowHidden  mr10><Img source={IMAGES.example2} w30 h30 ></Img></Col>
                    <Col auto>
                      <Span medium fontSize={14}>irlglo</Span>
                    </Col>
                    <Col>
                    </Col>
                    <Col auto rounded20 bg={sungan.vehicle.colorCode} px10 py5>
                    <Span medium fontSize={14} white>{sungan.vehicle.name}</Span>
                    </Col>
                  </Row>
                  <Row itemsCenter>
                    <Col></Col>
                    <Col auto><Span fontSize={100}>{sungan.emoji}</Span></Col>
                    <Col></Col>
                  </Row>
                  <Row itemsCenter px20 pt10 pb5 bgWhite>
                    <Col></Col>
                    <Col auto>
                      <Row>
                        <Col auto px5><Send {...iconSettings}></Send></Col>
                        <Col auto px5><MessageCircle {...iconSettings}></MessageCircle></Col>
                        <Col auto px5><Heart {...iconSettings} fill={sungan.isLiked && 'red'}></Heart></Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row itemsCenter px20 pb10 pt5 bgWhite>
                    <Span color={'black'} bold>{sungan.text}</Span>
                  </Row>
                  {sungan.comments.length > 1 && <Row itemsCenter px20 py5 bgWhite>
                    <Span color={'gray'}>{`${sungan.comments.length - 1}개 댓글 더보기`}</Span>
                  </Row>}
                    {sungan.comments.slice(0, 1).map((comment) => {
                      return(
                      <Row itemsCenter justifyCenter px20 pb10 pt5 bgWhite flex>
                        <Col auto itemsCenter justifyCenter rounded20 overflowHidden><Img source={IMAGES.example2} w15 h15 ></Img></Col>
                        <Col mx10 justifyCenter><Row><Span medium color={'black'}>irlyglo</Span><Span ml5 >{comment.content}</Span></Row></Col>
                        <Col auto itemsCenter justifyCenter><Heart color={"black"} height={14}></Heart></Col>
                      </Row>
                      )
                    })}
                </Col>
              </Row>
            )
          })}
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
                  <Span color={'black'}>늦었다 진짜 와</Span><Span ml5 color={'gray'}>...더보기</Span>
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
          </Div>
          </LinearGradient>
        </Animated.ScrollView>
      </Div>
    </LinearGradient>
    </Div>
  
  )
        
}
        
export default HomeScreen;
