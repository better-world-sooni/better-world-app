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
import {Archive, ChevronDown, Clock, Gift, Search} from 'react-native-feather';
import {
  useGotoEventApplicationList,
  useGotoNftCollectionSearch,
} from 'src/hooks/useGoto';
import DrawEvent from 'src/components/common/DrawEvent';
import {useNavigation} from '@react-navigation/native';
import {smallBump} from 'src/utils/hapticFeedBackUtils';
import {Img} from 'src/components/common/Img';
import {IMAGES} from 'src/modules/images';
import {ICONS} from 'src/modules/icons';
import {MenuView} from '@react-native-menu/menu';

enum DrawEventFeedFilter {
  All = 'all',
  Eligible = 'eligible',
  Following = 'following',
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
  {
    id: `${DrawEventOrder.Event}`,
    title: '이벤트',
  },
  {
    id: `${DrawEventOrder.Announcement}`,
    title: '공지',
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
  const nftCollection = nftCollectionRes?.nft_collection;
  const drawEvents = data ? data.draw_events : [];
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.feed.draw_event._(data?.filter, order, page + 1),
      'draw_events',
    );
  };
  const handleRefresh = () => {
    reloadGETWithToken(apis.feed.draw_event._(data?.filter, order));
  };
  const scrollToTop = () => {
    flatlistRef?.current
      ?.getScrollResponder()
      ?.scrollTo({x: 0, y: 0, animated: true});
  };
  const handlePressFilter = filter => {
    scrollToTop();
    if (
      filter == DrawEventFeedFilter.Eligible &&
      data?.filter !== DrawEventFeedFilter.Eligible
    ) {
      reloadGETWithToken(apis.feed.draw_event._(filter, order));
    }
    if (
      filter == DrawEventFeedFilter.Following &&
      data?.filter !== DrawEventFeedFilter.Following
    ) {
      reloadGETWithToken(apis.feed.draw_event._(filter, order));
    }
  };
  const handlePressOrder = ({nativeEvent: {event}}) => {
    // scrollToTop();
    console.log(event);
    setOrder(event);
    reloadGETWithToken(apis.feed.draw_event._(data?.filter, event));
  };
  const gotoEventApplicationList = useGotoEventApplicationList();
  const gotoNftCollectionSearch = useGotoNftCollectionSearch();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      // @ts-expect-error
      'tabDoublePress',
      e => {
        const isFocused = navigation.isFocused();
        if (isFocused) {
          if (data?.filter == DrawEventFeedFilter.Eligible) {
            reloadGETWithToken(
              apis.feed.draw_event._(DrawEventFeedFilter.Following),
            );
          } else {
            reloadGETWithToken(
              apis.feed.draw_event._(DrawEventFeedFilter.Eligible),
            );
          }
          smallBump();
        }
      },
    );
    return unsubscribe;
  }, [data?.filter]);

  return (
    <Div flex={1} bg={'#F4F4F8'}>
      <Div bgWhite h={notchHeight}></Div>
      <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40 px15>
          <Col
            auto
            h30
            w={(30 * 742) / 512}
            mr12
            itemsCenter
            justifyCenter
            onPress={() => handlePressFilter(DrawEventFeedFilter.Eligible)}>
            {data?.filter !== DrawEventFeedFilter.Eligible ? (
              <Span bold fontSize={19} gray400>
                {'MY'}
              </Span>
            ) : (
              <Img source={IMAGES.my} h30 w={(30 * 742) / 512}></Img>
            )}
          </Col>
          <Col
            auto
            h30
            w={(30 * 1624) / 512}
            mr12
            itemsCenter
            justifyCenter
            onPress={() => handlePressFilter(DrawEventFeedFilter.Following)}>
            {data?.filter !== DrawEventFeedFilter.Following ? (
              <Span bold fontSize={19} gray400>
                {'Following'}
              </Span>
            ) : (
              <Img source={IMAGES.following} h30 w={(30 * 1624) / 512}></Img>
            )}
          </Col>
          <Col />
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
        keyExtractor={item => (item as any).id}
        ListHeaderComponent={
          <Div>
            <ImageBackground
              source={{uri: nftCollection?.background_image_uri}}
              style={{
                backgroundColor: Colors.primary.DEFAULT,
              }}
              h={(DEVICE_WIDTH * 93) / 390}
              wFull
              mb12
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
            <Div px20 py5>
              <MenuView onPressAction={handlePressOrder} actions={orderTypes}>
                <Row itemsCenter onPress={() => {}}>
                  <Col auto mr2>
                    <Span bold fontSize={16}>
                      {
                        orderTypes.filter(orderType => order == orderType.id)[0]
                          .title
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
        data={drawEvents}
        renderItem={({item}) => {
          return (
            <DrawEvent
              key={`${(item as any).id}-${
                (item as any).event_application?.status
              }-${(item as any).status}-${(item as any).read_count}`}
              drawEvent={item}
              mx={20}
              my={10}
              width={DEVICE_WIDTH - 20 * 2}
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
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }></FlatList>
    </Div>
  );
}
