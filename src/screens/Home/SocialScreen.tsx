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
import {useGotoNotification} from 'src/hooks/useGoto';
import FeedFlatlist from 'src/components/FeedFlatlist';
import {Platform} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {Col} from 'src/components/common/Col';
import {MenuView} from '@react-native-menu/menu';
import {Div} from 'src/components/common/Div';
import {Img} from 'src/components/common/Img';
import useFocusReloadWithTimeOut from 'src/hooks/useFocusReloadWithTimeout';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from 'src/components/common/MyNftCollectionMenu';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FocusAwareStatusBar from 'src/components/FocusAwareStatusBar';

enum SocialFeedFilter {
  All = 'all',
  Following = 'following',
}

export default function SocialScreen() {
  const flatlistRef = useRef(null);
  useScrollToTop(flatlistRef);
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed.social);
  const {data: nftProfileRes} = useApiSelector(apis.nft._());
  const nft = nftProfileRes?.nft;
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection._(),
  );
  const nftCollection = nftCollectionRes?.nft_collection;
  const menuOptions = [
    {
      id: SocialFeedFilter.All,
      title: `커뮤니티 피드`,
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'globe.asia.australia',
        android: 'ic_menu_mapmode',
      }),
    },
    {
      id: SocialFeedFilter.Following,
      title: `팔로잉 피드`,
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'star',
        android: 'star_big_on',
      }),
    },
  ];
  const gotoNotifications = useGotoNotification();
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const scrollToTop = () => {
    flatlistRef?.current
      ?.getScrollResponder()
      ?.scrollTo({x: 0, y: 0, animated: true});
  };
  const handlePressMenu = ({nativeEvent: {event}}) => {
    scrollToTop();
    if (
      event == SocialFeedFilter.All &&
      feedRes?.filter !== SocialFeedFilter.All
    ) {
      reloadGETWithToken(apis.feed.social(SocialFeedFilter.All));
    }
    if (
      event == SocialFeedFilter.Following &&
      feedRes?.filter !== SocialFeedFilter.Following
    ) {
      reloadGETWithToken(apis.feed.social(SocialFeedFilter.Following));
    }
  };
  const handleRefresh = () => {
    if (feedLoading) return;
    reloadGETWithToken(apis.feed.social(feedRes?.filter));
    reloadGETWithToken(apis.feed.count());
    reloadGETWithToken(apis.nft_collection._());
  };
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.feed.social(feedRes?.filter, page + 1), 'feed');
  };

  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
  useFocusReloadWithTimeOut({
    reloadUriObject: apis.feed.social(feedRes?.filter),
    cacheTimeoutInSeconds: 120,
    onStart: scrollToTop,
  });
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
        isNotPaginatable={isNotPaginatable}
        enableAdd
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
            <Col auto>
              <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
                <Row itemsCenter>
                  <Col auto>
                    <Span fontSize={19} bold mx4>
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
              <Div onPress={() => gotoNotifications()}>
                <Bell
                  strokeWidth={2}
                  color={Colors.black}
                  height={22}
                  width={22}
                />
              </Div>
            </Col>
          </Row>
        }
      />
    </SideMenu>
  );
}
