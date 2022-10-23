import React, {useEffect, useRef} from 'react';
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
import {Archive, Clock, Gift, Search} from 'react-native-feather';
import {
  useGotoEventApplicationList,
  useGotoNftCollectionSearch,
} from 'src/hooks/useGoto';
import DrawEvent from 'src/components/common/DrawEvent';
import {useNavigation} from '@react-navigation/native';
import {smallBump} from 'src/utils/hapticFeedBackUtils';

enum DrawEventFeedFilter {
  All = 'all',
  Eligible = 'eligible',
  Following = 'following',
}

export default function StoreScreen() {
  const flatlistRef = useRef(null);
  const navigation = useNavigation();
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.feed.draw_event);
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection._(),
  );
  const nftCollection = nftCollectionRes?.nft_collection;
  const drawEvents = data ? data.draw_events : [];
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.feed.draw_event(data?.filter, page + 1),
      'draw_events',
    );
  };
  const handleRefresh = () => {
    reloadGETWithToken(apis.feed.draw_event(data?.filter));
  };
  const scrollToTop = () => {
    flatlistRef?.current
      ?.getScrollResponder()
      ?.scrollTo({x: 0, y: 0, animated: true});
  };
  const handlePressFilter = filter => {
    scrollToTop();
    if (
      filter == DrawEventFeedFilter.All &&
      data?.filter !== DrawEventFeedFilter.All
    ) {
      reloadGETWithToken(apis.feed.draw_event(filter));
    }
    if (
      filter == DrawEventFeedFilter.Following &&
      data?.filter !== DrawEventFeedFilter.Following
    ) {
      reloadGETWithToken(apis.feed.draw_event(filter));
    }
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
          if (data?.filter == DrawEventFeedFilter.All) {
            reloadGETWithToken(
              apis.feed.draw_event(DrawEventFeedFilter.Following),
            );
          } else {
            reloadGETWithToken(apis.feed.draw_event(DrawEventFeedFilter.All));
          }
          smallBump();
        }
      },
    );
    return unsubscribe;
  }, [data?.filter]);

  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40 px15>
          <Col
            auto
            mr16
            py2
            borderBottom={data?.filter == DrawEventFeedFilter.Following ? 2 : 0}
            onPress={() => handlePressFilter(DrawEventFeedFilter.Following)}>
            <Span
              bold
              fontSize={19}
              gray400={data?.filter !== DrawEventFeedFilter.Following}>
              {'팔로잉'}
            </Span>
          </Col>
          <Col
            auto
            mr16
            py2
            borderBottom={data?.filter == DrawEventFeedFilter.All ? 2 : 0}
            onPress={() => handlePressFilter(DrawEventFeedFilter.All)}>
            <Span
              bold
              fontSize={19}
              gray400={data?.filter !== DrawEventFeedFilter.All}>
              {'전체'}
            </Span>
          </Col>
          <Col />
          <Col auto onPress={gotoNftCollectionSearch} pl16>
            <Search
              strokeWidth={2}
              color={Colors.black}
              height={22}
              width={22}
            />
          </Col>
          <Col auto onPress={gotoEventApplicationList} pl16>
            <Archive
              width={22}
              height={22}
              color={Colors.black}
              strokeWidth={2}
            />
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
              h90
              wFull
              mb12
              overflowHidden>
              <Div wFull h90 bgBlack opacity={0.75}></Div>
              <Div absolute top0 wFull h90 px16 py8 justifyCenter>
                <Span white gray400 fontSize={12}>
                  오직 홀더를 위한 공지와 이벤트
                </Span>
                <Span white bold mt4>
                  BetterWorld Events
                </Span>
              </Div>
            </ImageBackground>
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
              mx={15}
              my={15}
              width={DEVICE_WIDTH - 15 * 2}
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
