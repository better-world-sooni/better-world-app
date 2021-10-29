import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Dimensions, RefreshControl} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {IMAGES} from 'src/modules/images';
import {ScrollView} from 'src/modules/viewComponents';
import {
  deletePromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
  useReloadPOST,
} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {
  MessageCircle,
  Heart,
  RefreshCw,
  ChevronDown,
} from 'react-native-feather';
import {
  chevronDownSettings,
  Direction,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
  LINE2_Linked_List,
  MAIN_LINE2,
  MY_ROUTE,
  PLACE,
  REPORT,
  Selecting,
  SUNGAN,
} from 'src/modules/constants';
import {
  setRoute,
  setDestination,
  setOrigin,
  setDirection,
  setTrainPositions,
  setArrivalTrain,
  setSelectedTrain,
  exchangeOriginDestination,
} from 'src/redux/routeReducer';
import {shortenAddress, stationArr} from 'src/modules/utils';
import {RootState} from 'src/redux/rootReducer';
import {setCurrentPost, setGlobalFilter, setPosts} from 'src/redux/feedReducer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSubway} from '@fortawesome/free-solid-svg-icons';
import {Header} from 'src/components/Header';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {useNavigation} from '@react-navigation/core';
import {NAV_NAMES} from 'src/modules/navNames';

enum ChannelFilter {
  ALL = 0,
  EVENTS = 1,
  MUSIC = 3,
  TALK = 4,
  REPORT = 5,
  PLACE = 6,
}

