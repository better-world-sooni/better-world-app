import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {Trash, Upload} from 'react-native-feather';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Colors} from 'src/modules/styles';
import {getAdjustedHeightFromDimensions} from 'src/utils/imageUtils';
import {Div} from './Div';
import {Img} from './Img';

export default function ImageCarousel({
  images,
  sliderWidth,
  sliderHeight = null,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const imageHeight =
    sliderHeight ||
    (images[0]?.uri && images[0].width && images[0].height
      ? getAdjustedHeightFromDimensions({
          width: images[0].width,
          height: images[0].height,
          frameWidth: sliderWidth,
        })
      : sliderWidth * 0.7);
  return (
    <>
      <Div borderGray200 overflowHidden>
        <Carousel
          data={images}
          itemWidth={sliderWidth}
          sliderWidth={sliderWidth}
          onSnapToItem={index => setCurrentPage(index)}
          renderItem={({item, index}) => (
            <CarouselItem
              item={item}
              index={index}
              sliderWidth={sliderWidth}
              imageHeight={imageHeight}
            />
          )}
        />
      </Div>
      <Div flex={1} itemsCenter justifyCenter>
        <Pagination
          dotsLength={images.length}
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
          dotColor={Colors.black}
        />
      </Div>
    </>
  );
}

function CarouselItem({item, index, sliderWidth, imageHeight}) {
  return (
    <Div>
      <Div w={sliderWidth} h={imageHeight} bgGray200 relative>
        <Img w={sliderWidth} h={imageHeight} uri={item} absolute></Img>
      </Div>
    </Div>
  );
}
