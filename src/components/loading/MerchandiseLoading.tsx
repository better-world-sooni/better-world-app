import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ChevronLeft} from 'react-native-feather';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from '../common/Col';
import {Div} from '../common/Div';
import {Row} from '../common/Row';

export default function MerchandiseLoading({isEvent = false, hasImage = true}) {
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const {goBack} = useNavigation();
  return (
    <Div flex={1}>
      <Div h={headerHeight} zIndex={100}>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight + 5}>
          <Row itemsCenter py5 h40 px8>
            <Col itemsStart>
              <Div auto rounded100 onPress={goBack}>
                <ChevronLeft
                  width={30}
                  height={30}
                  color={Colors.black}
                  strokeWidth={2}
                />
              </Div>
            </Col>
            <Col auto></Col>
            <Col itemsEnd></Col>
          </Row>
        </Div>
      </Div>
      <Div>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item marginTop={10}>
            <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
              <SkeletonPlaceholder.Item
                width={47}
                height={47}
                borderRadius={100}
                marginRight={10}
                marginLeft={15}
              />
              <SkeletonPlaceholder.Item
                width={250}
                height={30}
                borderRadius={5}
                marginRight={15}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              marginTop={hasImage == true && isEvent == true ? 20 : 0}
              width={hasImage == true && isEvent == true ? DEVICE_WIDTH : 0}
              height={hasImage == true && isEvent == true ? DEVICE_WIDTH : 0}
            />
            <SkeletonPlaceholder.Item
              marginTop={16}
              width={270}
              height={20}
              borderRadius={5}
              marginLeft={15}
            />
            <SkeletonPlaceholder.Item
              marginTop={4}
              width={170}
              height={20}
              borderRadius={5}
              marginLeft={15}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Div>
      {hasImage == true && isEvent == false && (
        <Div mt20>
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item
              width={DEVICE_WIDTH}
              height={DEVICE_WIDTH}
            />
          </SkeletonPlaceholder>
        </Div>
      )}
    </Div>
  );
}
