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
import {
  PlusSquare,
  Bell,
  MessageCircle,
  AlertCircle,
  Heart,
  Send,
  Search,
  ArrowRight,
  ChevronLeft,
  Filter,
} from 'react-native-feather';
import RouteShelf from 'src/components/RouteShelf';
import MapboxGL from '@react-native-mapbox-gl/maps';
import type {CameraSettings} from '@react-native-mapbox-gl/maps';
import {HAS_NOTCH} from 'src/modules/constants';
import LinearGradient from 'react-native-linear-gradient';
import {
  setCurrentRoute,
  setUserSearchDestination,
  setUserSearchOrigin,
} from 'src/redux/routeReducer';
import {shortenAddress} from 'src/modules/utils';
import {RootState} from 'src/redux/rootReducer';
import {setNewPosts, setPrevPosts} from 'src/redux/feedReducer';

const HomeScreen = props => {
  MapboxGL.setAccessToken(
    'pk.eyJ1Ijoibm9tYWNndWZmaW5zIiwiYSI6ImNrdGp2cHozYzBxZHAzMW1zcWZ3c2p2aXAifQ.NsgkwiPWRhtBN5RX4wwa5w',
  );

  const {data: starredResponse, isLoading: starredLoading} = useApiSelector(
    APIS.route.starred,
  );
  const defaultRoute = starredResponse?.data?.[0];

  const {data: mainBeforeResponse, isLoading: postsBeforeLoading} =
    useApiSelector(APIS.post.main.before);
  const {data: mainAfterResponse, isLoading: postsAfterLoading} =
    useApiSelector(APIS.post.main.after);

  const {
    userSearch: {origin, destination},
    currentRoute,
    currentVehicles,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {prevPosts, newPosts} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );

  const navigation = useNavigation();
  const apiGET = useReloadGET();
  const apiPOST = useReloadPOST();
  const dispatch = useDispatch();
  const setOrigin = origin => dispatch(setUserSearchOrigin(origin));
  const setDestination = destination =>
    dispatch(setUserSearchDestination(destination));
  const goToMap = () => navigation.navigate(NAV_NAMES.Map);
  const goToPost = () => navigation.navigate(NAV_NAMES.Post);
  const goToReport = () => navigation.navigate(NAV_NAMES.Report);

  const pullToRefresh = () => {
    apiPOST(APIS.post.main.before(1), {
      vehicleName: '2호선',
      orderBy: 0,
      size: 100,
    });
    apiPOST(
      APIS.post.main.after(newPosts.length > 0 ? newPosts[0].sungan.id : 1),
      {
        vehicleName: '2호선',
        orderBy: 0,
        size: 10,
      },
    );
  };

  useEffect(() => {
    apiGET(APIS.route.starred());
    pullToRefresh();
  }, []);

  useEffect(() => {
    if (mainBeforeResponse) {
      console.log('mainBeforeResponse', mainBeforeResponse);
      dispatch(setPrevPosts(mainBeforeResponse.data));
    }
  }, [postsBeforeLoading]);

  useEffect(() => {
    if (mainAfterResponse) {
      console.log('mainAfterResponse', mainAfterResponse);
      dispatch(setNewPosts(mainAfterResponse.data));
    }
  }, [postsAfterLoading]);

  useEffect(() => {
    if (defaultRoute) {
      dispatch(setCurrentRoute(defaultRoute.route));
      setOrigin(shortenAddress(defaultRoute.route.legs[0].start_address));
      setDestination(shortenAddress(defaultRoute.route.legs[0].end_address));
    }
  }, [starredLoading]);

  const calculatInitialMapRegion = () => {
    const bounds = currentRoute?.bounds;
    if (bounds) {
      return {
        ne: [bounds.northeast.lng, bounds.northeast.lat],
        sw: [bounds.southwest.lng, bounds.southwest.lat],
      };
    } else {
      return {
        ne: [37.715133, 127.269311],
        sw: [37.413294, 126.734086],
      };
    }
  };

  const iconSettings = {
    strokeWidth: 1.5,
    color: 'black',
    height: 30,
  };

  const shadowProp = {
    shadowOffset: {height: 1, width: 1},
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowRadius: 3,
  };

  const borderBottomProp = {
    borderBottomColor: 'rbg(229, 229, 234, 0.3)',
    borderBottomWidth: 0.5,
  };

  return (
    <Div flex>
      <Div flex relative>
        <Div h={HAS_NOTCH ? 44 : 20} bgWhite />
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          // onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: animatedScrollYValue } } }], {useNativeDriver: true})}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={starredLoading}
              onRefresh={pullToRefresh}
            />
          }>
          <Div>
            <Row itemsCenter py5 px20 bgWhite>
              <Col auto rounded30 overflowHidden mr10>
                <Img source={IMAGES.example2} w30 h30></Img>
              </Col>
              <Col></Col>
              <Col auto onPress={goToReport} px10>
                <AlertCircle {...iconSettings} color={'red'}></AlertCircle>
              </Col>
              <Col auto onPress={goToPost} px10>
                <PlusSquare {...iconSettings} color={'black'}></PlusSquare>
              </Col>
            </Row>
            <Row px10 bgWhite>
              <Col
                bg={'#f5f5f5'}
                rounded5
                py5
                px10
                my5
                mr5
                justifyCenter
                itemsCenter>
                <Span
                  bold
                  color={'black'}
                  numberOfLines={1}
                  ellipsizeMode="head">
                  {shortenAddress(origin)}
                </Span>
              </Col>
              <Col mx5 auto itemsCenter justifyCenter>
                <Span>
                  <ArrowRight color={'black'} height={14}></ArrowRight>
                </Span>
              </Col>
              <Col
                bg={'#f5f5f5'}
                rounded5
                py5
                px10
                my5
                ml5
                justifyCenter
                itemsCenter>
                <Span
                  bold
                  color={'black'}
                  numberOfLines={1}
                  ellipsizeMode="head">
                  {shortenAddress(destination)}
                </Span>
              </Col>
            </Row>
            <Row px10 bgWhite py5>
              <Col auto rounded5 px10 bg={'#f5f5f5'}>
                <Filter {...iconSettings}></Filter>
              </Col>
              <Col>
                <ScrollView horizontal>
                  {currentVehicles.map(vehicle => {
                    return (
                      <Div auto bg={vehicle.color} px10 py5 rounded5 ml10>
                        <Span medium fontSize={14} white>
                          {vehicle.shortName}
                        </Span>
                      </Div>
                    );
                  })}
                  <Div auto bg={'rgb(255,59,48)'} px10 py5 rounded5 ml10>
                    <Span medium fontSize={14} white>
                      신고
                    </Span>
                  </Div>
                  <Div auto bg={'rgb(44,44,46)'} px10 py5 rounded5 ml10>
                    <Span medium fontSize={14} white>
                      공지사항
                    </Span>
                  </Div>
                </ScrollView>
              </Col>
            </Row>
          </Div>
          <Div>
            <Row h250 overflowHidden onPress={goToMap} mt10>
              <Col px20 py10 w={'50%'} bgWhite>
                <Div p20 rounded5>
                  <Row>
                    <Span fontSize={14}>예상 소요 시간</Span>
                  </Row>
                  <Row>
                    <Span bold fontSize={30}>
                      31분
                    </Span>
                  </Row>
                </Div>
              </Col>
              <Col w={'50%'}>
                <MapboxGL.MapView
                  style={{flex: 1}}
                  styleURL={
                    'mapbox://styles/nomacguffins/cktjvxy3m0sd017qwn660ct0g'
                  }
                  logoEnabled={false}
                  compassEnabled={false}
                  zoomEnabled={false}
                  scrollEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}>
                  <MapboxGL.UserLocation></MapboxGL.UserLocation>
                  <MapboxGL.Camera
                    maxBounds={{
                      ne: [37.715133, 127.269311],
                      sw: [37.413294, 126.734086],
                    }}
                    defaultSettings={{bounds: calculatInitialMapRegion()}}
                    bounds={calculatInitialMapRegion()}
                    zoomLevel={9}></MapboxGL.Camera>
                  {currentRoute && <MapViewDirections route={currentRoute} />}
                </MapboxGL.MapView>
              </Col>
            </Row>
            {/* <Row my5>
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
            </Row> */}
            {prevPosts.map(item => {
              const sungan = item.sungan;
              return (
                <Row overflowHidden mt10 bgWhite flex py5>
                  <Col>
                    <Row itemsCenter px20 py10>
                      <Col auto rounded30 overflowHidden mr10>
                        <Img source={IMAGES.example2} w30 h30></Img>
                      </Col>
                      <Col auto>
                        <Span medium fontSize={14}>
                          irlglo
                        </Span>
                      </Col>
                      <Col></Col>
                      <Col auto bg={sungan.vehicle.colorCode} px10 py5 rounded5>
                        <Span medium fontSize={14} white>
                          {sungan.vehicle.name}
                        </Span>
                      </Col>
                    </Row>
                    <Row itemsCenter>
                      <Col></Col>
                      <Col auto>
                        <Span fontSize={100}>{sungan.emoji}</Span>
                      </Col>
                      <Col></Col>
                    </Row>
                    <Row itemsCenter px20 pt10 pb5 bgWhite>
                      <Col></Col>
                      <Col auto>
                        <Row>
                          <Col auto px5>
                            <MessageCircle {...iconSettings}></MessageCircle>
                          </Col>
                          <Col auto px5>
                            <Heart
                              {...iconSettings}
                              fill={sungan.isLiked && 'red'}></Heart>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row itemsCenter px20 pb10 pt5 bgWhite>
                      <Span color={'black'} bold>
                        {sungan.text}
                      </Span>
                    </Row>
                    {sungan.comments.length > 1 && (
                      <Row itemsCenter px20 py5 bgWhite>
                        <Span color={'gray'}>{`${
                          sungan.comments.length - 1
                        }개 댓글 더보기`}</Span>
                      </Row>
                    )}
                    {sungan.comments.slice(0, 1).map(comment => {
                      return (
                        <Row
                          itemsCenter
                          justifyCenter
                          px20
                          pb10
                          pt5
                          bgWhite
                          flex>
                          <Col
                            auto
                            itemsCenter
                            justifyCenter
                            rounded20
                            overflowHidden>
                            <Img source={IMAGES.example2} w15 h15></Img>
                          </Col>
                          <Col mx10 justifyCenter>
                            <Row>
                              <Span medium color={'black'}>
                                irlyglo
                              </Span>
                              <Span ml5>{comment.content}</Span>
                            </Row>
                          </Col>
                          <Col auto itemsCenter justifyCenter>
                            <Heart color={'black'} height={14}></Heart>
                          </Col>
                        </Row>
                      );
                    })}
                  </Col>
                </Row>
              );
            })}
            <Row
              rounded20
              overflowHidden
              my10
              backgroundColor={'rgb(255, 224, 222)'}
              flex
              py5>
              <Col>
                <Row itemsCenter px20 py10>
                  <Col auto rounded30 overflowHidden mr10>
                    <Img source={IMAGES.example2} w30 h30></Img>
                  </Col>
                  <Col auto>
                    <Span medium fontSize={14}>
                      irlglo
                    </Span>
                  </Col>
                  <Col></Col>
                  <Col auto rounded20 bg={'#0d3692'} px10 py5>
                    <Span medium fontSize={14} white>
                      1호선
                    </Span>
                  </Col>
                </Row>
                <Row itemsCenter>
                  <Col></Col>
                  <Col auto>
                    <Span fontSize={100}>{'🚨'}</Span>
                  </Col>
                  <Col></Col>
                </Row>
                <Row itemsCenter px20 pt10 pb5>
                  <Col justifyEnd auto>
                    <Span medium color={'black'} fontSize={14} bold>
                      에바야...
                    </Span>
                  </Col>
                  <Col></Col>
                  <Col auto>
                    <Row>
                      <Col auto px5>
                        <Send {...iconSettings}></Send>
                      </Col>
                      <Col auto px5>
                        <MessageCircle {...iconSettings}></MessageCircle>
                      </Col>
                      <Col auto px5>
                        <Heart {...iconSettings}></Heart>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row itemsCenter px20 pb10 pt5>
                  <Span color={'black'}>늦었다 진짜 와</Span>
                  <Span ml5 color={'gray'}>
                    ...더보기
                  </Span>
                </Row>
                <Row itemsCenter px20 py5>
                  <Span color={'gray'}>50개 댓글 더보기</Span>
                </Row>
                <Row itemsCenter justifyCenter px20 pb10 pt5 flex>
                  <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
                    <Img source={IMAGES.example2} w15 h15></Img>
                  </Col>
                  <Col mx10 justifyCenter>
                    <Row>
                      <Span medium color={'black'} fontSize={14}>
                        irlyglo
                      </Span>
                      <Span ml5 fontSize={14}>
                        그래서 어떻게 했어?
                      </Span>
                    </Row>
                  </Col>
                  <Col auto itemsCenter justifyCenter>
                    <Heart color={'black'} height={14}></Heart>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Div>
        </ScrollView>
      </Div>
    </Div>
  );
};
        
export default HomeScreen;
