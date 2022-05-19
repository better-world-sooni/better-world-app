import React, {useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Colors from 'src/constants/Colors';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Div} from './Div';
import {Img} from './Img';

export default function ImageSlideShow({imageUris}) {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <Carousel
        data={imageUris}
        itemWidth={DEVICE_WIDTH}
        sliderWidth={DEVICE_WIDTH}
        renderItem={renderItem}
        onSnapToItem={index => setCurrentPage(index)}
      />
      <Div flex={1} itemsCenter justifyCenter>
        <Pagination
          dotsLength={imageUris.length}
          activeDotIndex={currentPage}
          containerStyle={{
            paddingTop: 8,
            paddingBottom: 0,
            borderRadius: 100,
          }}
          dotStyle={{
            width: 7,
            height: 7,
            borderRadius: 5,
            marginHorizontal: -5,
          }}
          inactiveDotColor={Colors.gray[400]}
          inactiveDotScale={1}
          dotColor={Colors.primary.DEFAULT}
        />
      </Div>
    </>
  );
}

function renderItem({item, index}) {
  return (
    <Div>
      <Img
        w={DEVICE_WIDTH}
        h={(DEVICE_WIDTH * 2) / 3}
        uri={resizeImageUri(item, 500, 500)}></Img>
    </Div>
  );
}
