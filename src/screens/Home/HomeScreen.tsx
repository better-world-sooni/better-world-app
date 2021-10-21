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
  RefreshCw,
  Hash,
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
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSubway} from '@fortawesome/free-solid-svg-icons';

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
    height: 20,
  };

  const shadowProp = opacity => {
    return {
      shadowOffset: {height: 1, width: 1},
      shadowColor: 'rgb(199,199,204)',
      shadowOpacity: opacity,
      shadowRadius: 10,
    };
  };

  const textShadowProp = {
    textShadowColor: 'rgb(199,199,204)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
  };

  return (
    <Div flex>
      <Div h={HAS_NOTCH ? 44 : 20} bg={'rgba(255,255,255,.9)'} />
      <Div flex relative>
        <Row itemsCenter py5 px20 bg={'rgba(255,255,255,.9)'}>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          refreshControl={
            <RefreshControl
              refreshing={starredLoading}
              onRefresh={pullToRefresh}
            />
          }>
          <Div bg={'rgba(255,255,255,.9)'}>
            <Row px10>
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
                  <RefreshCw color={'black'} height={14}></RefreshCw>
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
            <Row px10 py5>
              <Col
                auto
                rounded5
                px10
                bg={'rgba(255,255,255,.9)'}
                mr10
                justifyCenter
                style={{borderWidth: 0.5, borderColor: 'rgb(199,199,204)'}}>
                <Hash {...iconSettings}></Hash>
              </Col>
              <Col>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Div
                    auto
                    bg={'rgb(250, 196, 192)'}
                    px10
                    py5
                    rounded5
                    mr10
                    justifyCenter>
                    <Span medium color={'rgb(255,69,58)'}>
                      민원
                    </Span>
                  </Div>
                  {['핫플/맛집', '음악', '시사', '스포츠', '게임'].map(
                    (item, index) => {
                      return (
                        <Div
                          key={index}
                          auto
                          bg={'#f5f5f5'}
                          px10
                          py5
                          rounded5
                          mr10
                          justifyCenter>
                          <Span medium black>
                            {item}
                          </Span>
                        </Div>
                      );
                    },
                  )}
                </ScrollView>
              </Col>
              <Col
                bg={'#33a23d'}
                auto
                w50
                itemsCenter
                justifyCenter
                rounded5
                ml10>
                <Span white>전역</Span>
              </Col>
            </Row>
          </Div>
          <Div mt10 bg={'rgba(255,255,255,.9)'} py20>
            <Row px20>
              <Col justifyCenter itemsCenter>
                <Span medium numberOfLines={1} ellipsizeMode="head">
                  성수역
                </Span>
              </Col>
              <Col auto w150 itemsCenter py10>
                <Span medium color={'rgb(255,69,58)'}>
                  다음 열차까지 3:12
                </Span>
              </Col>
              <Col justifyCenter itemsCenter>
                <Span medium numberOfLines={1} ellipsizeMode="tail">
                  동대문역사문화공원역
                </Span>
              </Col>
            </Row>
            <Row pb10>
              <Col justifyCenter>
                <Div h10 bg={'#33a23d'}></Div>
              </Col>
              <Col
                auto
                w200
                borderWidth={3}
                borderColor={'#33a23d'}
                rounded20
                itemsCenter
                py10
                bgWhite>
                <Span fontSize={23} bold>
                  건대입구역
                </Span>
              </Col>
              <Col justifyCenter flex>
                <Row h10 bg={'#33a23d'}></Row>
              </Col>
            </Row>
            <Row pt5>
              {[
                {state: 0},
                {state: 0},
                {state: 1, riding: false},
                {state: 0},
                {state: 0},
              ].map(item => {
                return (
                  <Col justifyCenter itemsCenter>
                    {item.state == 1 && (
                      <Div itemsCenter>
                        <Span
                          medium
                          fontSize={10}
                          color={item.riding ? 'rgb(255,69,58)' : 'black'}
                          style={{...textShadowProp}}>
                          {item.riding ? '탑승중' : '탑승하기'}
                        </Span>
                        <FontAwesomeIcon
                          icon={faSubway}
                          color={'#33a23d'}
                          size={18}></FontAwesomeIcon>
                      </Div>
                    )}
                  </Col>
                );
              })}
            </Row>
            <Row pb5>
              {[0, 1, 2, 3, 4].map(() => {
                return (
                  <Col justifyCenter itemsCenter bg={'#33a23d'} h10>
                    <Div
                      borderColor={'white'}
                      borderWidth={2}
                      rounded5
                      w10
                      h10
                      bg={'white'}></Div>
                  </Col>
                );
              })}
            </Row>
            <Row pt5>
              {[
                {name: 0},
                {name: 0},
                {name: 0},
                {name: 1, current: true},
                {name: 0},
              ].map(item => {
                return (
                  <Col justifyCenter itemsCenter>
                    <Div itemsCenter>
                      <Span
                        medium
                        fontSize={10}
                        style={{...textShadowProp}}
                        color={item.current ? 'rgb(255,69,58)' : 'black'}>
                        {item.name}
                      </Span>
                    </Div>
                  </Col>
                );
              })}
            </Row>
          </Div>
          <Div>
            {prevPosts.map((item, index) => {
              const sungan = item.sungan;
              return (
                <Div mt10 bg={'rgba(255,255,255,.9)'} py5 key={index}>
                  <Row itemsCenter px20 py10>
                    <Col auto rounded30 overflowHidden mr10>
                      <Img source={IMAGES.example2} w25 h25></Img>
                    </Col>
                    <Col auto>
                      <Span medium>irlglo</Span>
                    </Col>
                    <Col></Col>
                    <Col auto px10 py5 rounded5>
                      <Span medium>전체</Span>
                    </Col>
                  </Row>
                  <Div px20 py10>
                    <Row rounded20 bgWhite w={'100%'}>
                      <Col auto justifyCenter itemsCenter px20>
                        <Span fontSize={70}>{sungan.emoji}</Span>
                      </Col>
                      <Col justifyCenter>
                        <Span color={'black'} bold>
                          {sungan.text}
                        </Span>
                      </Col>
                    </Row>
                  </Div>
                  <Row itemsCenter px20 pt10 pb5>
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
                  {sungan.comments.length > 1 && (
                    <Row itemsCenter px20 py5>
                      <Span color={'gray'}>{`${
                        sungan.comments.length - 1
                      }개 댓글 더보기`}</Span>
                    </Row>
                  )}
                  {sungan.comments.slice(0, 1).map((comment, index) => {
                    return (
                      <Row
                        key={index}
                        itemsCenter
                        justifyCenter
                        px20
                        pb10
                        pt5
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
                </Div>
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
