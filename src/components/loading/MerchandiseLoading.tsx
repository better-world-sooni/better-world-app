import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Div} from '../common/Div';

export default function MerchandiseLoading() {
  return (
    <Div flex={1}>
      <Div>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item
            width={DEVICE_WIDTH}
            height={DEVICE_WIDTH}
          />
        </SkeletonPlaceholder>
      </Div>
      <Div px15>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item marginTop={10}>
            <SkeletonPlaceholder.Item
              width={250}
              height={30}
              borderRadius={5}
            />
            <SkeletonPlaceholder.Item
              marginTop={4}
              width={170}
              height={20}
              borderRadius={5}
            />
            <SkeletonPlaceholder.Item
              marginTop={16}
              width={170}
              height={20}
              borderRadius={5}
            />
            <SkeletonPlaceholder.Item
              marginTop={12}
              width={DEVICE_WIDTH}
              height={0.5}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Div>
      <Div px15 mt12>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
            <SkeletonPlaceholder.Item
              width={80}
              height={30}
              borderRadius={10}
              marginRight={8}
            />
            <SkeletonPlaceholder.Item
              width={80}
              height={30}
              borderRadius={10}
              marginRight={8}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </Div>
    </Div>
  );
}
