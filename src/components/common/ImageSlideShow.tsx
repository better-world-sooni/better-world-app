import React, {useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Colors from 'src/constants/Colors';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {resizeImageUri} from 'src/modules/uriUtils';
import {Div} from './Div';
import {Img} from './Img';

export default function ImageSlideShow({imageUris, sliderHeight, sliderWidth}) {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <Div rounded10 overflowHidden>
        <Carousel
          data={imageUris}
          itemWidth={sliderWidth}
          sliderWidth={sliderWidth}
          renderItem={({item}) => (
            <ImageItem url={item} width={sliderWidth} height={sliderHeight} />
          )}
          onSnapToItem={index => setCurrentPage(index)}
        />
      </Div>
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

function ImageItem({url, width, height}) {
  return (
    <Div>
      <Img w={width} h={height} uri={resizeImageUri(url, 500, 500)}></Img>
    </Div>
  );
}
