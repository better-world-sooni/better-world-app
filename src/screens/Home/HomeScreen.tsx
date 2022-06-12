import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {Col} from 'src/components/common/Col';
import {Row} from 'src/components/common/Row';
import {Plus, Bell, Home, Search, Send} from 'react-native-feather';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoNewPost, useGotoNotification} from 'src/hooks/useGoto';
import {IMAGES} from 'src/modules/images';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from '../../components/common/MyNftCollectionMenu';
import FeedFlatlist from 'src/components/FeedFlatlist';
import {StatusBar} from 'native-base';
import {PostOwnerType} from '../NewPostScreen';
import {useScrollToTop} from '@react-navigation/native';

const HomeScreen = () => {
  const {
    data: feedRes,
    isLoading: feedLoading,
    isPaginating: feedPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.feed._);
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection.profile(),
  );
  const nftCollection = nftCollectionRes?.nft_collection;
  const gotoNotifications = useGotoNotification()
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  const reloadGETWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (feedLoading) return;
    reloadGETWithToken(apis.feed._());
    reloadGETWithToken(apis.nft_collection.profile());
  };
  const handleEndReached = () => {
    if (feedPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.feed._(page + 1), 'feed');
  };
  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
  const flatlistRef = useRef(null);
  useScrollToTop(flatlistRef);
  return (
    <SideMenu
      ref={sideMenuRef}
      toleranceX={0}
      edgeHitWidth={100}
      menu={<MyNftCollectionMenu nftCollection={nftCollection} />}
      bounceBackOnOverdraw={false}
      openMenuOffset={DEVICE_WIDTH - 65}>
      <StatusBar barStyle="dark-content"></StatusBar>
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
        HeaderComponent={
          <Row itemsCenter>
            <Div flex={1} itemsStart rounded100 onPress={openSideMenu}>
              {nftCollectionRes?.nft_collection && (
                <Img
                  h30
                  w30
                  rounded100
                  uri={nftCollectionRes.nft_collection.image_uri}></Img>
              )}
            </Div>
            <Div flex={1} itemsCenter>
              <Img h40 w40 source={IMAGES.betterWorldBlueLogo} legacy />
            </Div>
            <Row flex={1} justifyEnd>
              <Div auto itemsEnd rounded100 onPress={() => gotoNotifications()}>
                <Bell
                  strokeWidth={1.7}
                  color={'black'}
                  height={24}
                  width={24}
                />
              </Div>
            </Row>
          </Row>
        }
      />
    </SideMenu>
  );
};

export default HomeScreen;
