import React, {useRef, useState} from 'react';
import {Row} from 'src/components/common/Row';
import {ChevronDown, Send, Zap} from 'react-native-feather';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoChatList} from 'src/hooks/useGoto';
import {IMAGES} from 'src/modules/images';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from '../../components/common/MyNftCollectionMenu';
import FeedFlatlist from 'src/components/FeedFlatlist';
import {Platform, StatusBar} from 'react-native';
import {useScrollToTop} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {Col} from 'src/components/common/Col';
import CommunityWalletSlideShow from 'src/components/common/CommunityWalletSlideShow';
import {Div} from 'src/components/common/Div';
import {Switch} from 'react-native-switch';
import Colors from 'src/constants/Colors';
import {MenuView} from '@react-native-menu/menu';

enum ForumFilter {
  All = '',
  Following = 'following',
  Resolved = 'resolved',
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
  const {data: communityWalletsRes, isLoading: communityWalletLoading} =
    useApiSelector(apis.nft_collection.communityWallet.list());
  const communityWallets = communityWalletsRes?.community_wallets || [];
  const nftCollection = nftCollectionRes?.nft_collection;
  const gotoChatList = useGotoChatList();
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (feedLoading) return;
    reloadGETWithToken(apis.feed.forum());
    reloadGETWithToken(apis.feed.count());
    reloadGETWithToken(apis.nft_collection.communityWallet.list());
    reloadGETWithToken(apis.nft_collection.collectionEvent.list());
    reloadGETWithToken(apis.nft_collection._());
  };
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.feed.forum(page + 1), 'feed');
  };
  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
  const flatlistRef = useRef(null);
  const menuOptions = [
    {
      id: ForumFilter.All,
      title: '모든 제안',
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'globe.asia.australia.fill',
        android: 'ic_menu_mapmode',
      }),
    },
    {
      id: ForumFilter.Following,
      title: '팔로잉 제안',
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'star.fill',
        android: 'star_big_on',
      }),
    },
    {
      id: ForumFilter.Resolved,
      title: '완료된 제안',
      titleColor: '#46F289',
      image: Platform.select({
        ios: 'checkmark.circle.fill',
        android: 'checkbox_on_background',
      }),
    },
  ];
  useScrollToTop(flatlistRef);
  const [showAll, setShowAll] = useState(true);
  return (
    <SideMenu
      ref={sideMenuRef}
      toleranceX={0}
      edgeHitWidth={70}
      menu={<MyNftCollectionMenu nftCollection={nftCollection} />}
      bounceBackOnOverdraw={false}
      openMenuOffset={DEVICE_WIDTH - 65}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF"></StatusBar>
      <FeedFlatlist
        ref={flatlistRef}
        refreshing={feedLoading}
        onRefresh={handleRefresh}
        isPaginating={feedPaginating}
        onEndReached={handleEndReached}
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
                  uri={nftCollectionRes.nft_collection.image_uri}></Img>
              ) : (
                <Div bgGray200 h30 w30 rounded100 />
              )}
            </Col>
            <Col auto itemsCenter>
              <MenuView onPressAction={null} actions={menuOptions}>
                <Row itemsCenter>
                  <Col auto>
                    <Span fontSize={19} bold>
                      모든 제안
                    </Span>
                  </Col>
                  <Col auto>
                    <ChevronDown
                      strokeWidth={2}
                      color={'black'}
                      height={20}
                      width={20}
                    />
                  </Col>
                </Row>
              </MenuView>
            </Col>
            <Col itemsEnd rounded100>
              <Row itemsCenter>
                <Col auto>
                  <Span bold fontSize={10}>
                    제안하기
                  </Span>
                </Col>
                <Col auto>
                  <Zap
                    width={22}
                    height={22}
                    strokeWidth={2}
                    fill={Colors.warning.DEFAULT}
                    color={'black'}></Zap>
                </Col>
              </Row>
            </Col>
          </Row>
        }
      />
    </SideMenu>
  );
}
