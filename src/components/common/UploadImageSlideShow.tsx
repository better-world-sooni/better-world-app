import React from 'react';
import {ActivityIndicator} from 'react-native';
import {Upload} from 'react-native-feather';
import Carousel from 'react-native-snap-carousel';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Div} from './Div';
import {Img} from './Img';
import {Span} from './Span';

export default function UploadImageSlideShow({
  images,
  onPressAdd,
  onPressRemove,
}) {
  return (
    <Carousel
      data={images}
      itemWidth={DEVICE_WIDTH}
      sliderWidth={DEVICE_WIDTH}
      renderItem={({item, index}) => (
        <CarouselItem
          item={item}
          index={index}
          onPressRemove={onPressRemove}
          onPressAdd={onPressAdd}
        />
      )}
    />
  );
}

function CarouselItem({item, index, onPressAdd, onPressRemove}) {
  const handlePressRemoveImageAtIndex = () => {
    onPressRemove(index);
  };
  return (
    <Div>
      {item.uri ? (
        <Div w={DEVICE_WIDTH} h250 bgGray200 relative>
          <Img w={DEVICE_WIDTH} h250 uri={item.uri} absolute></Img>
          <Div flex itemsEnd justifyEnd mb90>
            <Div
              auto
              mr10
              onPress={handlePressRemoveImageAtIndex}
              rounded100
              bgBlack
              p8>
              {item.loading ? (
                <ActivityIndicator></ActivityIndicator>
              ) : (
                <Span fontSize={16} danger bold>
                  제거
                </Span>
              )}
            </Div>
          </Div>
        </Div>
      ) : (
        <Div w={DEVICE_WIDTH} h250 bgGray200 onPress={onPressAdd}>
          <Div flex itemsCenter pt75>
            <Upload width={20} height={20} color="black" strokeWidth={3} />
          </Div>
        </Div>
      )}
    </Div>
  );
}
