import React, {useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {Trash, Upload} from 'react-native-feather';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Colors from 'src/constants/Colors';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Div} from './Div';
import {Img} from './Img';
import {Span} from './Span';

export default function UploadImageSlideShow({
  images,
  onPressAdd,
  onPressRemove,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      <Carousel
        data={images}
        itemWidth={DEVICE_WIDTH}
        sliderWidth={DEVICE_WIDTH}
        onSnapToItem={index => setCurrentPage(index)}
        renderItem={({item, index}) => (
          <CarouselItem
            item={item}
            index={index}
            onPressRemove={onPressRemove}
            onPressAdd={onPressAdd}
          />
        )}
      />
      <Div flex itemsCenter justifyCenter>
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

function CarouselItem({item, index, onPressAdd, onPressRemove}) {
  const handlePressRemoveImageAtIndex = () => {
    onPressRemove(index);
  };
  return (
    <Div>
      {item.uri ? (
        <Div w={DEVICE_WIDTH} h250 bgGray200 relative>
          <Img w={DEVICE_WIDTH} h250 uri={item.uri} absolute></Img>
          <Div flex itemsEnd justifyEnd>
            <Div
              auto
              onPress={handlePressRemoveImageAtIndex}
              rounded100
              bgRealBlack
              p8
              m10>
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
        <Div w={DEVICE_WIDTH} h250 bgGray200 onPress={onPressAdd}>
          <Div flex itemsCenter justifyCenter>
            <Upload width={20} height={20} color="black" strokeWidth={3} />
          </Div>
        </Div>
      )}
    </Div>
  );
}
