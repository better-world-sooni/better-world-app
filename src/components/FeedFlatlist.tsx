import {BlurView} from '@react-native-community/blur';
import React, {forwardRef} from 'react';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
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
import {Span} from './common/Span';
import {CustomBlurView} from 'src/components/common/CustomBlurView';

const ReanimatedFlatList = Animated.createAnimatedComponent(FlatList);

function FeedFlatlist(
  {
    refreshing,
    onRefresh,
    onEndReached = null,
    isPaginating = false,
    isNotPaginatable = false,
    renderItem,
    data,
    HeaderComponent,
  },
  ref,
) {
  const notchHeight = HAS_NOTCH ? 44 : 20;
  const headerHeight = notchHeight + 48;
  const translationY = useSharedValue(0);
  const scrollClamp = useSharedValue(0);
  const clamp = (value, lowerBound, upperBound) => {
    'worklet';
    return Math.min(Math.max(lowerBound, value), upperBound);
  };
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx) => {
      translationY.value = event.contentOffset.y;
      // @ts-ignore
      const diff = 2 * (event.contentOffset.y - ctx.prevY);
      scrollClamp.value = clamp(scrollClamp.value + diff, 0, headerHeight);
    },
    onBeginDrag: (event, ctx) => {
      // @ts-ignore
      ctx.prevY = event.contentOffset.y;
    },
  });
  const notchStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollClamp.value,
      [0, headerHeight],
      [-headerHeight, 0],
      Extrapolate.CLAMP,
    );
    return {
      width: DEVICE_WIDTH,
      height: notchHeight,
      zIndex: 200,
      position: 'absolute',
      top: 0,
      opacity: Math.min(translationY.value / 50, 1),
      transform: [
        {
          translateY: translateY,
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
    const translateY = interpolate(
      scrollClamp.value,
      [0, headerHeight],
      [0, -headerHeight],
      Extrapolate.CLAMP,
    );
    return {
      height: headerHeight,
      zIndex: 100,
      position: 'absolute',
      transform: [
        {
          translateY,
        },
      ],
    };
  });
  return (
    <Div flex={1} bgWhite>
      <Animated.View style={notchStyles}>
        <CustomBlurView
          blurType="xlight"
          blurAmount={30}
          blurRadius={20}
          style={{
            width: DEVICE_WIDTH,
            height: '100%',
            position: 'absolute',
          }}
          reducedTransparencyFallbackColor="white"></CustomBlurView>
      </Animated.View>
      <Animated.View style={topBarStyles}>
        <Animated.View style={headerStyles}>
          <CustomBlurView
            blurType="xlight"
            blurAmount={30}
            blurRadius={20}
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></CustomBlurView>
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
      <ReanimatedFlatList
        ref={ref}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          marginTop: headerHeight,
          marginBottom: headerHeight,
        }}
        keyExtractor={item => (item as any).id}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={headerHeight}
          />
        }
        ListFooterComponent={
          <>
            {isPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            {isNotPaginatable && (
              <Div itemsCenter py15>
                <Span textCenter>피드를 모두 확인했습니다.</Span>
              </Div>
            )}
            <Div h={headerHeight}></Div>
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }
        data={data}
        onEndReached={onEndReached}
        renderItem={renderItem}></ReanimatedFlatList>
    </Div>
  );
}

export default forwardRef(FeedFlatlist);