import React, {useEffect, useRef, useState} from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {Colors, DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Col} from 'src/components/common/Col';
import {Row} from 'src/components/common/Row';
import {FlatList, ImageBackground} from 'src/components/common/ViewComponents';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {HAS_NOTCH} from 'src/modules/constants';
import {
  Archive,
  Bookmark,
  ChevronDown,
  Clock,
  Gift,
  Search,
} from 'react-native-feather';
import {
  useGotoEventApplicationList,
  useGotoNftCollectionSearch,
} from 'src/hooks/useGoto';
import {DrawEventMemo} from 'src/components/common/DrawEvent';
import {useNavigation} from '@react-navigation/native';
import {smallBump} from 'src/utils/hapticFeedBackUtils';
import {Img} from 'src/components/common/Img';
import {IMAGES} from 'src/modules/images';
import {ICONS} from 'src/modules/icons';
import {MenuView} from '@react-native-menu/menu';

enum DrawEventFeedFilter {
  All = 'all',
  Notice = 'notice',
  Event = 'event',
}

enum DrawEventOrder {
  Recent = 'recent',
  Popular = 'popular',
  Event = 'event',
  Announcement = 'announcement',
}

const orderTypes = [
  {
    id: `${DrawEventOrder.Popular}`,
    title: '인기 순',
  },
  {
    id: `${DrawEventOrder.Recent}`,
    title: '최신 순',
  },
];

export default function StoreScreen() {
  const flatlistRef = useRef(null);
  const navigation = useNavigation();
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.feed.draw_event._);
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection._(),
  );
  const [order, setOrder] = useState(DrawEventOrder.Recent);
  const [bookmarked, setBookmarked] = useState(false);
  const nftCollection = nftCollectionRes?.nft_collection;
  const drawEvents = data ? data.draw_events : [];
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.feed.draw_event._(data?.filter, bookmarked, order, page + 1),
      'draw_events',
    );
  };
  const handleRefresh = () => {
    reloadGETWithToken(apis.feed.draw_event._(data?.filter, bookmarked, order));
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
      reloadGETWithToken(apis.feed.draw_event._(filter, bookmarked, order));
    }
    if (
      filter == DrawEventFeedFilter.Event &&
      data?.filter !== DrawEventFeedFilter.Event
    ) {
      setOrder(DrawEventOrder.Recent);
      reloadGETWithToken(
        apis.feed.draw_event._(filter, bookmarked, DrawEventOrder.Recent),
      );
    }
  };
  const handlePressOrder = ({nativeEvent: {event}}) => {
    // scrollToTop();
    // console.log(event);
    setOrder(event);
    reloadGETWithToken(apis.feed.draw_event._(data?.filter, bookmarked, event));
  };
  const handlePressBookmark = () => {
    setBookmarked(prev => !prev);
    reloadGETWithToken(
      apis.feed.draw_event._(data?.filter, !bookmarked, order),
    );
  };
  const gotoEventApplicationList = useGotoEventApplicationList();
  const gotoNftCollectionSearch = useGotoNftCollectionSearch();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const numColumns = 2;
  const paddingX = (DEVICE_WIDTH * 30) / 390;

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      // @ts-expect-error
      'tabDoublePress',
      e => {
        const isFocused = navigation.isFocused();
        if (isFocused) {
          if (data?.filter == DrawEventFeedFilter.Notice) {
            reloadGETWithToken(
              apis.feed.draw_event._(DrawEventFeedFilter.Event),
            );
          } else {
            reloadGETWithToken(
              apis.feed.draw_event._(DrawEventFeedFilter.Notice),
            );
          }
          smallBump();
        }
      },
    );
    return unsubscribe;
  }, [data?.filter]);
  const actionIconDefaultProps = {
    strokeWidth: 2,
    color: Colors.black,
    height: 22,
    width: 22,
  };
  const bookmarkProps = bookmarked
    ? {
        fill: Colors.blue.DEFAULT,
        width: 22,
        height: 22,
        color: Colors.blue.DEFAULT,
        strokeWidth: 2,
      }
    : actionIconDefaultProps;
  return (
    <Div
      flex={1}
      bg={
        data?.filter === DrawEventFeedFilter.Event ? Colors.white : '#F4F4F8'
      }>
      <Div bgWhite h={notchHeight}></Div>
      <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40 px15>
          <Col
            auto
            h30
            w={(30 * 239) / 158}
            mr12
            itemsCenter
            justifyCenter
            onPress={() => handlePressFilter(DrawEventFeedFilter.Notice)}>
            {data?.filter !== DrawEventFeedFilter.Notice ? (
              <Span bold fontSize={19} gray400>
                {'공지'}
              </Span>
            ) : (
              <Img
                source={IMAGES.notificationText}
                h22
                w={(22 * 239) / 158}></Img>
            )}
          </Col>
          <Col
            auto
            h30
            w={(30 * 355) / 158}
            mr12
            itemsCenter
            justifyCenter
            onPress={() => handlePressFilter(DrawEventFeedFilter.Event)}>
            {data?.filter !== DrawEventFeedFilter.Event ? (
              <Span bold fontSize={19} gray400>
                {'이벤트'}
              </Span>
            ) : (
              <Img source={IMAGES.eventText} h22 w={(22 * 355) / 158}></Img>
            )}
          </Col>
          <Col />
          <Col auto onPress={handlePressBookmark} pl18>
            <Bookmark {...bookmarkProps} />
          </Col>
          <Col auto onPress={gotoNftCollectionSearch} pl18>
            <Search
              strokeWidth={2}
              color={Colors.black}
              height={22}
              width={22}
            />
          </Col>
          <Col auto onPress={gotoEventApplicationList} pl18>
            <Img source={ICONS.list} h={22} w={(22 * 81) / 96} />
          </Col>
        </Row>
      </Div>
      <FlatList
        ref={flatlistRef}
        showsVerticalScrollIndicator={false}
        numColumns={numColumns}
        keyExtractor={item => (item as any).id}
        ListHeaderComponent={
          <Div>
            <ImageBackground
              source={{uri: nftCollection?.background_image_uri}}
              style={{
                backgroundColor: Colors.primary.DEFAULT,
              }}
              h={(DEVICE_WIDTH * 93) / 390}
              w={DEVICE_WIDTH}
              mb12
              left={
                data?.filter === DrawEventFeedFilter.Event ? -paddingX / 2 : 0
              }
              overflowHidden>
              <Div
                wFull
                h={(DEVICE_WIDTH * 93) / 390}
                bgBlack
                opacity={0.6}></Div>
              <Div
                absolute
                top0
                wFull
                h={(DEVICE_WIDTH * 93) / 390}
                px30
                py8
                justifyCenter>
                <Span white gray400 fontSize={12}>
                  오직 홀더를 위한 공지와 이벤트
                </Span>
                <Span white bold mt4>
                  BetterWorld Events
                </Span>
              </Div>
            </ImageBackground>
            {data?.filter === DrawEventFeedFilter.Notice && (
              <Div px20 py5>
                <MenuView onPressAction={handlePressOrder} actions={orderTypes}>
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
              key={`${(item as any).id}-${
                (item as any).event_application?.status
              }-${(item as any).status}-${(item as any).read_count}`}
              drawEvent={item}
              mx={data?.filter === DrawEventFeedFilter.Event ? paddingX / 2 : 0}
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
            {isNotPaginatable && (
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
  );
}
