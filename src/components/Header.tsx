import React from 'react';
import {useNavigation} from '@react-navigation/core';
import {AlertCircle, ChevronDown, PlusSquare} from 'react-native-feather';
import {shallowEqual, useSelector} from 'react-redux';
import {chevronDownSettings, iconSettings} from 'src/modules/constants';
import {NAV_NAMES} from 'src/modules/navNames';
import {RootState} from 'src/redux/rootReducer';
import {Col} from './common/Col';
import {Row} from './common/Row';
import {Span} from './common/Span';

export const Header = ({bg, onSelect}) => {
  const navigation = useNavigation();
  const goToPost = () => navigation.navigate(NAV_NAMES.Post);
  const goToReport = () => navigation.navigate(NAV_NAMES.Report);
  const {
    route: {selectedTrain},
    feed: {globalFiter},
  } = useSelector((root: RootState) => root, shallowEqual);
  return (
    <Row itemsCenter py10 px20 bg={bg}>
      <Col w80 auto>
        <Row justifyCenter>
          <Col justifyCenter>
            <Span>{selectedTrain ? selectedTrain.statnNm : '탑승전'}</Span>
          </Col>
          <Col></Col>
        </Row>
      </Col>
      <Col itemsCenter justifyCenter onPress={() => onSelect()}>
        <Row itemsCenter>
          <Col itemsCenter auto>
            <Span
              bold
              textCenter
              color={'black'}
              fontSize={15}
              numberOfLines={1}
              ellipsizeMode="head">
              {globalFiter}
            </Span>
          </Col>
          <Col auto justifyCenter>
            <ChevronDown {...chevronDownSettings}></ChevronDown>
          </Col>
        </Row>
      </Col>
      <Col w80 itemsEnd auto>
        <Row itemsEnd>
          <Col onPress={goToReport} itemsEnd>
            <AlertCircle {...iconSettings} color={'red'}></AlertCircle>
          </Col>
          <Col onPress={goToPost} itemsEnd>
            <PlusSquare {...iconSettings} color={'black'}></PlusSquare>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