const HomeScreen = props => {
  const {data: mainResponse, isLoading: mainLoading} = useApiSelector(
    APIS.post.main,
  );
  const mainFeed = mainResponse?.data;
  const {data: starredResponse, isLoading: starredLoading} = useApiSelector(
    APIS.route.starred,
  );
  const defaultRoute = starredResponse?.data?.[0];
  const {data: positionResponse, isLoading: positionsLoading} = useApiSelector(
    APIS.realtime.position,
  );
  const realtimePositionList = positionResponse?.data;
  const {data: arrivalResponse, isLoading: arrivalLoading} = useApiSelector(
    APIS.realtime.arrival,
  );
  const realtimeArrivalList = arrivalResponse?.data;

  const {
    route: {origin, destination, direction, stations},
    selectedTrain,
    trainPositions,
    arrivalTrain,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const displayedStation = selectedTrain?.statnNm || origin;
  const {posts, globalFiter} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [channelFilter, setChannelFilter] = useState(ChannelFilter.ALL);

  const filterPostsByStation = post => {
    if (post.type === REPORT) {
      return filterPostsByChannel(post);
    } else if (!post.post.station?.name) {
      return filterPostsByChannel(post);
    } else if (
      globalFiter === MY_ROUTE &&
      !MY_ROUTE.includes(post.post.station.name)
    ) {
      return false;
    } else if (
      globalFiter !== MAIN_LINE2 &&
      globalFiter !== post.post.station.name
    ) {
      return false;
    } else {
      return filterPostsByChannel(post);
    }
  };

  const filterPostsByChannel = post => {
    if (channelFilter === ChannelFilter.ALL) {
      return true;
    } else if (channelFilter === ChannelFilter.REPORT && post.type === REPORT) {
      return true;
    } else if (
      channelFilter === ChannelFilter.MUSIC &&
      post.type === SUNGAN &&
      post.post.channelId !== ChannelFilter.MUSIC
    ) {
      return true;
    } else if (
      channelFilter === ChannelFilter.EVENTS &&
      post.type === SUNGAN &&
      post.post.channelId !== ChannelFilter.EVENTS
    ) {
      return true;
    } else if (
      channelFilter === ChannelFilter.TALK &&
      post.type === SUNGAN &&
      post.post.channelId !== ChannelFilter.TALK
    ) {
      return true;
    } else if (channelFilter === ChannelFilter.PLACE && post.type === PLACE) {
      return true;
    } else {
      return false;
    }
  };

  const apiGET = useReloadGET();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const filterPositionResponse = response => {
    const trainLocations = {};
    if (response && response.errorMessage?.status === 200) {
      response.realtimePositionList.forEach(train => {
        if (
          train.subwayNm === '2호선' &&
          train.updnLine === (direction === Direction.INNER ? '1' : '0')
        ) {
          if (train.trainNo === selectedTrain?.trainNo) {
            dispatch(setSelectedTrain(train));
          }
          trainLocations[train.statnNm] = train;
        }
      });
    }
    console.log('trainLocations', trainLocations);
    return trainLocations;
  };

  const filterArrivalResponse = response => {
    let arrival = null;
    if (response && response.errorMessage?.status == 200) {
      response.realtimeArrivalList.forEach(train => {
        if (
          train.subwayId === '1002' &&
          train.updnLine === (direction === Direction.INNER ? '내선' : '외선')
        ) {
          if (!arrival) {
            arrival = train;
          } else if (
            arrival &&
            parseInt(arrival.ordkey.substring(0, 5)) >
              parseInt(train.ordkey.substring(0, 5))
          ) {
            arrival = train;
          }
        }
      });
    }
    return arrival;
  };

  const pullToRefresh = () => {
    apiGET(APIS.post.main());
    apiGET(APIS.realtime.position());
    displayedStation &&
      apiGET(APIS.realtime.arrival(displayedStation.split('(')[0]));
  };

  const calculateETADiff = () => {
    const eta = arrivalTrain?.arvlMsg2?.split(' ');
    if (eta && eta[eta.length - 1] === '후') {
      try {
        const hasMinutes = eta.length === 3;
        const minutes = hasMinutes
          ? parseInt(eta[0].substring(0, eta[0].length - 1))
          : 0;
        const seconds = hasMinutes
          ? parseInt(eta[1].substring(0, eta[1].length - 1))
          : parseInt(eta[0].substring(0, eta[0].length - 1));
        const receptionDate = new Date(
          arrivalTrain.recptnDt
            .substring(0, arrivalTrain.recptnDt.length - 2)
            .replaceAll('-', '/'),
        );
        const ETA = new Date(
          receptionDate.getTime() + minutes * 60000 + seconds * 1000,
        );
        const diff = ETA.getTime() - currentTime.getTime();
        const diffMinutes = Math.floor(diff / 60000);
        const diffSeconds = Math.floor((diff % 60000) / 1000);
        if (diff < 30000) {
          return '곧 도착';
        }
        return `${diffMinutes}분 ${diffSeconds}초 후`;
      } catch (e) {
        return arrivalTrain?.arvlMsg2;
      }
    } else {
      return arrivalTrain?.arvlMsg2;
    }
  };

  useEffect(() => {
    apiGET(APIS.route.starred());
    pullToRefresh();
    const everySecond = setInterval(() => setCurrentTime(new Date()), 1000);
    const everyHalfMinute = setInterval(() => {
      if (!positionsLoading && !arrivalLoading) {
        apiGET(APIS.realtime.position());
        displayedStation &&
          apiGET(APIS.realtime.arrival(displayedStation.split('(')[0]));
      }
    }, 30000);
    return () => {
      clearInterval(everySecond);
      clearInterval(everyHalfMinute);
    };
  }, []);

  useEffect(() => {
    dispatch(setPosts(mainFeed));
  }, [mainLoading]);

  useEffect(() => {
    if (defaultRoute) {
      dispatch(setRoute(defaultRoute.route));
    }
  }, [starredLoading]);

  useEffect(() => {
    dispatch(setTrainPositions(filterPositionResponse(realtimePositionList)));
  }, [positionsLoading]);

  useEffect(() => {
    dispatch(setArrivalTrain(filterArrivalResponse(realtimeArrivalList)));
  }, [arrivalLoading]);

  const textShadowProp = {
    textShadowColor: GRAY_COLOR,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 10,
  };
  const previewStart = stationArr(
    [],
    origin,
    origin,
    direction === Direction.INNER ? Direction.OUTER : Direction.INNER,
    4,
  )[3];
  const [selecting, setSelecting] = useState(Selecting.NONE);
  const selectGetterSetter = {
    [Selecting.ORIGIN]: {
      get: origin,
      set: ori => dispatch(setOrigin(ori)),
      options: stationArr([], '시청', '충정로(경기대입구)', Direction.CW),
    },
    [Selecting.DESTINATION]: {
      get: destination,
      set: dest => dispatch(setDestination(dest)),
      options: stationArr([], '시청', '충정로(경기대입구)', Direction.CW),
    },
    [Selecting.DIRECTION]: {
      get: direction,
      set: dir => dispatch(setDirection(dir)),
      options: [Direction.INNER, Direction.OUTER],
    },
    [Selecting.GLOBAL_FILTER]: {
      get: globalFiter,
      set: filt => dispatch(setGlobalFilter(filt)),
      options: [MAIN_LINE2, MY_ROUTE, ...stations],
    },
  };
  const blackBorderBottomProp = bool => {
    if (bool) {
      return {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      };
    } else {
      return {};
    }
  };
  const redBorderBottomProp = bool => {
    if (bool) {
      return {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
      };
    } else {
      return {};
    }
  };
  const exchangeOD = () => {
    if (origin && destination) {
      dispatch(exchangeOriginDestination());
    } else {
      Alert.alert('출발지와 도착지를 먼저 설정해주세요.');
    }
  };

  return (
    <Div flex bgWhite>
      <Div h={HAS_NOTCH ? 44 : 20} bg={'rgba(255,255,255,.9)'} />
      <Div flex relative>
        <Header
          bg={'rgba(255,255,255,.9)'}
          onSelect={() => setSelecting(Selecting.GLOBAL_FILTER)}
        />
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
                bg={'rgb(242, 242, 247)'}
                rounded5
                py7
                my5
                mr5
                pl5
                justifyCenter
                onPress={() => setSelecting(Selecting.ORIGIN)}>
                <Row>
                  <Col itemsCenter>
                    <Span
                      bold
                      textCenter
                      color={'black'}
                      numberOfLines={1}
                      ellipsizeMode="head">
                      {origin}
                    </Span>
                  </Col>
                  <Col auto justifyCenter>
                    <ChevronDown {...chevronDownSettings}></ChevronDown>
                  </Col>
                </Row>
              </Col>
              <Col mx5 auto itemsCenter justifyCenter onPress={exchangeOD}>
                <Span>
                  <RefreshCw color={'black'} height={14}></RefreshCw>
                </Span>
              </Col>
              <Col
                bg={'rgb(242, 242, 247)'}
                rounded5
                py7
                my5
                pl5
                justifyCenter
                onPress={() => setSelecting(Selecting.DESTINATION)}>
                <Row>
                  <Col itemsCenter>
                    <Span
                      bold
                      textCenter
                      color={'black'}
                      numberOfLines={1}
                      ellipsizeMode="head">
                      {destination}
                    </Span>
                  </Col>
                  <Col auto justifyCenter>
                    <ChevronDown {...chevronDownSettings}></ChevronDown>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row pt10 borderBottomColor={GRAY_COLOR} borderBottomWidth={0.5}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Div
                  auto
                  justifyCenter
                  {...blackBorderBottomProp(
                    channelFilter === ChannelFilter.ALL,
                  )}>
                  <Div
                    w={'100%'}
                    py5
                    px20
                    onPress={() => setChannelFilter(ChannelFilter.ALL)}>
                    <Span
                      medium
                      color={
                        channelFilter === ChannelFilter.ALL
                          ? 'black'
                          : GRAY_COLOR
                      }
                      fontSize={15}>
                      전체
                    </Span>
                  </Div>
                </Div>
                <Div
                  auto
                  borderBottomColor={'rgb(255,69,58)'}
                  justifyCenter
                  {...redBorderBottomProp(
                    channelFilter === ChannelFilter.REPORT,
                  )}>
                  <Div
                    w={'100%'}
                    py5
                    px20
                    onPress={() => setChannelFilter(ChannelFilter.REPORT)}>
                    <Span
                      medium
                      color={
                        channelFilter === ChannelFilter.REPORT
                          ? 'red'
                          : 'rgb(250, 196, 192)'
                      }
                      fontSize={15}>
                      민원
                    </Span>
                  </Div>
                </Div>
                {[
                  {name: '핫플/맛집', value: ChannelFilter.PLACE},
                  {name: '잡담', value: ChannelFilter.TALK},
                  {name: '연예/시사', value: ChannelFilter.EVENTS},
                  {name: '음악', value: ChannelFilter.MUSIC},
                ].map((item, index) => {
                  return (
                    <Div
                      key={index}
                      auto
                      justifyCenter
                      {...blackBorderBottomProp(channelFilter === item.value)}>
                      <Div
                        w={'100%'}
                        py5
                        px20
                        onPress={() => setChannelFilter(item.value)}>
                        <Span
                          medium
                          color={
                            channelFilter === item.value ? 'black' : GRAY_COLOR
                          }
                          fontSize={15}>
                          {item.name}
                        </Span>
                      </Div>
                    </Div>
                  );
                })}
              </ScrollView>
            </Row>
          </Div>
          <Div bg={'rgba(255,255,255,.9)'} py20>
            <Row px20>
              <Col justifyCenter itemsCenter>
                <Span medium numberOfLines={1} ellipsizeMode="head">
                  {displayedStation
                    ? direction === Direction.INNER
                      ? LINE2_Linked_List[displayedStation].prev
                      : LINE2_Linked_List[displayedStation].next
                    : '길 미설정'}
                </Span>
              </Col>
              <Col auto w150 itemsCenter pb10>
                <Row
                  rounded5
                  auto
                  mx20
                  py5
                  my5
                  onPress={() => setSelecting(Selecting.DIRECTION)}>
                  <Col auto>
                    <Span
                      bold
                      textCenter
                      color={'black'}
                      numberOfLines={1}
                      ellipsizeMode="head">
                      {direction}
                    </Span>
                  </Col>
                  <Col auto justifyCenter>
                    <ChevronDown {...chevronDownSettings}></ChevronDown>
                  </Col>
                </Row>
                <Row>
                  <Span medium color={'rgb(255,69,58)'}>
                    {selectedTrain
                      ? '탑승중'
                      : calculateETADiff() || '정보 없음'}
                  </Span>
                </Row>
              </Col>
              <Col justifyCenter itemsCenter>
                <Span medium numberOfLines={1} ellipsizeMode="tail">
                  {displayedStation
                    ? direction === Direction.INNER
                      ? LINE2_Linked_List[displayedStation].next
                      : LINE2_Linked_List[displayedStation].prev
                    : '길 미설정'}
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
                {(displayedStation ? displayedStation : '출발지를 설정해주세요')
                  .split('(')
                  .join(' (')
                  .split(' ')
                  .map(word => {
                    return (
                      <Span fontSize={23} bold textCenter key={word}>
                        {word}
                      </Span>
                    );
                  })}
              </Col>
              <Col justifyCenter flex>
                <Row h10 bg={'#33a23d'}></Row>
              </Col>
            </Row>
            <Row pt5>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(origin && destination
                  ? stationArr([], previewStart, previewStart, direction)
                  : stationArr(
                      [],
                      '시청',
                      '충정로(경기대입구)',
                      Direction.INNER,
                    )
                ).map((item, index) => {
                  const trainAtStation = trainPositions?.[item.split('(')[0]];
                  return (
                    <Col key={index}>
                      <Div
                        mb10
                        justifyCenter
                        itemsCenter
                        h30
                        onPress={() =>
                          trainAtStation &&
                          dispatch(setSelectedTrain(trainAtStation))
                        }
                        w={Dimensions.get('window').width / 5}>
                        {trainAtStation && (
                          <>
                            <Span
                              medium
                              fontSize={10}
                              color={
                                trainAtStation?.trainNo ===
                                selectedTrain?.trainNo
                                  ? 'rgb(255,69,58)'
                                  : 'black'
                              }
                              style={{...textShadowProp}}>
                              {trainAtStation?.trainNo ===
                              selectedTrain?.trainNo
                                ? '탑승중'
                                : '탑승하기'}
                            </Span>
                            <FontAwesomeIcon
                              icon={faSubway}
                              color={'#33a23d'}
                              size={18}></FontAwesomeIcon>
                          </>
                        )}
                      </Div>
                      <Div
                        mb10
                        justifyCenter
                        itemsCenter
                        bg={'#33a23d'}
                        h10
                        w={Dimensions.get('window').width / 5}>
                        <Div
                          borderColor={'white'}
                          borderWidth={2}
                          rounded5
                          w10
                          h10
                          bg={'white'}></Div>
                      </Div>
                      <Div
                        justifyCenter
                        itemsCenter
                        w={Dimensions.get('window').width / 5}>
                        <Div itemsCenter>
                          <Span
                            medium
                            fontSize={10}
                            color={
                              item === origin ? 'rgb(255,69,58)' : 'black'
                            }>
                            {item}
                          </Span>
                        </Div>
                      </Div>
                    </Col>
                  );
                })}
              </ScrollView>
            </Row>
          </Div>
          <Div>
            {posts &&
              posts
                .filter(post => {
                  return filterPostsByStation(post);
                })
                .map((post, index) => {
                  if (post.type == SUNGAN) {
                    return (
                      <Sungan
                        post={post}
                        dispatch={dispatch}
                        navigation={navigation}
                        token={token}
                        key={index}
                      />
                    );
                  } else if (post.type == REPORT) {
                    return (
                      <Report
                        post={post}
                        dispatch={dispatch}
                        navigation={navigation}
                        token={token}
                        key={index}
                      />
                    );
                  } else {
                    return (
                      <Place
                        post={post}
                        dispatch={dispatch}
                        navigation={navigation}
                        token={token}
                        key={index}
                      />
                    );
                  }
                })}
          </Div>
        </ScrollView>
      </Div>
      {selecting && (
        <ScrollSelector
          selectedValue={selectGetterSetter[selecting].get}
          onValueChange={selectGetterSetter[selecting].set}
          options={selectGetterSetter[selecting].options}
          onClose={() => setSelecting(Selecting.NONE)}
        />
      )}
    </Div>
  );
};

