import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ChevronLeft} from 'react-native-feather';
import {useGotoHome} from 'src/hooks/useGoto';
import {HAS_NOTCH} from 'src/modules/constants';
import {IMAGES} from 'src/modules/images';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from '../common/Col';
import {Div} from '../common/Div';
import {Img} from '../common/Img';
import {Row} from '../common/Row';
import {Span} from '../common/Span';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotFound({text}) {
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const {goBack} = useNavigation();
  const gotoHome = useGotoHome();
  return (
    <Div flex={1} itemsCenter justifyCenter>
      <Div h={headerHeight} absolute top0 zIndex={100} w={DEVICE_WIDTH}>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight+5}>
          <Row itemsCenter py5 h40 px8>
            <Col itemsStart>
              <Div auto rounded100 onPress={goBack}>
                <ChevronLeft
                  width={30}
                  height={30}
                  color="black"
                  strokeWidth={2}
                />
              </Div>
            </Col>
            <Col auto></Col>
            <Col itemsEnd></Col>
          </Row>
        </Div>
      </Div>
      <Div itemsCenter>
        <Img w134 h134 source={IMAGES.betterWorldBlueLogo} />
        <Span bold primary fontSize={14}>
          {text}
        </Span>
        <Div
          h48
          my15
          bgPrimary
          rounded10
          itemsCenter
          justifyCenter
          px20
          onPress={gotoHome}>
          <Span bold white fontSize={18}>
            홈으로 가기
          </Span>
        </Div>
      </Div>
    </Div>
  );
}
