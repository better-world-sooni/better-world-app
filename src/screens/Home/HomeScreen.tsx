import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, RefreshControl} from 'react-native';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import APIS from 'src/modules/apis';
import {IMAGES} from 'src/modules/images';
import {ScrollView} from 'src/modules/viewComponents';
import {
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
  HAS_NOTCH,
  iconSettings,
  LINE2_Linked_List,
  MAIN_LINE2,
  MY_ROUTE,
  Selecting,
} from 'src/modules/constants';
import {
  setRoute,
  setDestination,
  setOrigin,
  setDirection,
  setTrainPositions,
  setArrivalTrain,
} from 'src/redux/routeReducer';
import {shortenAddress, stationArr} from 'src/modules/utils';
import {RootState} from 'src/redux/rootReducer';
import {
  setGlobalFilter,
  setNewPosts,
  setPrevPosts,
} from 'src/redux/feedReducer';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faSubway} from '@fortawesome/free-solid-svg-icons';
import {Header} from 'src/components/Header';
import {ScrollSelector} from 'src/components/ScrollSelector';

const HomeScreen = props => {
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

  const {data: mainBeforeResponse, isLoading: postsBeforeLoading} =
    useApiSelector(APIS.post.main.before);
  const {data: mainAfterResponse, isLoading: postsAfterLoading} =
    useApiSelector(APIS.post.main.after);

  const {
    route: {origin, destination, direction, stations},
    selectedTrain,
    trainPositions,
    currentStation,
    arrivalTrain,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const displayedStation = currentStation || origin;
  const {prevPosts, newPosts, globalFiter} = useSelector(
    (root: RootState) => root.feed,
    shallowEqual,
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  const apiGET = useReloadGET();
  const apiPOST = useReloadPOST();
  const dispatch = useDispatch();

  const filterPositionResponse = response => {
    const trainLocations = {};
    if (response && response.errorMessage.status === 200) {
      response.realtimePositionList.forEach(train => {
        if (
          train.subwayNm === '2호선' &&
          train.updnLine === (direction === Direction.INNER ? '1' : '0')
        ) {
          trainLocations[train.statnNm] = train;
        }
      });
    }
    console.log('trainLocations', trainLocations);
    return trainLocations;
  };

  const filterArrivalResponse = response => {
    let arrival = null;
    if (response && response.errorMessage.status == 200) {
      response.realtimeArrivalList.forEach(train => {
        if (
          train.subwayId === '1002' &&
          train.updnLine === (direction === Direction.INNER ? '내선' : '외선')
        ) {
          console.log('im here');
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
    apiGET(APIS.realtime.position());
    displayedStation &&
      apiGET(APIS.realtime.arrival(displayedStation.split('(')[0]));
  };

  const calculateETADiff = useCallback(() => {
    const eta = arrivalTrain?.arvlMsg2?.split(' ');
    if (eta && eta[eta.length - 1] === '후') {
      try {
        const minutes = parseInt(eta[0].substring(0, eta[0].length - 1));
        const seconds = parseInt(eta[1].substring(0, eta[1].length - 1));
        const receptionDate = new Date(
          arrivalTrain.recptnDt
            .substring(0, arrivalTrain.recptnDt.length - 2)
            .replace('-', '/')
            .replace('-', '/'),
        );
        const ETA = new Date(
          receptionDate.getTime() + minutes * 60000 + seconds * 1000,
        );
        const diff = ETA.getTime() - currentTime.getTime();
        const diffMinutes = Math.floor(diff / 60000);
        const diffSeconds = Math.floor((diff % 60000) / 1000);
        return `${diffMinutes}분 ${diffSeconds}초 후`;
      } catch (e) {
        return arrivalTrain?.arvlMsg2;
      }
    } else {
      return arrivalTrain?.arvlMsg2;
    }
  }, [arrivalTrain, currentTime]);

  useEffect(() => {
    apiGET(APIS.route.starred());
    pullToRefresh();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (mainBeforeResponse) {
      dispatch(setPrevPosts(mainBeforeResponse.data));
    }
  }, [postsBeforeLoading]);

  useEffect(() => {
    if (mainAfterResponse) {
      dispatch(setNewPosts(mainAfterResponse.data));
    }
  }, [postsAfterLoading]);

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
              <Col mx5 auto itemsCenter justifyCenter>
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
            <Row
              px10
              pt10
              borderBottomColor={'rgb(199,199,204)'}
              borderBottomWidth={0.5}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Div
                  auto
                  px15
                  py5
                  mr10
                  justifyCenter
                  borderBottomColor={'black'}
                  borderBottomWidth={1.5}>
                  <Span medium color={'black'} fontSize={15}>
                    전체
                  </Span>
                </Div>
                <Div
                  auto
                  borderBottomColor={'rgb(255,69,58)'}
                  px15
                  py5
                  mr10
                  justifyCenter>
                  <Span medium color={'rgb(250, 196, 192)'} fontSize={15}>
                    민원
                  </Span>
                </Div>
                {['핫플/맛집', '음악', '시사', '스포츠', '게임'].map(
                  (item, index) => {
                    return (
                      <Div key={index} auto px15 py5 mr10 justifyCenter>
                        <Span medium color={'rgb(199,199,204)'} fontSize={15}>
                          {item}
                        </Span>
                      </Div>
                    );
                  },
                )}
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
                    {calculateETADiff() || '정보 없음'}
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
                  return (
                    <Col key={index}>
                      <Div
                        mb10
                        justifyCenter
                        itemsCenter
                        h30
                        w={Dimensions.get('window').width / 5}>
                        {trainPositions?.[item.split('(')[0]] && (
                          <>
                            <Span
                              medium
                              fontSize={10}
                              color={
                                item.trainNo === selectedTrain
                                  ? 'rgb(255,69,58)'
                                  : 'black'
                              }
                              style={{...textShadowProp}}>
                              {item.trainNo === selectedTrain
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
            {prevPosts.map((item, index) => {
              const sungan = item.sungan;
              return (
                <Div bg={'rgba(255,255,255,.9)'} pb10 key={index} px20>
                  <Row
                    itemsCenter
                    py20
                    borderTopColor={'rgb(199,199,204)'}
                    borderTopWidth={0.3}>
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
                  <Div py10>
                    <Row rounded20 bgWhite w={'100%'} {...shadowProp(0.3)}>
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
                  <Row itemsCenter pt10 pb5>
                    <Col auto>
                      <Row>
                        <Span medium>순간 좋아요 0개</Span>
                      </Row>
                    </Col>
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
                    <Row itemsCenter py5>
                      <Span color={'gray'}>{`${
                        sungan.comments.length - 1
                      }개 댓글 더보기`}</Span>
                    </Row>
                  )}
                  {sungan.comments.slice(0, 1).map((comment, index) => {
                    return (
                      <Row key={index} itemsCenter justifyCenter pb10 pt5 flex>
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

export default HomeScreen;
