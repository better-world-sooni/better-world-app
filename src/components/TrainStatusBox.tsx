import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Dimensions} from 'react-native';
import {ChevronDown} from 'react-native-feather';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {
  chevronDownSettings,
  Direction,
  LINE2_COLOR,
  LINE2_Linked_List,
  shortenStations,
} from 'src/modules/constants';
import {isOkay, stationArr} from 'src/modules/utils';
import {ScrollView} from 'src/modules/viewComponents';
import {
  deletePromiseFn,
  postPromiseFn,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {setSelectedTrain} from 'src/redux/routeReducer';
import ColoredTrainPath from './ColoredTrainPath';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';
import PressableTrain from './PressableTrain';
import StationLabel from './StationLabel';

const TrainStatusBox = ({handleSelectDirection}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const apiGET = useReloadGET();
  const dispatch = useDispatch();
  const {
    route: {origin, destination, direction, stations},
    selectedTrain,
    trainPositions,
    arrivalTrain,
    receiveStationPush,
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
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
  const fifthOfWindow = useMemo(
    () => Dimensions.get('window').width / 5,
    [Dimensions],
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
  const handlePressRide = useCallback(
    async (trainAtStation, isRiding) => {
      if (trainAtStation) {
        if (isRiding) {
          dispatch(setSelectedTrain(null));
          const res = await deletePromiseFn({
            url: APIS.route.notification().url,
            body: {},
            token: token,
          });
          if (isOkay(res)) {
            Alert.alert('Success', '역알림이 취소 되었습니다.');
          } else {
            Alert.alert('Error', '역알림이 취소중 문제가 발생하였습니다.');
          }
        } else {
          dispatch(setSelectedTrain(trainAtStation));
          if (receiveStationPush) {
            const res = await postPromiseFn({
              url: APIS.route.notification().url,
              body: {
                trainNo: trainAtStation?.trainNo,
                stations: shortenStations(
                  stationArr(
                    [],
                    LINE2_Linked_List[trainAtStation.statnNm].next,
                    stations[stations.length - 1],
                    direction,
                  ),
                ),
              },
              token: token,
            });
            if (isOkay(res)) {
              Alert.alert('Success', '역알림이 설정 되었습니다.');
            } else {
              Alert.alert('Error', '역알림이 설정중 문제가 발생하였습니다.');
            }
          }
        }
      }
    },
    [token, receiveStationPush, stations, direction],
  );

  useEffect(() => {
    apiGET(APIS.route.starred());
    const everySecond = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(everySecond);
    };
  }, [origin, direction]);

  const prevStation = useCallback(() => {
    return displayedStation
      ? direction === Direction.INNER
        ? LINE2_Linked_List[displayedStation].prev
        : LINE2_Linked_List[displayedStation].next
      : '길 미설정';
  }, [displayedStation, direction]);

  const nextStation = useCallback(() => {
    return displayedStation
      ? direction === Direction.INNER
        ? LINE2_Linked_List[displayedStation].next
        : LINE2_Linked_List[displayedStation].prev
      : '길 미설정';
  }, [displayedStation, direction]);

  const eta = useCallback(() => {
    return stations &&
      shortenStations(stations).includes(selectedTrain?.statnNm)
      ? '탑승중'
      : calculateETADiff() || '정보 없음';
  }, [stations, selectedTrain, calculateETADiff]);
  const currentStation = useCallback(() => {
    return (displayedStation ? displayedStation : '출발지를 설정해주세요')
      .split('(')
      .join(' (')
      .split(' ')
      .map(word => {
        return (
          <Span fontSize={23} bold textCenter key={word}>
            {word}
          </Span>
        );
      });
  }, [displayedStation]);
  const horizontalStations = useCallback(() => {
    return origin && destination
      ? stationArr([], previewStart, previewStart, direction)
      : stationArr([], '시청', '시청', Direction.INNER);
  }, [origin, destination, previewStart, direction]);
  const getTrainAtStation = useCallback(
    item => {
      return trainPositions?.[item.split('(')[0]];
    },
    [trainPositions],
  );
  const getIsRiding = useCallback(
    trainAtStation => {
      return trainAtStation?.trainNo === selectedTrain?.trainNo;
    },
    [selectedTrain],
  );
  const HorzontalStation = useCallback(
    ({item, trainAtStation, isRiding, isOrigin, isDestination}) => {
      return (
        <Div>
          <PressableTrain
            width={fifthOfWindow}
            trainAtStation={trainAtStation}
            isRiding={isRiding}
            handlePressRide={handlePressRide}
          />
          <ColoredTrainPath
            width={fifthOfWindow}
            stationName={item}
            isOrigin={isOrigin}
            isDestination={isDestination}
          />
        </Div>
      );
    },
    [fifthOfWindow, handlePressRide],
  );
  return (
    <Div py20>
      <Row px20>
        <Col justifyCenter itemsCenter>
          <Span medium numberOfLines={1} ellipsizeMode="head">
            {prevStation()}
          </Span>
        </Col>
        <Col auto w150 itemsCenter pb10>
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
            {nextStation()}
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
          {currentStation()}
        </Col>
        <Col justifyCenter flex>
          <Row h10 bg={LINE2_COLOR}></Row>
        </Col>
      </Row>
      <Row pt5>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {horizontalStations().map((item, index) => {
            const trainAtStation = getTrainAtStation(item);
            const isRiding = getIsRiding(trainAtStation);
            const isOrigin = origin === item;
            const isDestination = destination === item;
            return (
              <HorzontalStation
                key={index}
                item={item}
                trainAtStation={trainAtStation}
                isRiding={isRiding}
                isOrigin={isOrigin}
                isDestination={isDestination}
              />
            );
          })}
        </ScrollView>
      </Row>
    </Div>
  );
};

export default TrainStatusBox;
