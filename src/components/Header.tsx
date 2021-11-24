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

export const Header = ({bg, onSelect = null, noFilter = null}) => {
  const {
    feed: {globalFiter},
  } = useSelector((root: RootState) => root, shallowEqual);
  const navigation = useNavigation();
  const goToPost = () => navigation.navigate(NAV_NAMES.Post);

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
        <Col itemsCenter justifyCenter></Col>
      )}
      <Col></Col>
      <Col auto pl15>
        <AlertCircle {...iconSettings} color={'red'}></AlertCircle>
      </Col>
      <Col auto pl15>
        <PlusSquare {...iconSettings} color={'black'}></PlusSquare>
      </Col>
      <Col auto pl15>
        <Bell {...iconSettings} color={'black'}></Bell>
      </Col>
    </Row>
  );
};
