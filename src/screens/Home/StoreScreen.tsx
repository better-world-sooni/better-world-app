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
  useGotoBookmarkedDrawEventListScreen,
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
import GradientTextUnderline from 'src/components/common/GradientTextUnderline';
import EventBanner from 'src/components/common/EventBanner';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from 'src/components/common/MyNftCollectionMenu';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

export enum DrawEventFeedFilter {
  All = 'all',
  Notice = 'notice',
  Event = 'event',
}

export enum DrawEventOrder {
  Recent = 'recent',
  Popular = 'popular',
  Event = 'event',
  Announcement = 'announcement',
}

export const orderTypes = [
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
  const nftCollection = nftCollectionRes?.nft_collection;
  const [order, setOrder] = useState(DrawEventOrder.Recent);
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
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const sideMenuRef = useRef(null);
  const openSideMenu = () =>
    currentNft?.privilege && sideMenuRef?.current?.openMenu(true);
  const handleRefresh = () => {
    reloadGETWithToken(apis.feed.draw_event._(data?.filter, order));
    reloadGETWithToken(apis.eventBanner._());
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
      reloadGETWithToken(apis.feed.draw_event._(filter, order));
      reloadGETWithToken(apis.eventBanner._());
    }
    if (
      filter == DrawEventFeedFilter.Event &&
      data?.filter !== DrawEventFeedFilter.Event
    ) {
      setOrder(DrawEventOrder.Recent);
      reloadGETWithToken(apis.feed.draw_event._(filter, DrawEventOrder.Recent));
      reloadGETWithToken(apis.eventBanner._());
    }
  };
  const handlePressOrder = ({nativeEvent: {event}}) => {
    setOrder(event);
    reloadGETWithToken(apis.feed.draw_event._(data?.filter, event));
    reloadGETWithToken(apis.eventBanner._());
  };
  const gotoEventApplicationList = useGotoEventApplicationList();
  const gotoBookmarkedDrawEventList = useGotoBookmarkedDrawEventListScreen();
  const gotoNftCollectionSearch = useGotoNftCollectionSearch();
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const numColumns =
    data?.filter == DrawEventFeedFilter.Notice
      ? 1
      : data?.filter == DrawEventFeedFilter.Event
      ? 2
      : 1;
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
  return (
    <SideMenu
      ref={sideMenuRef}
      toleranceX={0}
      edgeHitWidth={70}
      disableGestures={!currentNft?.privilege}
      menu={
        <MyNftCollectionMenu nftCollection={nftCollection} isEvent={true} />
      }
      bounceBackOnOverdraw={false}
      openMenuOffset={DEVICE_WIDTH - 65}>
      <Div
        flex={1}
        bg={
          data?.filter === DrawEventFeedFilter.Event ? Colors.white : '#F4F4F8'
        }>
        <Div bgWhite h={notchHeight}></Div>
        <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
          <Row itemsCenter py5 h40 px15>
            <Row
              auto
              mr16
              itemsCenter
              onPress={() => handlePressFilter(DrawEventFeedFilter.Notice)}>
              <GradientTextUnderline
                fontSize={20}
                width={44}
                height={30}
                text={'공지'}
                selected={data?.filter !== DrawEventFeedFilter.Event}
              />
            </Row>
            <Row
              auto
              mr16
              itemsCenter
              onPress={() => handlePressFilter(DrawEventFeedFilter.Event)}>
              <GradientTextUnderline
                fontSize={20}
                width={62}
                height={30}
                text={'이벤트'}
                selected={data?.filter !== DrawEventFeedFilter.Notice}
              />
            </Row>
            <Col />
            <Col auto onPress={gotoBookmarkedDrawEventList} pl18>
              <Bookmark {...actionIconDefaultProps} />
            </Col>
            <Col auto onPress={gotoNftCollectionSearch} pl16>
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
            {currentNft?.privilege && (
              <Col pl18 auto rounded100 onPress={openSideMenu}>
                {nftCollectionRes?.nft_collection ? (
                  <Img
                    h30
                    w30
                    rounded100
                    bgGray200
                    border={0.5}
                    borderGray200
                    uri={nftCollectionRes.nft_collection.image_uri}></Img>
                ) : (
                  <Div bgGray200 h30 w30 rounded100 />
                )}
              </Col>
            )}
          </Row>
        </Div>
        <FlatList
          ref={flatlistRef}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          key={numColumns}
          keyExtractor={item => (item as any).id}
          ListHeaderComponent={
            <Div>
              <EventBanner
                source={{uri: nftCollection?.background_image_uri}}
                left={
                  data?.filter === DrawEventFeedFilter.Event ? -paddingX / 2 : 0
                }
              />
              {data?.filter === DrawEventFeedFilter.Notice && (
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
    </SideMenu>
  );
}
