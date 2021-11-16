import React, {useCallback} from 'react';
import {Alert} from 'react-native';
import {ChevronDown, RefreshCw} from 'react-native-feather';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {chevronDownSettings} from 'src/modules/constants';
import {RootState} from 'src/redux/rootReducer';
import {exchangeOriginDestination} from 'src/redux/routeReducer';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';

const OD = ({handleSelectOrigin, handleSelectDestination}) => {
  const {
    route: {origin, destination},
  } = useSelector((root: RootState) => root.route, shallowEqual);
  const dispatch = useDispatch();
  const exchangeOD = useCallback(() => {
    if (origin && destination) {
      dispatch(exchangeOriginDestination());
    } else {
      Alert.alert('출발지와 도착지를 먼저 설정해주세요.');
    }
  }, [origin, destination]);
  return (
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
  );
};

export default OD;
