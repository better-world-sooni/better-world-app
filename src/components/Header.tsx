import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/core';
import {
  AlertCircle,
  Bell,
  ChevronDown,
  ChevronLeft,
  PlusSquare,
} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {
  chevronDownSettings,
  GO_COLOR,
  GRAY_COLOR,
  HAS_NOTCH,
  iconSettings,
} from 'src/modules/constants';
import {NAV_NAMES} from 'src/modules/navNames';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';
import {Alert, StatusBar} from 'react-native';
import {Div} from './common/Div';

export const Header = ({
  bg,
  onSelect = null,
  headerTitle = null,
  noButtons = false,
  hasGoBack = false,
  onFinish = null,
  onFinishText = '',
  borderBottom = false,
}) => {
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  const goToNotification = () => navigation.navigate(NAV_NAMES.Notification);
  const borderBottomProps = borderBottom
    ? {borderBottomColor: GRAY_COLOR, borderBottomWidth: 0.2}
    : {};

  return (
    <>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} bg={bg} />
      <Row itemsCenter py10 pr20 bg={bg} {...borderBottomProps}>
        {hasGoBack ? (
          <Col auto pr10 onPress={goBack} pl10>
            <ChevronLeft {...iconSettings}></ChevronLeft>
          </Col>
        ) : (
          <Col auto w20 />
        )}
        {onSelect ? (
          <Col justifyCenter onPress={() => onSelect()}>
            <Row itemsCenter>
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
        {!noButtons && (
          <Col auto pl15 onPress={goToNotification}>
            <Bell {...iconSettings} color={'black'}></Bell>
          </Col>
        )}
        {onFinish && (
          <Col auto pl15 onPress={onFinish}>
            <Span medium color={GO_COLOR}>
              {onFinishText}
            </Span>
          </Col>
        )}
      </Row>
    </>
  );
};
