import React, {useRef} from 'react';
import {Row} from 'src/components/common/Row';
import {Bell, ChevronDown} from 'react-native-feather';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoNotification} from 'src/hooks/useGoto';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from '../../components/common/MyNftCollectionMenu';
import FeedFlatlist, {EnableAddType} from 'src/components/FeedFlatlist';
import {Platform} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {Col} from 'src/components/common/Col';
import {Div} from 'src/components/common/Div';
import {Colors} from 'src/modules/styles';
import {MenuView} from '@react-native-menu/menu';
import useFocusReloadWithTimeOut from 'src/hooks/useFocusReloadWithTimeout';
import {useUpdateUnreadNotificationCount} from 'src/redux/appReducer';
import {useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

export enum ForumFeedFilter {
  All = 'all',
  Following = 'following',
  Approved = 'approved',
}

export default function HomeScreen() {
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed.forum);
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection._(),
  );
  const nftCollection = nftCollectionRes?.nft_collection;
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const gotoNotifications = useGotoNotification();
  const updateUnreadNotificationCount = useUpdateUnreadNotificationCount();
  const handleRefresh = () => {
    if (feedLoading) return;
    reloadGETWithToken(apis.feed.forum(feedRes?.filter));
    updateUnreadNotificationCount();
    reloadGETWithToken(apis.nft_collection._());
  };
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.feed.forum(feedRes?.filter, page + 1), 'feed');
  };
  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
  const flatlistRef = useRef(null);
  useScrollToTop(flatlistRef);
  const menuOptions = [
    {
      id: ForumFeedFilter.All,
      title: '모든 제안',
      image: Platform.select({
        ios: 'globe.asia.australia',
      }),
    },
    {
      id: ForumFeedFilter.Following,
      title: '팔로잉 제안',
      image: Platform.select({
        ios: 'star',
      }),
    },
    {
      id: ForumFeedFilter.Approved,
      title: '통과된 제안',
      image: Platform.select({
        ios: 'checkmark.circle',
      }),
    },
  ];
  const scrollToTop = () => {
    flatlistRef?.current
      ?.getScrollResponder()
      ?.scrollTo({x: 0, y: 0, animated: true});
  };
  const handlePressMenu = ({nativeEvent: {event}}) => {
    scrollToTop();
    if (
      event == ForumFeedFilter.All &&
      feedRes?.filter !== ForumFeedFilter.All
    ) {
      reloadGETWithToken(apis.feed.forum(ForumFeedFilter.All));
    }
    if (
      event == ForumFeedFilter.Following &&
      feedRes?.filter !== ForumFeedFilter.Following
    ) {
      reloadGETWithToken(apis.feed.forum(ForumFeedFilter.Following));
    }
    if (
      event == ForumFeedFilter.Approved &&
      feedRes?.filter !== ForumFeedFilter.Approved
    ) {
      reloadGETWithToken(apis.feed.forum(ForumFeedFilter.Approved));
    }
  };
  useFocusReloadWithTimeOut({
    reloadUriObject: apis.feed.forum(feedRes?.filter),
    cacheTimeoutInSeconds: 300,
    onStart: scrollToTop,
  });
  const unreadNotificationCount = useSelector(
    (root: RootState) => root.app.unreadNotificationCount,
  );

  return (
    <SideMenu
      ref={sideMenuRef}
      toleranceX={0}
      edgeHitWidth={70}
      menu={<MyNftCollectionMenu nftCollection={nftCollection} />}
      bounceBackOnOverdraw={false}
      openMenuOffset={DEVICE_WIDTH - 65}>
      <FeedFlatlist
        ref={flatlistRef}
        refreshing={feedLoading}
        onRefresh={handleRefresh}
        isPaginating={feedPaginating}
        onEndReached={handleEndReached}
        enableAdd
        enableAddType={EnableAddType.Proposal}
        isNotPaginatable={isNotPaginatable}
        renderItem={({item, index}) => {
          return <Post key={(item as any).id} post={item} />;
        }}
        data={feedRes ? feedRes.feed : []}
        TopComponent={
          <Row itemsCenter>
            <Col itemsStart rounded100 onPress={openSideMenu}>
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
            <Col auto itemsCenter>
              <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
                <Row itemsCenter>
                  <Col auto mx4>
                    <Span fontSize={17} bold>
                      {menuOptions.filter(
                        menuOption => menuOption.id == feedRes?.filter,
                      )[0]?.title || '피드를 다시 로드해주세요'}
                    </Span>
                  </Col>
                  <Col auto>
                    <ChevronDown
                      strokeWidth={2}
                      color={Colors.black}
                      height={20}
                      width={20}
                    />
                  </Col>
                </Row>
              </MenuView>
            </Col>
            <Col itemsEnd>
              <Div onPress={() => gotoNotifications()} relative>
                <Bell
                  strokeWidth={2}
                  color={Colors.black}
                  height={22}
                  width={22}
                />
                {unreadNotificationCount > 0 && (
                  <Div
                    absolute
                    top={-10}
                    right={-10}
                    auto
                    rounded100
                    bgDanger
                    py4
                    px8
                    justifyCenter>
                    <Span white fontSize={10} bold>
                      {unreadNotificationCount}
                    </Span>
                  </Div>
                )}
              </Div>
            </Col>
          </Row>
        }
      />
    </SideMenu>
  );
}
