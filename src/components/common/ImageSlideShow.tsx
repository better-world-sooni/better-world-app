import React from 'react';
import Carousel from 'react-native-snap-carousel';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Div} from './Div';
import {Img} from './Img';

export default function ImageSlideShow({imageUris}) {
  return (
    <Carousel
      data={imageUris}
      itemWidth={DEVICE_WIDTH}
      sliderWidth={DEVICE_WIDTH}
      renderItem={renderItem}
    />
  );
}

function renderItem({item, index}) {
  return (
    <Div>
      <Img w={DEVICE_WIDTH} h400 uri={item}></Img>
    </Div>
  );
}
