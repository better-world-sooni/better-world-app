import React, {useRef, useState} from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import EventApplication from 'src/components/common/EventApplication';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import {ChevronDown, ChevronLeft} from 'react-native-feather';
import {HAS_NOTCH} from 'src/modules/constants';
import {Colors, DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components//common/Div';
import {Row} from 'src/components//common/Row';
import {Span} from 'src/components//common/Span';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ListEmptyComponent from 'src/components//common/ListEmptyComponent';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Canvas,
  Rect,
  RadialGradient,
  Text,
  Mask,
  Group,
  Circle,
  useFont,
  vec,
  Box,
  rect,
} from '@shopify/react-native-skia';
import {
  DrawEventFeedFilter,
  DrawEventOrder,
  orderTypes,
} from './Home/StoreScreen';
import {MenuView} from '@react-native-menu/menu';
import {DrawEventMemo} from 'src/components/common/DrawEvent';

export enum EventApplicationFilter {
  APPLIED = 'applied',
  SELECTED = 'selected',
}

export default function BookmarkedDrawEventListScreen() {
  const flatlistRef = useRef(null);
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.feed.draw_event.bookmark);
  const [order, setOrder] = useState(DrawEventOrder.Recent);
  const drawEvents = data ? data.draw_events : [];
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.feed.draw_event.bookmark(data?.filter, order, page + 1),
      'draw_events',
    );
  };
  const handleRefresh = () => {
    reloadGETWithToken(apis.feed.draw_event.bookmark(data?.filter, order));
  };
  const scrollToTop = () => {
    flatlistRef?.current
      ?.getScrollResponder()
      ?.scrollTo({x: 0, y: 0, animated: true});
  };
  const handlePressFilter = filter => {
    scrollToTop();
    if (
      filter == DrawEventFeedFilter.Notice &&
      data?.filter !== DrawEventFeedFilter.Notice
    ) {
      handleMoveUnderline(filter);
      reloadGETWithToken(apis.feed.draw_event.bookmark(filter, order));
    }
    if (
      filter == DrawEventFeedFilter.Event &&
      data?.filter !== DrawEventFeedFilter.Event
    ) {
      setOrder(DrawEventOrder.Recent);
      handleMoveUnderline(filter);
      reloadGETWithToken(
        apis.feed.draw_event.bookmark(filter, DrawEventOrder.Recent),
      );
    }
  };
  const handlePressOrder = ({nativeEvent: {event}}) => {
    setOrder(event);
    reloadGETWithToken(apis.feed.draw_event.bookmark(data?.filter, event));
  };
  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 90;
  const underlineHeight = 3;
  const underlinePadding = 10;
  const underlineX = useSharedValue(underlinePadding);
  const handleMoveUnderline = filter => {
    if (filter == DrawEventFeedFilter.Notice)
      underlineX.value = withTiming(underlinePadding, {duration: 200});
    if (filter == DrawEventFeedFilter.Event)
      underlineX.value = withTiming(DEVICE_WIDTH / 2, {
        duration: 200,
      });
  };
  const underlineScale = useAnimatedStyle(() => {
    return {
      width: (DEVICE_WIDTH - 2 * underlinePadding) / 2,
      height: underlineHeight,
      transform: [
        {
          translateX: underlineX.value,
        },
      ],
    };
  });
  const numColumns =
    data?.filter == DrawEventFeedFilter.Notice
      ? 1
      : data?.filter == DrawEventFeedFilter.Event
      ? 2
      : 1;
  const paddingX = (DEVICE_WIDTH * 30) / 390;
  return (
    <>
      <Div
        flex={1}
        bg={
          data?.filter === DrawEventFeedFilter.Event ? Colors.white : '#F4F4F8'
        }>
        <Div bgWhite h={notchHeight}></Div>
        <Div
          bgWhite
          h={90}
          justifyCenter
          borderBottom={0.5}
          borderGray400
          zIndex={1000}>
          <Col>
            <Row itemsCenter py5 h40 px={8}>
              <Col itemsStart>
                <Div auto rounded100 onPress={goBack}>
                  <ChevronLeft
                    width={30}
                    height={30}
                    color={Colors.black}
                    strokeWidth={2}
                  />
                </Div>
              </Col>
              <Col auto>
                <Span bold fontSize={17}>
                  {'북마크'}
                </Span>
              </Col>
              <Col />
            </Row>
            <Col mt10 h={40} itemsCenter>
              <Row
                itemsCenter
                h={40 - underlineHeight / 2}
                px={underlinePadding}>
                <Col
                  itemsCenter
                  h={40 - underlineHeight / 2}
                  onPress={() => handlePressFilter(DrawEventFeedFilter.Notice)}>
                  <Row itemsCenter h={40 - underlineHeight / 2}>
                    <Span
                      bold
                      fontSize={17}
                      gray500={data?.filter !== DrawEventFeedFilter.Notice}>
                      {'공지'}
                    </Span>
                  </Row>
                </Col>
                <Col
                  itemsCenter
                  h={40 - underlineHeight / 2}
                  onPress={() => handlePressFilter(DrawEventFeedFilter.Event)}>
                  <Row itemsCenter h={40 - underlineHeight / 2}>
                    <Span
                      bold
                      fontSize={17}
                      gray500={data?.filter !== DrawEventFeedFilter.Event}>
                      {'이벤트'}
                    </Span>
                  </Row>
                </Col>
              </Row>
              <Row
                width={DEVICE_WIDTH}
                h={underlineHeight}
                itemsCenter
                relative>
                <Animated.View style={underlineScale}>
                  <Canvas
                    style={{
                      width: (DEVICE_WIDTH - 2 * underlinePadding) / 2,
                      height: underlineHeight,
                    }}>
                    <Mask
                      mask={
                        <Box
                          box={rect(
                            0,
                            0,
                            (DEVICE_WIDTH - 2 * underlinePadding) / 2,
                            underlineHeight,
                          )}></Box>
                      }>
                      <Rect
                        x={0}
                        y={0}
                        width={(DEVICE_WIDTH - 2 * underlinePadding) / 2}
                        height={underlineHeight}>
                        <RadialGradient
                          c={vec(0, 0)}
                          r={DEVICE_WIDTH - 2 * underlinePadding}
                          colors={['#AA37FF', '#286EFF']}
                        />
                      </Rect>
                    </Mask>
                  </Canvas>
                </Animated.View>
              </Row>
            </Col>
          </Col>
        </Div>
        <FlatList
          ref={flatlistRef}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          key={numColumns}
          keyExtractor={item => (item as any).id}
          ListHeaderComponent={
            <Div mt20>
              {data?.filter === DrawEventFeedFilter.Notice &&
                drawEvents.length != 0 && (
                  <Div px20 py5>
                    <MenuView
                      onPressAction={handlePressOrder}
                      actions={orderTypes}>
                      <Row itemsCenter onPress={() => {}}>
                        <Col auto mr2>
                          <Span bold fontSize={16}>
                            {
                              orderTypes.filter(
                                orderType => order == orderType.id,
                              )[0].title
                            }
                          </Span>
                        </Col>
                        <Col auto>
                          <ChevronDown
                            color={Colors.black}
                            height={19}
                            width={19}
                            strokeWidth={2.4}
                          />
                        </Col>
                      </Row>
                    </MenuView>
                  </Div>
                )}
            </Div>
          }
          ListEmptyComponent={
            !isLoading && (
              <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2 - 100} />
            )
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
          }
          onEndReached={handleEndReached}
          contentContainerStyle={{
            paddingRight:
              data?.filter === DrawEventFeedFilter.Event ? paddingX / 2 : 0,
            paddingLeft:
              data?.filter === DrawEventFeedFilter.Event ? paddingX / 2 : 0,
          }}
          data={drawEvents}
          renderItem={({item}) => {
            return (
              <DrawEventMemo
                drawEvent={item}
                mx={
                  data?.filter === DrawEventFeedFilter.Event ? paddingX / 2 : 0
                }
                my={8}
                summary={data?.filter === DrawEventFeedFilter.Event}
                width={
                  data?.filter === DrawEventFeedFilter.Event
                    ? (DEVICE_WIDTH - paddingX) / numColumns - paddingX
                    : DEVICE_WIDTH - 0
                }
              />
            );
          }}
          ListFooterComponent={
            <>
              {isPaginating && (
                <Div itemsCenter py15>
                  <ActivityIndicator />
                </Div>
              )}
              {isNotPaginatable && drawEvents.length != 0 && (
                <Div itemsCenter py15>
                  <Span textCenter bold>
                    모두 확인했습니다.
                  </Span>
                </Div>
              )}
              <Div h={(HAS_NOTCH ? 27 : 12) + 100} />
            </>
          }></FlatList>
      </Div>
    </>
  );
}
