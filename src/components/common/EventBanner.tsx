import React, {useState} from 'react';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoDrawEvent} from 'src/hooks/useGoto';
import {Div} from './Div';
import {Span} from './Span';
import {ImageBackground} from './ViewComponents';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import DefaultMarkdown from './DefaultMarkdown';
import apis from 'src/modules/apis';
import {useApiSelector} from 'src/redux/asyncReducer';

export default function EventBanner({source, left}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const {data} = useApiSelector(apis.eventBanner._);
  const eventBanners = [
    {
      description: '오직 홀더를 위한 공지와 이벤트\n # BetterWorld Events',
      draw_event_id: null,
      image_uri: null,
    },
  ].concat(data?.event_banners ? data?.event_banners : []);
  return (
    <ImageBackground
      source={source}
      style={{
        backgroundColor: Colors.primary.DEFAULT,
      }}
      h={(DEVICE_WIDTH * 93) / 390}
      w={DEVICE_WIDTH}
      mb12
      left={left}
      overflowHidden>
      <Div wFull h={(DEVICE_WIDTH * 93) / 390} bgBlack opacity={0.6}></Div>
      <Div
        absolute
        top0
        w={DEVICE_WIDTH}
        h={(DEVICE_WIDTH * 93) / 390}
        justifyCenter>
        <Carousel
          data={eventBanners}
          itemWidth={DEVICE_WIDTH}
          itemHeight={(DEVICE_WIDTH * 93) / 390}
          autoplay
          loop
          autoplayInterval={6000}
          sliderWidth={DEVICE_WIDTH}
          renderItem={({item, index}) => {
            return (
              <BannerComponent
                drawEventId={item?.draw_event_id}
                description={item?.description}
              />
            );
          }}
          onSnapToItem={setActiveSlide}
        />
        <Pagination
          dotsLength={eventBanners.length}
          activeDotIndex={activeSlide}
          containerStyle={{
            paddingVertical: 0,
            marginHorizontal: 0,
            paddingHorizontal: 0,
          }}
          dotStyle={{
            width: 6,
            height: 6,
            borderRadius: 6,
            marginHorizontal: -2,
            paddingHorizontal: 0,
            marginBottom: 5,
            backgroundColor: Colors.gray[100],
          }}
          dotElement={<Div w8 h8 rounded4 mx4 overflowHidden mb5 bgWhite></Div>}
          inactiveDotOpacity={0.6}
          inactiveDotScale={1}
        />
      </Div>
    </ImageBackground>
  );
}

function BannerComponent({drawEventId, description}) {
  const gotoDrawEvent =
    drawEventId &&
    useGotoDrawEvent({
      drawEventId: drawEventId,
    });
  return (
    <Div
      absolute
      top0
      w={DEVICE_WIDTH}
      h={(DEVICE_WIDTH * 93) / 390}
      px30
      py8
      onPress={drawEventId && gotoDrawEvent}
      justifyCenter>
      <Span>
        <DefaultMarkdown
          children={description}
          style={{
            color: Colors.gray[300],
            fontSize: 13,
            marginTop: -3,
          }}
        />
      </Span>
    </Div>
  );
}
