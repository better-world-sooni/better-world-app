import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ChevronLeft} from 'react-native-feather';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from '../common/Col';
import {Div} from '../common/Div';
import {Row} from '../common/Row';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PostLoading() {
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const {goBack} = useNavigation();
  return (
    <Div flex={1}>
      <Div h={headerHeight} zIndex={100}>
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
      <Div px15>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={47}
              height={47}
              borderRadius={100}
            />
            <SkeletonPlaceholder.Item marginLeft={10}>
              <SkeletonPlaceholder.Item
                width={120}
                height={15}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                marginTop={5}
                width={80}
                height={15}
                borderRadius={5}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Div>
      <Div pl73 pr15>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item marginTop={10}>
            <SkeletonPlaceholder.Item
              width={250}
              height={15}
              borderRadius={5}
            />
            <SkeletonPlaceholder.Item
              marginTop={5}
              width={170}
              height={15}
              borderRadius={5}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Div>
      <Div pl73 pr15 mt10>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={DEVICE_WIDTH - 88}
              height={150}
              borderRadius={10}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Div>
    </Div>
  );
}
