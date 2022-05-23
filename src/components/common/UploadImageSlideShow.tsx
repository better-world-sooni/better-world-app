import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {Trash, Upload} from 'react-native-feather';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Colors from 'src/constants/Colors';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Div} from './Div';
import {Img} from './Img';

export default function UploadImageSlideShow({
  images,
  onPressAdd,
  onPressRemove,
  sliderWidth,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const imageHeight =
    images[0]?.uri && images[0].width && images[0].height
      ? (images[0].height / images[0].width) * sliderWidth
      : sliderWidth;
  return (
    <>
      <Div rounded10 overflowHidden>
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
              onPressRemove={onPressRemove}
              onPressAdd={onPressAdd}
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
          dotColor={Colors.primary.DEFAULT}
        />
      </Div>
    </>
  );
}

function CarouselItem({
  item,
  index,
  onPressAdd,
  onPressRemove,
  sliderWidth,
  imageHeight,
}) {
  const handlePressRemoveImageAtIndex = () => {
    onPressRemove(index);
  };
  return (
    <Div>
      {item.uri ? (
        <Div w={sliderWidth} h={imageHeight} bgGray200 relative>
          <Img w={sliderWidth} h={imageHeight} uri={item.uri} absolute></Img>
          <Div flex={1} itemsEnd justifyEnd>
            <Div
              auto
              onPress={handlePressRemoveImageAtIndex}
              rounded100
              bgRealBlack
              p8
              mx20
              my10>
              {item.loading ? (
                <ActivityIndicator></ActivityIndicator>
              ) : (
                <Trash
                  strokeWidth={2}
                  color={Colors.danger.DEFAULT}
                  height={18}
                  width={18}
                />
              )}
            </Div>
          </Div>
        </Div>
      ) : (
        <Div w={sliderWidth} h={imageHeight} bgGray200 onPress={onPressAdd}>
          <Div flex={1} itemsCenter justifyCenter>
            <Upload width={20} height={20} color="black" strokeWidth={2} />
          </Div>
        </Div>
      )}
    </Div>
  );
}
