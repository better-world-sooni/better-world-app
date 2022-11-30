import React, {useState} from 'react';
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
import {ChevronLeft} from 'react-native-feather';
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

export enum EventApplicationFilter {
  APPLIED = 'applied',
  SELECTED = 'selected',
}

export default function EventApplicationListScreen() {
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.nft.eventApplication.list);
  const [filter, setFilter] = useState<EventApplicationFilter>(
    EventApplicationFilter.APPLIED,
  );
  const eventApplications = data?.event_applications || [];
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.nft.eventApplication.list(filter, page + 1),
      'event_applications',
    );
  };

  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (isLoading) return;
    reloadGetWithToken(apis.nft.eventApplication.list(filter));
  };

  const onPressFilter = pressFilter => {
    if (pressFilter != filter) {
      reloadGetWithToken(apis.nft.eventApplication.list(pressFilter));
      handleMoveUnderline(pressFilter);
      setFilter(pressFilter);
    }
  };
  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 90;
  const underlineHeight = 3;
  const underlinePadding = 10;
  const underlineX = useSharedValue(underlinePadding);
  const handleMoveUnderline = filter => {
    if (filter == EventApplicationFilter.APPLIED)
      underlineX.value = withTiming(underlinePadding, {duration: 200});
    if (filter == EventApplicationFilter.SELECTED)
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
  return (
    <>
      <Div flex={1} color={'#F5F6FC'}>
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
                  {'이벤트 참여 내역'}
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
                  onPress={() => onPressFilter(EventApplicationFilter.APPLIED)}>
                  <Row itemsCenter h={40 - underlineHeight / 2}>
                    <Span
                      bold
                      fontSize={17}
                      gray500={filter !== EventApplicationFilter.APPLIED}>
                      {'참여 완료'}
                    </Span>
                  </Row>
                </Col>
                <Col
                  itemsCenter
                  h={40 - underlineHeight / 2}
                  onPress={() =>
                    onPressFilter(EventApplicationFilter.SELECTED)
                  }>
                  <Row itemsCenter h={40 - underlineHeight / 2}>
                    <Span
                      bold
                      fontSize={17}
                      gray500={filter !== EventApplicationFilter.SELECTED}>
                      {'당첨'}
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
          showsVerticalScrollIndicator={false}
          keyExtractor={item => (item as any).id}
          ListEmptyComponent={
            !isLoading && (
              <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
            )
          }
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
          onEndReached={handleEndReached}
          data={eventApplications}
          renderItem={({item}) => {
            return <EventApplication eventApplication={item} />;
          }}
          ListFooterComponent={
            <>
              {isPaginating && (
                <Div itemsCenter py15>
                  <ActivityIndicator />
                </Div>
              )}
              <Div h={HAS_NOTCH ? 27 : 12} />
            </>
          }></FlatList>
      </Div>
    </>
  );
}
