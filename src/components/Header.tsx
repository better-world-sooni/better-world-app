import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {AlertCircle, Bell, ChevronDown, PlusSquare} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {
  chevronDownSettings,
  GRAY_COLOR,
  iconSettings,
  LINE2_COLOR,
  LINE2_COLOR_LIGHT,
} from 'src/modules/constants';
import {NAV_NAMES} from 'src/modules/navNames';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {Alert} from 'react-native';

export const Header = ({bg, onSelect = null, headerTitle = null}) => {
  const {
    feed: {globalFiter},
    route: {selectedTrain},
  } = useSelector((root: RootState) => root, shallowEqual);
  const navigation = useNavigation();
  const goToPost = () => navigation.navigate(NAV_NAMES.Post);
  const goToReport = () => {
    if (selectedTrain) {
      navigation.navigate(NAV_NAMES.Report);
    } else {
      Alert.alert('탑승하신 열차를 먼저 선택해 주세요.');
    }
  };

  return (
    <Row itemsCenter py10 px20 bg={bg}>
      {onSelect ? (
        <Col justifyCenter onPress={() => onSelect()}>
          <Row itemsCenter>
            <Col itemsCenter auto pr5>
              <Span
                bold
                textCenter
                color={'black'}
                fontSize={20}
                numberOfLines={1}
                ellipsizeMode="head">
                {globalFiter.split('(')[0]}
              </Span>
            </Col>
            <Col auto justifyCenter>
              <ChevronDown {...chevronDownSettings}></ChevronDown>
            </Col>
          </Row>
        </Col>
      ) : (
        <Col justifyCenter>
          <Row itemsCenter>
            <Col itemsCenter auto pr5>
              <Span
                bold
                textCenter
                color={'black'}
                fontSize={20}
                numberOfLines={1}
                ellipsizeMode="head">
                {headerTitle}
              </Span>
            </Col>
          </Row>
        </Col>
      )}
      <Col></Col>
      <Col auto pl15 onPress={goToReport}>
        <AlertCircle {...iconSettings} color={'red'}></AlertCircle>
      </Col>
      <Col auto pl15 onPress={goToPost}>
        <PlusSquare {...iconSettings} color={'black'}></PlusSquare>
      </Col>
      {/* <Col auto pl15>
        <Bell {...iconSettings} color={'black'}></Bell>
      </Col> */}
    </Row>
  );
};
