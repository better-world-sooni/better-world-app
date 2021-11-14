import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Dimensions, RefreshControl} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {ScrollView} from 'src/modules/viewComponents';
import {
  deletePromiseFn,
  postPromiseFn,
  useApiSelector,
  useReloadGET,
} from 'src/redux/asyncReducer';
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
  shortenStations,
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
import {isOkay, postKey, stationArr} from 'src/modules/utils';
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
import TrainStatusBox from 'src/components/TrainStatusBox';

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
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const {mainPosts, globalFiter} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );
  const [channelFilter, setChannelFilter] = useState(ChannelFilter.ALL);
  const apiGET = useReloadGET();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const filterPostsByChannel = useCallback(
    post => {
      if (channelFilter === ChannelFilter.ALL) {
        return true;
      } else if (
        channelFilter === ChannelFilter.REPORT &&
        post.type === REPORT
      ) {
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
    },
    [channelFilter],
  );
  const filterPostsByStation = useCallback(
    post => {
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
    },
    [globalFiter, filterPostsByChannel],
  );
  const filterPositionResponse = useCallback(
    response => {
      const trainLocations = {};
      if (response && response.errorMessage?.status === 200) {
        response.realtimePositionList.forEach(async train => {
          if (
            train.subwayNm == '2호선' &&
            train.updnLine == (direction == Direction.INNER ? '0' : '1')
          ) {
            if (train.trainNo == selectedTrain?.trainNo) {
              dispatch(setSelectedTrain(train));
              if (
                !shortenStations(stations).includes(train.statnNm) &&
                stationArr([], train.statnNm, origin, direction).length > 4
              ) {
                dispatch(setSelectedTrain(null));
                const res = await deletePromiseFn({
                  url: APIS.route.notification().url,
                  body: {},
                  token: token,
                });
                if (isOkay(res)) {
                  Alert.alert('Success', '도착 하셨습니다.');
                }
              }
            }
            trainLocations[train.statnNm] = train;
          }
        });
      }
      return trainLocations;
    },
    [selectedTrain, setSelectedTrain, stations, origin, direction, token],
  );
  const filterArrivalResponse = useCallback(
    response => {
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
    },
    [direction],
  );
  const pullToRefresh = useCallback(() => {
    apiGET(APIS.post.main());
    apiGET(APIS.realtime.position());
    origin && apiGET(APIS.realtime.arrival(origin.split('(')[0]));
  }, [origin]);

  useEffect(() => {
    apiGET(APIS.post.main());
    apiGET(APIS.route.starred());
    const everyQuarterMinute = setInterval(() => {
      if (!positionsLoading && !arrivalLoading) {
        apiGET(APIS.realtime.position());
        origin && apiGET(APIS.realtime.arrival(origin.split('(')[0]));
      }
    }, 15000);
    return () => {
      clearInterval(everyQuarterMinute);
    };
  }, [origin, direction]);

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
  const blackBorderBottomProp = useCallback(bool => {
    if (bool) {
      return {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      };
    } else {
      return {};
    }
  }, []);
  const redBorderBottomProp = useCallback(bool => {
    if (bool) {
      return {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
      };
    } else {
      return {};
    }
  }, []);
  const exchangeOD = useCallback(() => {
    if (origin && destination) {
      dispatch(exchangeOriginDestination());
    } else {
      Alert.alert('출발지와 도착지를 먼저 설정해주세요.');
    }
  }, [origin, destination]);

  const handleSelectGlobalFilter = useCallback(
    () => setSelecting(Selecting.GLOBAL_FILTER),
    [],
  );
  const handleSelectOrigin = useCallback(
    () => setSelecting(Selecting.ORIGIN),
    [],
  );
  const handleSelectDestination = useCallback(
    () => setSelecting(Selecting.DESTINATION),
    [],
  );
  const handleSelectDirection = useCallback(
    () => setSelecting(Selecting.DIRECTION),
    [],
  );
  const handleSelectDone = useCallback(() => setSelecting(Selecting.NONE), []);
  const handleSetChannelFilterAll = useCallback(
    () => setChannelFilter(ChannelFilter.ALL),
    [],
  );
  const handleSetChannelFilterReport = useCallback(
    () => setChannelFilter(ChannelFilter.REPORT),
    [],
  );

  const MainPosts = useCallback(
    mainPosts =>
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
        }),
    [navigation, token],
  );

  return (
    <Div flex bgWhite>
      <Div h={HAS_NOTCH ? 44 : 20} bg={'rgba(255,255,255,.9)'} />
      <Div flex relative>
        <Header
          bg={'rgba(255,255,255,.9)'}
          onSelect={handleSelectGlobalFilter}
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
                onPress={handleSelectOrigin}>
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
                onPress={handleSelectDestination}>
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
            <Row borderBottomColor={GRAY_COLOR} borderBottomWidth={0.5}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Div
                  auto
                  pt10
                  justifyCenter
                  {...blackBorderBottomProp(
                    channelFilter === ChannelFilter.ALL,
                  )}>
                  <Div w={'100%'} py5 px20 onPress={handleSetChannelFilterAll}>
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
                  pt10
                  borderBottomColor={'rgb(255,69,58)'}
                  justifyCenter
                  {...redBorderBottomProp(
                    channelFilter === ChannelFilter.REPORT,
                  )}>
                  <Div
                    w={'100%'}
                    py5
                    px20
                    onPress={handleSetChannelFilterReport}>
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
                      pt10
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
          <TrainStatusBox handleSelectDirection={handleSelectDirection} />
          <Div>{mainPosts && MainPosts(mainPosts)}</Div>
          <Row itemsCenter justifyCenter pt20 pb10>
            <Col h2 bg={GRAY_COLOR} />
            <Col auto>
              <CheckCircle
                height={50}
                width={50}
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
          onClose={handleSelectDone}
        />
      )}
    </Div>
  );
};

export default HomeScreen;
