import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, View} from 'react-native';
import {ChevronDown, RefreshCw} from 'react-native-feather';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {
  chevronDownSettings,
  Direction,
  GRAY_COLOR,
  kmoment,
  LINE2_COLOR,
  LINE2_Linked_List,
  shortenStations,
} from 'src/modules/constants';
import {isOkay, stationArr} from 'src/modules/utils';
import {deletePromiseFn, getPromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {setSelectedTrain} from 'src/redux/routeReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';
import HorizontalStations from './HorizontalStations';

const TrainStatusBoxPlaceholder = ({
  message = '열차 정보를 불러오고 있습니다.',
  onPress = null,
}) => {
  return (
    <Div bg={'white'} flex py40 onPress={onPress}>
      <Row py10>
        <Col />
        <Col auto>
          <Span>{message}</Span>
        </Col>
        <Col />
      </Row>
      <SkeletonPlaceholder>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 20,
              width: 100,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              width: 200,
              borderRadius: 20,
              height: 80,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
          <View
            style={{
              height: 20,
              width: 100,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 30,
            flexDirection: 'column',
          }}>
          <View
            style={{
              height: 20,
            }}
          />
        </View>
      </SkeletonPlaceholder>
    </Div>
  );
};

const TrainStatusBox = ({handleSelectDirection}) => {
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdate, setLastUpdate] = useState(kmoment().calendar());
  const [trainPositions, setTrainPositions] = useState(null);
  const [arrivalTrain, setArrivalTrain] = useState(null);
  const {
    route: {origin, destination, direction, stations},
    selectedTrain,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {
    app: {
      session: {token},
    },
  } = useSelector((root: RootState) => root, shallowEqual);
  const displayedStation = useMemo(() => {
    return selectedTrain?.statnNm || origin;
  }, [selectedTrain, origin]);
  const previewStart = useMemo(
    () =>
      stationArr(
        [],
        origin,
        origin,
        direction === Direction.INNER ? Direction.OUTER : Direction.INNER,
        4,
      )[3],
    [origin, direction],
  );
  const filterPositionResponse = useCallback(
    response => {
      const trainLocations = {};
      if (response && response.errorMessage?.status === 200) {
        let trainEnded = true;
        response.realtimePositionList.forEach(async train => {
          if (
            train.subwayNm == '2호선' &&
            train.updnLine == (direction == Direction.INNER ? '0' : '1')
          ) {
            if (train.trainNo == selectedTrain?.trainNo) {
              trainEnded = false;
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
                  Alert.alert('도착하셨습니다.');
                }
              }
            }
            trainLocations[train.statnNm] = train;
          }
        });
        if (trainEnded && selectedTrain) {
          dispatch(setSelectedTrain(null));
          deletePromiseFn({
            url: APIS.route.notification().url,
            body: {},
            token: token,
          });
          Alert.alert('탑승하신 열차의 2호선 운행이 끝났습니다.');
        }
      } else if (response && response.errorMessage?.status === 201) {
        return response.errorMessage.message;
      } else {
        return null;
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
        const ETA = kmoment(
          arrivalTrain.recptnDt.substring(0, arrivalTrain.recptnDt.length - 2),
        )
          .add(minutes, 'minutes')
          .add(seconds, 'seconds');
        const diff = ETA.diff(currentTime);
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

  const refresh = async () => {
    setTrainPositions(null);
    setArrivalTrain(null);
    const positionRes = await getPromiseFn({
      url: APIS.realtime.position().url,
      token,
    });
    const arrivalRes = await getPromiseFn({
      url: APIS.realtime.arrival(origin.split('(')[0]).url,
      token,
    });
    if (isOkay(positionRes) && isOkay(arrivalRes)) {
      setTrainPositions(filterPositionResponse(positionRes.data?.data));
      setArrivalTrain(filterArrivalResponse(arrivalRes.data?.data));
      setLastUpdate(kmoment().calendar());
    }
  };

  useEffect(() => {
    const everySecond = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(everySecond);
    };
  }, [origin, direction]);

  useEffect(() => {
    origin && destination && refresh();
  }, [selectedTrain?.trainNo, origin, destination]);

  const prevStation = useMemo(() => {
    return displayedStation
      ? direction === Direction.INNER
        ? LINE2_Linked_List.get(displayedStation).prev
        : LINE2_Linked_List.get(displayedStation).next
      : '길 미설정';
  }, [displayedStation, direction]);

  const nextStation = useMemo(() => {
    return displayedStation
      ? direction === Direction.INNER
        ? LINE2_Linked_List.get(displayedStation).next
        : LINE2_Linked_List.get(displayedStation).prev
      : '길 미설정';
  }, [displayedStation, direction]);
  const isRiding = useMemo(() => {
    return (
      stations && shortenStations(stations).includes(selectedTrain?.statnNm)
    );
  }, [stations, selectedTrain]);
  const eta = () => {
    return isRiding ? '탑승중' : calculateETADiff() || '정보 없음';
  };
  const currentStation = useMemo(() => {
    return (
      <Span fontSize={23} bold textCenter>
        {displayedStation
          ? displayedStation.split('(')[0]
          : '출발지를 설정해주세요'}
      </Span>
    );
  }, [displayedStation]);
  const horizontalStations = useMemo(() => {
    return origin && destination
      ? stationArr([], previewStart, previewStart, direction)
      : stationArr([], '시청', '시청', Direction.INNER);
  }, [origin, destination, previewStart, direction]);

  if (typeof trainPositions == 'string') {
    return (
      <TrainStatusBoxPlaceholder message={trainPositions} onPress={refresh} />
    );
  }
  if (!trainPositions || !arrivalTrain) {
    return <TrainStatusBoxPlaceholder onPress={refresh} />;
  }
  return (
    <Div pb20 pt10>
      <Row px20 pb10>
        <Col justifyCenter itemsCenter>
          <Span medium numberOfLines={1} ellipsizeMode="head">
            {prevStation}
          </Span>
        </Col>
        <Col auto w150 itemsCenter>
          <Row rounded5 auto mx20 py5 my5 onPress={handleSelectDirection}>
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
              {eta()}
            </Span>
          </Row>
        </Col>
        <Col justifyCenter itemsCenter>
          <Span medium numberOfLines={1} ellipsizeMode="tail">
            {nextStation}
          </Span>
        </Col>
      </Row>
      <Row pb10 onPress={refresh}>
        <Col justifyCenter>
          <Div h10 bg={LINE2_COLOR}></Div>
        </Col>
        <Col
          auto
          w250
          borderWidth={3}
          borderColor={LINE2_COLOR}
          rounded20
          itemsCenter
          py10
          bgWhite>
          <Row>{currentStation}</Row>
          <Row>
            <Span
              fontSize={10}
              color={GRAY_COLOR}>{`마지막 업데이트: ${lastUpdate}`}</Span>
            <RefreshCw strokeWidth={2} height={12} color={'black'} />
          </Row>
        </Col>
        <Col justifyCenter flex>
          <Row h10 bg={LINE2_COLOR}></Row>
        </Col>
      </Row>
      <Row justifyCenter>
        <HorizontalStations
          horizontalStations={horizontalStations}
          trainPositions={trainPositions}
        />
      </Row>
    </Div>
  );
};

export default React.memo(TrainStatusBox);
