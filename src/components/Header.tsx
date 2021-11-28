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
}) => {
  const {
    feed: {globalFiter},
    route: {selectedTrain},
  } = useSelector((root: RootState) => root, shallowEqual);
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  const goToPost = () => navigation.navigate(NAV_NAMES.Post);
  const goToReport = () => {
    if (selectedTrain) {
      navigation.navigate(NAV_NAMES.Report);
    } else {
      Alert.alert('탑승하신 열차를 먼저 선택해 주세요.');
    }
  };
  const goToNotification = () => navigation.navigate(NAV_NAMES.Notification);

  return (
    <>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} bg={bg} />
      <Row itemsCenter py10 pr20 bg={bg}>
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
        {!noButtons && (
          <Col auto pl15 onPress={goToReport}>
            <AlertCircle {...iconSettings} color={'red'}></AlertCircle>
          </Col>
        )}
        {!noButtons && (
          <Col auto pl15 onPress={goToPost}>
            <PlusSquare {...iconSettings} color={'black'}></PlusSquare>
          </Col>
        )}
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
