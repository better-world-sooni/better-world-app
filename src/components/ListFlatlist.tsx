import {BlurView} from '@react-native-community/blur';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {ChevronLeft} from 'react-native-feather';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from './common/Col';
import {Div} from './common/Div';
import {Row} from './common/Row';
import {Span} from './common/Span';

export default function ListFlatlist({
  refreshing,
  onRefresh,
  onEndReached = null,
  isPaginating = false,
  renderItem,
  data,
  title,
  enableBack = true,
  keyExtractor = item => (item as any).id,
  HeaderRightComponent = null,
}) {
  const {goBack} = useNavigation();
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const notchHeight = HAS_NOTCH ? 44 : 0;
  const headerHeight = notchHeight + 50;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <Div flex={1} bgWhite>
      <Div h={headerHeight} zIndex={100} absolute top0>
        <Animated.View style={headerStyles}>
          <CustomBlurView
            blurType="xlight"
            blurAmount={30}
            blurRadius={20}
            overlayColor=""
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></CustomBlurView>
        </Animated.View>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight+5}>
          <Row itemsCenter py5 h40 px8>
            <Col itemsStart>
              {enableBack && (
                <Div auto rounded100 onPress={goBack}>
                  <ChevronLeft
                    width={30}
                    height={30}
                    color="black"
                    strokeWidth={2}
                  />
                </Div>
              )}
            </Col>
            <Col auto onPress={goBack}>
              <Span bold fontSize={19}>
                {title}
              </Span>
            </Col>
            <Col itemsEnd pr7={enableBack}>
              {HeaderRightComponent}
            </Col>
          </Row>
        </Div>
      </Div>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        removeClippedSubviews
        updateCellsBatchingPeriod={100}
        windowSize={11}
        contentContainerStyle={{
          marginTop: headerHeight,
          marginBottom: headerHeight,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={headerHeight}
          />
        }
        onEndReached={onEndReached}
        data={data}
        renderItem={renderItem}
        ListFooterComponent={
          <>
            {isPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            <Div h={headerHeight}></Div>
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }></Animated.FlatList>
    </Div>
  );
}
