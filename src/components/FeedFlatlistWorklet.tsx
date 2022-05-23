import {BlurView} from '@react-native-community/blur';
import React from 'react';
import {RefreshControl} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Div} from './common/Div';
import {Row} from './common/Row';

export default function FeedFlatlistWorklet({
  refreshing,
  onRefresh,
  renderItem,
  data,
  HeaderComponent,
}) {
  const notchHeight = HAS_NOTCH ? 44 : 20;
  const headerHeight = notchHeight + 48;
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx) => {
      translationY.value = event.contentOffset.y;
    },
    onBeginDrag: (event, ctx) => {
      // @ts-ignore
      ctx.prevY = event.contentOffset.y;
    },
  });
  const notchStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: notchHeight,
      zIndex: 200,
      position: 'absolute',
      top: 0,
      opacity: Math.min(translationY.value / 50, 1),
      transform: [
        {
          translateY: 0,
        },
      ],
    };
  });
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  const topBarStyles = useAnimatedStyle(() => {
    return {
      height: headerHeight,
      zIndex: 100,
      transform: [
        {
          translateY: 0,
        },
      ],
    };
  });
  return (
    <Div flex={1} bgWhite>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        ListHeaderComponent={
          <Animated.View style={topBarStyles}>
            <Animated.View style={headerStyles}>
              <BlurView
                blurType="xlight"
                blurAmount={30}
                blurRadius={20}
                style={{
                  width: DEVICE_WIDTH,
                  height: '100%',
                  position: 'absolute',
                }}
                reducedTransparencyFallbackColor="white"></BlurView>
            </Animated.View>
            <Row
              itemsCenter
              h40
              px15
              zIndex={100}
              absolute
              w={DEVICE_WIDTH}
              top={notchHeight + 5}>
              {HeaderComponent}
            </Row>
          </Animated.View>
        }
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={data}
        renderItem={renderItem}></Animated.FlatList>
    </Div>
  );
}
