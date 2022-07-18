import React, {useRef, useState} from 'react';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {Colors} from 'src/modules/styles';
import {Div} from './Div';
import {Img} from './Img';
import Video from 'react-native-video';
import {lookup} from 'react-native-mime-types';

export default function ImageSlideShow({
  imageUris,
  sliderHeight,
  sliderWidth,
  roundedTopOnly = false,
  enablePagination = true,
  borderRadius = 10,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <Div
        rounded={!roundedTopOnly && borderRadius}
        borderBottomRight={borderRadius}
        borderBottomLeft={borderRadius}
        border={0.5}
        borderGray200
        overflowHidden>
        <Carousel
          data={imageUris}
          itemWidth={sliderWidth}
          sliderWidth={sliderWidth}
          enableMomentum={true}
          decelerationRate={0.5}
          renderItem={({item}) => {
            if (
              typeof lookup(item) == 'string' &&
              lookup(item).startsWith('video')
            ) {
              return (
                <VideoItem
                  url={item}
                  width={sliderWidth}
                  height={sliderHeight}
                />
              );
            }
            return (
              <ImageItem url={item} width={sliderWidth} height={sliderHeight} />
            );
          }}
          onSnapToItem={index => setCurrentPage(index)}
        />
      </Div>
      {enablePagination && (
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
      )}
    </>
  );
}

function ImageItem({url, width, height}) {
  return (
    <Div>
      <Img w={width} h={height} uri={url}></Img>
    </Div>
  );
}

function VideoItem({url, width, height}) {
  const ref = useRef(null);
  const handlePress = () => {
    ref?.current?.presentFullscreenPlayer();
  };
  return (
    <Div onPress={handlePress}>
      <Video
        ref={ref}
        source={{uri: url}}
        style={{width, height}}
        muted
        repeat
      />
    </Div>
  );
}
