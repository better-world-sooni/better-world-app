import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {Trash, Upload} from 'react-native-feather';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Colors} from 'src/modules/styles';
import {getAdjustedHeightFromDimensions} from 'src/utils/imageUtils';
import Video from 'react-native-video';
import {Div} from './Div';
import {Img} from './Img';

export default function UploadImageSlideShow({
  images,
  onPressAdd,
  onPressRemove,
  sliderWidth,
  disablePagination = false,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const imageHeight =
    images[0]?.uri && images[0].width && images[0].height
      ? getAdjustedHeightFromDimensions({
          width: images[0].width,
          height: images[0].height,
          frameWidth: sliderWidth,
        })
      : sliderWidth * 0.7;
  return (
    <>
      <Div rounded10 border={0.5} borderGray200 overflowHidden>
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
      {!disablePagination && (
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
      )}
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
          {item.type.startsWith('video') ? (
            <Video
              source={{uri: item.uri}}
              repeat
              muted
              style={{
                width: sliderWidth,
                height: imageHeight,
                position: 'absolute',
              }}
            />
          ) : (
            <Img w={sliderWidth} h={imageHeight} uri={item.uri} absolute></Img>
          )}
          <Div flex={1} itemsEnd justifyStart>
            <Div
              auto
              onPress={handlePressRemoveImageAtIndex}
              rounded100
              bgBlack
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
            <Upload
              width={20}
              height={20}
              color={Colors.black}
              strokeWidth={2}
            />
          </Div>
        </Div>
      )}
    </Div>
  );
}