const Sungan = ({post, dispatch, navigation, token}) => {
  const sungan = post.post;
  const bestComment = post.bestComment;
  const shadowProp = opacity => {
    return {
      shadowOffset: {height: 1, width: 1},
      shadowColor: GRAY_COLOR,
      shadowOpacity: opacity,
      shadowRadius: 10,
    };
  };
  const [isLiked, setIsLiked] = useState(post.didLike);
  const like = async () => {
    if (isLiked) {
      const res = await deletePromiseFn({
        url: APIS.post.sungan.like(sungan.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(false);
    } else {
      const res = await postPromiseFn({
        url: APIS.post.sungan.like(sungan.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(true);
    }
  };
  const goToPostDetail = () => {
    dispatch(setCurrentPost(post));
    navigation.navigate(NAV_NAMES.PostDetail);
  };

  return (
    <Div bg={'rgba(255,255,255,.9)'} pb10 px20>
      <Row itemsCenter py20 borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
        <Col auto rounded30 overflowHidden mr10>
          <Img source={IMAGES.example2} w25 h25></Img>
        </Col>
        <Col auto>
          <Span medium>{sungan.userInfo.userName}</Span>
        </Col>
        <Col></Col>
        <Col auto px10 py5 rounded5>
          <Span medium>{sungan.station.name}</Span>
        </Col>
      </Row>
      <Div py10 onPress={goToPostDetail}>
        <Row rounded20 bgWhite w={'100%'} {...shadowProp(0.3)}>
          <Col auto justifyCenter itemsCenter px20>
            <Span fontSize={70}>{sungan.emoji}</Span>
          </Col>
          <Col justifyCenter>
            <Span color={'black'} medium>
              {sungan.text}
            </Span>
          </Col>
        </Row>
      </Div>
      <Row itemsCenter pt10 pb5>
        <Col auto>
          <Row>
            <Span medium>{`좋아요 ${
              sungan.likeCnt +
              (!post.didLike && isLiked ? 1 : 0) -
              (post.didLike && !isLiked ? 1 : 0)
            }개`}</Span>
          </Row>
        </Col>
        <Col></Col>
        <Col auto>
          <Row>
            <Col auto px5 onPress={goToPostDetail}>
              <MessageCircle {...iconSettings}></MessageCircle>
            </Col>
            <Col auto px5 onPress={like}>
              <Heart {...iconSettings} fill={isLiked ? 'red' : 'white'}></Heart>
            </Col>
          </Row>
        </Col>
      </Row>
      {sungan.comments.length > 1 && (
        <Row itemsCenter py5>
          <Span color={'gray'}>{`${
            sungan.comments.length - 1
          }개 댓글 더보기`}</Span>
        </Row>
      )}
      {bestComment && (
        <Row itemsCenter justifyCenter pb10 pt5 flex>
          <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
            <Img source={IMAGES.example2} w15 h15></Img>
          </Col>
          <Col mx10 justifyCenter>
            <Row>
              <Span medium color={'black'}>
                irlyglo
              </Span>
              <Span ml5>{bestComment.content}</Span>
            </Row>
          </Col>
          <Col auto itemsCenter justifyCenter>
            <Heart color={'black'} height={14}></Heart>
          </Col>
        </Row>
      )}
    </Div>
  );
};

const Report = ({post, dispatch, navigation, token}) => {
  const report = post.post;
  const bestComment = post.bestComment;
  const shadowProp = opacity => {
    return {
      shadowOffset: {height: 1, width: 1},
      shadowColor: GRAY_COLOR,
      shadowOpacity: opacity,
      shadowRadius: 10,
    };
  };
  const [isLiked, setIsLiked] = useState(post.didLike);
  const like = async () => {
    if (isLiked) {
      const res = await deletePromiseFn({
        url: APIS.post.report.like(report.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(false);
    } else {
      const res = await postPromiseFn({
        url: APIS.post.report.like(report.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(true);
    }
  };
  const goToPostDetail = () => {
    dispatch(setCurrentPost(post));
    navigation.navigate(NAV_NAMES.PostDetail);
  };
  return (
    <Div bg={'rgba(255,255,255,.9)'} pb10 px20>
      <Row itemsCenter py20 borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
        <Col auto rounded30 overflowHidden mr10>
          <Img source={IMAGES.example2} w25 h25></Img>
        </Col>
        <Col auto>
          <Span medium>{report.userInfo.userName}</Span>
        </Col>
        <Col></Col>
        <Col auto px10 py5 rounded5>
          <Span medium>{`차량번호: ${report.vehicleIdNum}`}</Span>
        </Col>
      </Row>
      <Div py10 onPress={goToPostDetail}>
        <Row
          rounded20
          bg={'rgb(250, 196, 192)'}
          w={'100%'}
          {...shadowProp(0.5)}>
          <Col auto justifyCenter itemsCenter px20>
            <Span fontSize={70}>{'🚨'}</Span>
          </Col>
          <Col justifyCenter>
            <Span color={'black'} medium>
              {report.detail}
            </Span>
          </Col>
        </Row>
      </Div>
      <Row itemsCenter pt10 pb5>
        <Col auto>
          <Row>
            <Span medium>{`좋아요 ${
              report.likeCnt +
              (!post.didLike && isLiked ? 1 : 0) -
              (post.didLike && !isLiked ? 1 : 0)
            }개`}</Span>
          </Row>
        </Col>
        <Col></Col>
        <Col auto>
          <Row>
            <Col auto px5 onPress={goToPostDetail}>
              <MessageCircle {...iconSettings}></MessageCircle>
            </Col>
            <Col auto px5 onPress={like}>
              <Heart {...iconSettings} fill={isLiked ? 'red' : 'white'}></Heart>
            </Col>
          </Row>
        </Col>
      </Row>
      {report.comments && report.comments.length > 1 && (
        <Row itemsCenter py5>
          <Span color={'gray'}>{`${
            report.comments.length - 1
          }개 댓글 더보기`}</Span>
        </Row>
      )}
      {bestComment && (
        <Row itemsCenter justifyCenter pb10 pt5 flex>
          <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
            <Img source={IMAGES.example2} w15 h15></Img>
          </Col>
          <Col mx10 justifyCenter>
            <Row>
              <Span medium color={'black'}>
                irlyglo
              </Span>
              <Span ml5>{bestComment.content}</Span>
            </Row>
          </Col>
          <Col auto itemsCenter justifyCenter>
            <Heart color={'black'} height={14}></Heart>
          </Col>
        </Row>
      )}
    </Div>
  );
};
const Place = ({post, dispatch, navigation, token}) => {
  const sungan = post.post;
  const shadowProp = opacity => {
    return {
      shadowOffset: {height: 1, width: 1},
      shadowColor: GRAY_COLOR,
      shadowOpacity: opacity,
      shadowRadius: 10,
    };
  };
  const bestComment = post.bestComment;
  const [isLiked, setIsLiked] = useState(post.didLike);
  const like = async () => {
    if (isLiked) {
      const res = await deletePromiseFn({
        url: APIS.post.place.like(sungan.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(false);
    } else {
      const res = await postPromiseFn({
        url: APIS.post.place.like(sungan.id).url,
        body: {},
        token: token,
      });
      res.status == 200 && setIsLiked(true);
    }
  };
  const goToPostDetail = () => {
    dispatch(setCurrentPost(post));
    navigation.navigate(NAV_NAMES.PostDetail);
  };
  return (
    <Div bg={'rgba(255,255,255,.9)'} pb10 px20>
      <Row itemsCenter py20 borderTopColor={GRAY_COLOR} borderTopWidth={0.3}>
        <Col auto rounded30 overflowHidden mr10>
          <Img source={IMAGES.example2} w25 h25></Img>
        </Col>
        <Col auto>
          <Span medium>{sungan.userInfo.userName}</Span>
        </Col>
        <Col></Col>
        <Col auto px10 py5 rounded5>
          <Span medium>{sungan.station.name}</Span>
        </Col>
      </Row>
      <Div py10 onPress={goToPostDetail}>
        <Row rounded20 bgWhite w={'100%'} {...shadowProp(0.3)}>
          <Col auto justifyCenter itemsCenter px20>
            <Span fontSize={70}>{sungan.emoji}</Span>
          </Col>
          <Col justifyCenter>
            <Span color={'black'} bold mb5>
              {sungan.place}
            </Span>
            <Span color={'black'} medium>
              {sungan.text}
            </Span>
          </Col>
        </Row>
      </Div>
      <Row itemsCenter pt10 pb5>
        <Col auto>
          <Row>
            <Span medium>{`좋아요 ${
              sungan.likeCnt +
              (!post.didLike && isLiked ? 1 : 0) -
              (post.didLike && !isLiked ? 1 : 0)
            }개`}</Span>
          </Row>
        </Col>
        <Col></Col>
        <Col auto>
          <Row>
            <Col auto px5 onPress={goToPostDetail}>
              <MessageCircle {...iconSettings}></MessageCircle>
            </Col>
            <Col auto px5 onPress={like}>
              <Heart {...iconSettings} fill={isLiked ? 'red' : 'white'}></Heart>
            </Col>
          </Row>
        </Col>
      </Row>
      {sungan.comments?.length > 1 && (
        <Row itemsCenter py5>
          <Span color={'gray'}>{`${
            sungan.comments.length - 1
          }개 댓글 더보기`}</Span>
        </Row>
      )}
      {bestComment && (
        <Row itemsCenter justifyCenter pb10 pt5 flex>
          <Col auto itemsCenter justifyCenter rounded20 overflowHidden>
            <Img source={IMAGES.example2} w15 h15></Img>
          </Col>
          <Col mx10 justifyCenter>
            <Row>
              <Span medium color={'black'}>
                irlyglo
              </Span>
              <Span ml5>{bestComment.content}</Span>
            </Row>
          </Col>
          <Col auto itemsCenter justifyCenter>
            <Heart color={'black'} height={14}></Heart>
          </Col>
        </Row>
      )}
    </Div>
  );
};

export default HomeScreen;
