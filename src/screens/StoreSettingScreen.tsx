import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ChevronLeft, ChevronRight, X} from 'react-native-feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Row} from 'src/components/common/Row';
import {Span} from 'src/components/common/Span';
import {ScrollView} from 'src/components/common/ViewComponents';
import {
  useGotoCollectionEventApplicationList,
  useGotoNewAnnouncement,
  useGotoNewDrawEvent,
} from 'src/hooks/useGoto';
import {Colors} from 'src/modules/styles';

export default function StoreSettingScreen() {
  const notchHeight = useSafeAreaInsets().top;
  const {goBack} = useNavigation();
  const gotoNewDrawEvent = useGotoNewDrawEvent();
  const gotoCollectionEventApplicationList =
    useGotoCollectionEventApplicationList();
  const gotoNewAnnouncement = useGotoNewAnnouncement();
  return (
    <Div bgWhite flex={1}>
      <Div h={notchHeight}></Div>
      <Div px8 h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter zIndex={100}>
          <Col itemsStart onPress={goBack}>
            <ChevronLeft
              width={30}
              height={30}
              color={Colors.black}
              strokeWidth={2}
            />
          </Col>
          <Col auto>
            <Span bold fontSize={17}>
              이벤트 관리
            </Span>
          </Col>
          <Col itemsEnd></Col>
        </Row>
      </Div>
      <ScrollView bounces={false}>
        <Row
          py20
          px15
          borderBottom={0.5}
          borderGray200
          itemsCenter
          onPress={gotoCollectionEventApplicationList}>
          <Col>
            <Span fontSize={16} bold>
              응모 관리
            </Span>
          </Col>
          <Col auto>
            <ChevronRight
              width={22}
              height={22}
              color={Colors.black}
              strokeWidth={2}
            />
          </Col>
        </Row>
        <Row
          py20
          px15
          borderBottom={0.5}
          borderGray200
          itemsCenter
          onPress={gotoNewDrawEvent}>
          <Col>
            <Span fontSize={16} bold>
              이벤트 추가
            </Span>
          </Col>
          <Col auto>
            <ChevronRight
              width={22}
              height={22}
              color={Colors.black}
              strokeWidth={2}
            />
          </Col>
        </Row>
        <Row
          py20
          px15
          borderBottom={0.5}
          borderGray200
          itemsCenter
          onPress={gotoNewAnnouncement}>
          <Col>
            <Span fontSize={16} bold>
              공지 추가
            </Span>
          </Col>
          <Col auto>
            <ChevronRight
              width={22}
              height={22}
              color={Colors.black}
              strokeWidth={2}
            />
          </Col>
        </Row>
        <Div h={50}></Div>
      </ScrollView>
    </Div>
  );
}
