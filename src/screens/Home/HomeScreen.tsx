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
import {useApiSelector, useReloadGET} from 'src/redux/asyncReducer';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RefreshCw, ChevronDown, CheckCircle} from 'react-native-feather';
import {
  chevronDownSettings,
  Direction,
  GRAY_COLOR,
  HAS_NOTCH,
  LINE2_COLOR,
  LINE2_COLOR_LIGHT,
  LINE2_Linked_List,
  MAIN_LINE2,
  MY_ROUTE,
  PLACE,
  REPORT,
  Selecting,
  SUNGAN,
  TRAIN_STATE,
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
import {postKey, stationArr} from 'src/modules/utils';
import {RootState} from 'src/redux/rootReducer';
import {setGlobalFilter, setMainPosts} from 'src/redux/feedReducer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSubway} from '@fortawesome/free-solid-svg-icons';
import {Header} from 'src/components/Header';
import {ScrollSelector} from 'src/components/ScrollSelector';
import {useNavigation} from '@react-navigation/core';
import {Report} from 'src/components/Report';
import {Place} from 'src/components/Place';
import {Sungan} from 'src/components/Sungan';

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
  const {mainPosts, globalFiter} = useSelector(
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
          train.subwayNm == '2호선' &&
          train.trainNo.startsWith('2') &&
          train.updnLine == (direction == Direction.INNER ? '0' : '1')
        ) {
          if (train.trainNo == selectedTrain?.trainNo) {
            dispatch(setSelectedTrain(train));
          }
          trainLocations[train.statnNm] = train;
        }
      });
    }
    return trainLocations;
  };

  const filterArrivalResponse = response => {
    let arrival = null;
    let arvlCd = null;
    if (response && response.errorMessage?.status == 200) {
      for (const train of response.realtimeArrivalList) {
        if (
          train.subwayId == '1002' &&
          train.updnLine == (direction == Direction.INNER ? '내선' : '외선')
        ) {
          let currentArvlCd = null;
          if (train.arvlCd == '4') {
            currentArvlCd = 5;
          } else if (train.arvlCd == 5) {
            currentArvlCd = 4;
          } else {
            currentArvlCd = parseInt(train.arvlCd);
          }
          if (!arvlCd) {
            arrival = train;
            arvlCd = currentArvlCd;
          } else if (arvlCd < currentArvlCd) {
            break;
          } else if (
            currentArvlCd === '99' &&
            parseInt(arrival.ordkey.substring(0, 5)) >
              parseInt(train.ordkey.substring(0, 5))
          ) {
            arrival = train;
          }
        }
      }
    }
    return arrival;
  };

  const pullToRefresh = () => {
    apiGET(APIS.post.main());
    apiGET(APIS.realtime.position());
    origin && apiGET(APIS.realtime.arrival(origin.split('(')[0]));
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
    pullToRefresh();
    apiGET(APIS.route.starred());
    const everySecond = setInterval(() => setCurrentTime(new Date()), 1000);
    const everyHalfMinute = setInterval(() => {
      if (!positionsLoading && !arrivalLoading) {
        apiGET(APIS.realtime.position());
        origin && apiGET(APIS.realtime.arrival(origin.split('(')[0]));
      }
    }, 15000);
    return () => {
      clearInterval(everySecond);
      clearInterval(everyHalfMinute);
    };
  }, [origin]);

  useEffect(() => {
    if (mainFeed) {
      const mainPosts = {};
      mainFeed.forEach(post => {
        mainPosts[postKey(post)] = post;
      });
      dispatch(setMainPosts(mainPosts));
    }
  }, [mainLoading]);

  useEffect(() => {
    if (defaultRoute) {
      dispatch(setRoute(defaultRoute.route));
    }
  }, [starredLoading]);

  useEffect(() => {
    !positionsLoading &&
      dispatch(setTrainPositions(filterPositionResponse(realtimePositionList)));
  }, [positionsLoading]);

  useEffect(() => {
    !arrivalLoading &&
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
                  {name: '핫플', value: ChannelFilter.PLACE},
                  {name: '일상', value: ChannelFilter.TALK},
                  {name: '이슈', value: ChannelFilter.EVENTS},
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
                <Div h10 bg={LINE2_COLOR}></Div>
              </Col>
              <Col
                auto
                w200
                borderWidth={3}
                borderColor={LINE2_COLOR}
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
                <Row h10 bg={LINE2_COLOR}></Row>
              </Col>
            </Row>
            <Row pt5>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(origin && destination
                  ? stationArr([], previewStart, previewStart, direction)
                  : stationArr([], origin, destination, Direction.INNER)
                ).map((item, index) => {
                  const trainAtStation = trainPositions?.[item.split('(')[0]];
                  const isRiding =
                    trainAtStation?.trainNo === selectedTrain?.trainNo;
                  const isOrigin = origin === item;
                  const isDestination = destination === item;
                  const leftHalfBg = () => {
                    if (stations.length > 0) {
                      if (isOrigin) return GRAY_COLOR;
                      else if (isDestination) return LINE2_COLOR;
                      else if (stations.includes(item)) return LINE2_COLOR;
                      else return GRAY_COLOR;
                    } else {
                      return LINE2_COLOR_LIGHT;
                    }
                  };
                  const rightHalfBg = () => {
                    if (stations.length > 0) {
                      if (isOrigin) return LINE2_COLOR;
                      else if (isDestination) return GRAY_COLOR;
                      else if (stations.includes(item)) return LINE2_COLOR;
                      else return GRAY_COLOR;
                    } else {
                      return LINE2_COLOR_LIGHT;
                    }
                  };
                  return (
                    <Col key={index}>
                      <Div
                        mb10
                        justifyCenter
                        itemsCenter
                        h30
                        onPress={() => {
                          if (trainAtStation) {
                            isRiding
                              ? dispatch(setSelectedTrain(null))
                              : dispatch(setSelectedTrain(trainAtStation));
                          }
                        }}
                        w={Dimensions.get('window').width / 5}>
                        {trainAtStation && (
                          <>
                            <Span
                              medium
                              fontSize={10}
                              color={isRiding ? 'rgb(255,69,58)' : 'black'}
                              style={{...textShadowProp}}>
                              {isRiding ? '탑승중' : '탑승하기'}
                            </Span>
                            <Row justifyCenter itemsCenter>
                              <Col auto>
                                <FontAwesomeIcon
                                  icon={faSubway}
                                  color={
                                    isRiding ? LINE2_COLOR : LINE2_COLOR_LIGHT
                                  }
                                  size={18}></FontAwesomeIcon>
                              </Col>
                              <Col auto ml5>
                                <Span
                                  fontSize={10}
                                  color={
                                    isRiding ? LINE2_COLOR : LINE2_COLOR_LIGHT
                                  }>
                                  {`${
                                    TRAIN_STATE[trainAtStation.trainSttus] ||
                                    '출발'
                                  }(${trainAtStation.statnTnm})`}
                                </Span>
                              </Col>
                            </Row>
                          </>
                        )}
                      </Div>
                      <Div
                        relative
                        mb10
                        justifyCenter
                        itemsCenter
                        h10
                        w={Dimensions.get('window').width / 5}>
                        <Row absolute w={'100%'} h={'100%'}>
                          <Col bg={leftHalfBg()}></Col>
                          <Col bg={rightHalfBg()}></Col>
                        </Row>
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
                              isOrigin
                                ? 'rgb(255,69,58)'
                                : isDestination
                                ? 'blue'
                                : 'black'
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
            {mainPosts &&
              Object.keys(mainPosts)
                .map(key => {
                  return mainPosts[key];
                })
                .filter(post => {
                  return filterPostsByStation(post);
                })
                .sort((a, b) => {
                  return (
                    new Date(b.post.createdAt).getTime() -
                    new Date(a.post.createdAt).getTime()
                  );
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
          <Row itemsCenter justifyCenter pt20 pb10>
            <Col h2 bg={GRAY_COLOR} />
            <Col auto>
              <CheckCircle
                height={100}
                width={100}
                strokeWidth={0.7}
                color={GRAY_COLOR}></CheckCircle>
            </Col>
            <Col h2 bg={GRAY_COLOR}></Col>
          </Row>
          <Row pb20>
            <Col></Col>
            <Col auto>
              <Span color={GRAY_COLOR}>오늘의 피드를 모두 확인했습니다.</Span>
            </Col>
            <Col></Col>
          </Row>
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

export default HomeScreen;
