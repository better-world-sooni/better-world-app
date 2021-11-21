import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {Alert, Dimensions, View} from 'react-native';
import {ChevronDown} from 'react-native-feather';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {
  chevronDownSettings,
  Direction,
  GRAY_COLOR,
  LINE2_COLOR,
  LINE2_Linked_List,
  shortenStations,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {isOkay, stationArr} from 'src/modules/utils';
import {
  deletePromiseFn,
  postPromiseFn,
  useReloadGET,
} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {setSelectedTrain} from 'src/redux/routeReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Img} from './common/Img';
import {Row} from './common/Row';
import {Span} from './common/Span';
import HorizontalStations from './HorizontalStations';

const TrainStatusBoxPlaceholder = ({message = null}) => {
  return (
    <Div bg={'white'} flex py40>
      <Row py10>
        <Col />
        <Col>
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

const TrainStatusBox = ({
  handleSelectDirection,
  trainPositions,
  arrivalTrain,
}) => {
  if (!trainPositions || !arrivalTrain || typeof trainPositions == 'string') {
    return <TrainStatusBoxPlaceholder message={trainPositions} />;
  }
  const [currentTime, setCurrentTime] = useState(new Date());
  const {
    route: {origin, destination, direction, stations},
    selectedTrain,
  } = useSelector((root: RootState) => root.route, shallowEqual);
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
          arrivalTrain.recptnDt.substring(0, arrivalTrain.recptnDt.length - 2),
        );
        const ETA = new Date(
          receptionDate.getTime() +
            minutes * 60000 +
            seconds * 1000 -
            9 * 60000 * 60,
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
    const everySecond = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(everySecond);
    };
  }, [origin, direction]);

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
  const horizontalStations = useMemo(() => {
    return origin && destination
      ? stationArr([], previewStart, previewStart, direction)
      : stationArr([], '시청', '시청', Direction.INNER);
  }, [origin, destination, previewStart, direction]);
  return (
    <Div py20>
      <Row px20>
        <Col justifyCenter itemsCenter>
          <Span medium numberOfLines={1} ellipsizeMode="head">
            {prevStation}
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
            {nextStation}
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
          {currentStation}
        </Col>
        <Col justifyCenter flex>
          <Row h10 bg={LINE2_COLOR}></Row>
        </Col>
      </Row>
      <Row pt5 justifyCenter>
        <HorizontalStations
          horizontalStations={horizontalStations}
          trainPositions={trainPositions}
        />
      </Row>
    </Div>
  );
};

export default React.memo(TrainStatusBox);
