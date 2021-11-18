import React, {useCallback, useMemo, useState} from 'react';
import {Alert, Modal} from 'react-native';
import {ChevronDown, RefreshCw} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import APIS from 'src/modules/apis';
import {
  characterDesc,
  chevronDownSettings,
  Direction,
  GO_COLOR,
  GRAY_COLOR,
  Selecting,
  Validity,
} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {stationArr} from 'src/modules/utils';
import {ScrollView} from 'src/modules/viewComponents';
import {postPromiseFn} from 'src/redux/asyncReducer';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';
import OD from './OD';
import {ScrollSelector} from './ScrollSelector';

const ODSelect = ({visible, onPressReturn}) => {
  const {token} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [direction, setDirection] = useState(null);
  const [stations, setStations] = useState([]);
  const [selecting, setSelecting] = useState(null);
  const fullStations = useMemo(() => {
    return stationArr([], '시청', '충정로(경기대입구)', Direction.CW);
  }, []);
  const handleSelectOrigin = () => setSelecting(Selecting.ORIGIN);
  const handleSelectDestination = () => setSelecting(Selecting.DESTINATION);
  const handleSelectDirection = () => setSelecting(Selecting.DIRECTION);
  const handleSetOrigin = ori => {
    setOrigin(ori);
    console.log(origin, destination);
    if (destination) {
      const innerCircle = stationArr([], origin, destination, Direction.INNER);
      const outerCircle = stationArr([], origin, destination, Direction.OUTER);
      if (innerCircle.length < outerCircle.length) {
        setDirection(Direction.INNER);
        setStations(innerCircle);
      } else {
        setDirection(Direction.OUTER);
        setStations(outerCircle);
      }
    } else {
      setStations([]);
      setDirection(null);
    }
  };
  const handleSetDestination = ori => {
    setDestination(ori);
    console.log(origin, destination);
    if (origin) {
      const innerCircle = stationArr([], origin, destination, Direction.INNER);
      const outerCircle = stationArr([], origin, destination, Direction.OUTER);
      if (innerCircle.length < outerCircle.length) {
        setDirection(Direction.INNER);
        setStations(innerCircle);
      } else {
        setDirection(Direction.OUTER);
        setStations(outerCircle);
      }
    } else {
      setStations([]);
      setDirection(null);
    }
  };
  const handleSetDirection = dir => {
    setDirection(dir);
    if (origin && destination) {
      setStations(stationArr([], origin, destination, dir));
    } else {
      setStations([]);
    }
  };
  const exchangeOD = state => {
    if (origin && destination) {
      const prevOrigin = origin;
      const prevDestination = destination;
      const nextDirection =
        direction == Direction.INNER ? Direction.OUTER : Direction.INNER;
      const stations = stationArr(
        [],
        prevDestination,
        prevOrigin,
        nextDirection,
      );
      setOrigin(prevDestination);
      setDestination(prevOrigin);
      setDirection(nextDirection);
      setStations(stations);
    }
  };
  const selectGetterSetter = {
    [Selecting.ORIGIN]: {
      get: origin,
      set: handleSetOrigin,
      options: fullStations,
    },
    [Selecting.DESTINATION]: {
      get: destination,
      set: handleSetDestination,
      options: fullStations,
    },
    [Selecting.DIRECTION]: {
      get: direction,
      set: handleSetDirection,
      options: [Direction.INNER, Direction.OUTER],
    },
  };
  const borderProp = useCallback(bool => {
    if (!bool || bool === Validity.NULL || bool === Validity.ZERO) {
      return {
        borderColor: GRAY_COLOR,
        borderWidth: 1,
      };
    } else if (bool === Validity.INVALID) {
      return {
        borderColor: 'red',
        borderWidth: 1,
      };
    } else {
      return {
        borderColor: 'black',
        borderWidth: 1,
      };
    }
  }, []);
  const postOD = async () => {
    if (!origin) {
      Alert.alert(
        '잠시만요!',
        '출발지를 설정하지 않으셨습니다. 내 길 재설정을 취소하시겠습니까?',
        [{text: '네', onPress: onPressReturn}, {text: '아니요'}],
      );
      return;
    }
    if (!destination) {
      Alert.alert(
        '잠시만요!',
        '도착지를 설정하지 않으셨습니다. 내 길 재설정을 취소하시겠습니까?',
        [{text: '네', onPress: onPressReturn}, {text: '아니요'}],
      );
      return;
    }
    const defaultRouteResponse = await postPromiseFn({
      url: APIS.route.starred().url,
      body: {
        route: {
          origin: origin,
          destination: destination,
          stations: stations,
          direction: direction,
        },
        main: true,
      },
      token: token,
    });
    if (defaultRouteResponse.status == 200) {
      Alert.alert('성공', '내 길 재설정이 완료 되었습니다.');
    } else {
      Alert.alert('Error', '내 길 설정중 문재가 발생하였습니다.');
    }
    onPressReturn();
  };
  return (
    <Modal
      visible={visible}
      animationType={'slide'}
      presentationStyle="pageSheet">
      <Div flex>
        <Row py20 justifyCenter itemsCenter>
          <Col />
          <Col itemsCenter>
            <Span bold fontSize={20}>
              내 기본길 선택
            </Span>
          </Col>
          <Col itemsEnd onPress={postOD}>
            <Span px20 color={GO_COLOR}>
              완료
            </Span>
          </Col>
        </Row>
        <Div rounded5 mt20 {...borderProp(null)} pb5 mx20>
          <Row
            itemsCenter
            justifyCenter
            rounded5
            auto
            mx20
            py5
            my5
            onPress={handleSelectDirection}>
            <Col auto>
              <Span
                bold
                textCenter
                color={'black'}
                numberOfLines={1}
                ellipsizeMode="head">
                {direction || '방향'}
              </Span>
            </Col>
            <Col auto justifyCenter>
              <ChevronDown {...chevronDownSettings}></ChevronDown>
            </Col>
          </Row>
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
        </Div>
        <Div flex={1} justifyCenter></Div>
        {selecting && (
          <ScrollSelector
            selectedValue={selectGetterSetter[selecting].get}
            onValueChange={selectGetterSetter[selecting].set}
            options={selectGetterSetter[selecting].options}
          />
        )}
      </Div>
    </Modal>
  );
};
export default ODSelect;
