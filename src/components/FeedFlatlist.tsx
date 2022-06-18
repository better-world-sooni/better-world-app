import {BlurView} from '@react-native-community/blur';
import React, {forwardRef} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, Platform, StatusBar} from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Plus} from 'react-native-feather';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {PostOwnerType} from 'src/screens/NewPostScreen';

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
    TopComponent,
    HeaderComponent = null,
    enableAdd = false,
  },
  ref,
) {
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
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
      translationY.value > 200 ? scrollClamp.value : 0,
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
      top: 0,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  const topBarStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      translationY.value > 200 ? scrollClamp.value : 0,
      [0, headerHeight],
      [0, -headerHeight],
      Extrapolate.CLAMP,
    );
    return {
      top: 0,
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
    <Div flex={1} bgWhite relative>
      <Animated.View style={notchStyles}>
        <CustomBlurView
          blurType="xlight"
          blurAmount={30}
          blurRadius={25}
          overlayColor=""
          style={{
            width: DEVICE_WIDTH,
            height: notchHeight,
            position: 'absolute',
          }}
          reducedTransparencyFallbackColor="white"></CustomBlurView>
      </Animated.View>
      <Animated.View style={topBarStyles}>
        <Animated.View style={headerStyles}>
          {Platform.OS === 'ios' ? (
            <CustomBlurView
              blurType="xlight"
              blurAmount={30}
              blurRadius={25}
              overlayColor=""
              style={{
                width: DEVICE_WIDTH,
                top: 0,
                height: headerHeight,
                position: 'absolute',
              }}
              reducedTransparencyFallbackColor="white"></CustomBlurView>
          ) : (
            <Div
              style={{
                width: DEVICE_WIDTH,
                top: 0,
                height: headerHeight,
                position: 'absolute',
              }}
              bgWhite
            />
          )}
        </Animated.View>
        <Row
          itemsCenter
          h40
          px15
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={notchHeight + 5}>
          {TopComponent}
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
            <Div h={27} />
          </>
        }
        ListHeaderComponent={HeaderComponent}
        data={data}
        onEndReached={onEndReached}
        renderItem={renderItem}></ReanimatedFlatList>
      {enableAdd && (
        <Div
          rounded100
          bgPrimary
          absolute
          w54
          h54
          p12
          bottom15
          right15
          onPress={() => gotoNewPost()}
          style={{
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
          }}>
          <Plus strokeWidth={1.7} color={'white'} height={30} width={30}></Plus>
        </Div>
      )}
    </Div>
  );
}

export default forwardRef(FeedFlatlist);