import React, {useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {Col} from 'src/components/common/Col';
import {Bell, Plus, Send} from 'react-native-feather';
import apis from 'src/modules/apis';
import {useApiSelector} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {IMAGES} from 'src/modules/images';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from '../../components/common/MyNftCollectionMenu';
import FeedFlatlist from 'src/components/FeedFlatlist';
import {StatusBar} from 'native-base';
import {PostOwnerType} from '../NewPostScreen';
import usePaginatedQuery from 'src/hooks/usePaginatedQuery';

const HomeScreen = () => {
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection.profile(),
  );
  const nftCollection = nftCollectionRes?.nft_collection;
  const pageableApiKeyFn = (page?) => {
    return apis.feed._(page ? page + 1 : 1);
  };
  const {
    isLoading,
    isError,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    handleRefresh,
    handleLoadMore,
  } = usePaginatedQuery({pageableApiKeyFn, listKey: 'feed'});
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
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
        refreshing={isLoading}
        onRefresh={handleRefresh}
        isPaginating={isFetchingNextPage}
        onEndReached={handleLoadMore}
        isNotPaginatable={!hasNextPage}
        renderItem={({item, index}) => {
          return <Post key={(item as any).id} post={item} />;
        }}
        data={data?.pages?.flat() || []}
        HeaderComponent={
          <>
            <Col itemsStart rounded100 onPress={openSideMenu}>
              {nftCollectionRes?.nft_collection && (
                <Div>
                  <Img
                    h30
                    w30
                    rounded100
                    uri={nftCollectionRes.nft_collection.image_uri}></Img>
                </Div>
              )}
            </Col>
            <Col auto>
              <Img h40 w40 source={IMAGES.betterWorldBlueLogo}></Img>
            </Col>
            <Col itemsEnd rounded100 onPress={() => gotoNewPost()}>
              <Div>
                <Plus
                  strokeWidth={1.7}
                  color={'black'}
                  height={24}
                  width={24}
                />
              </Div>
            </Col>
          </>
        }
      />
    </SideMenu>
  );
};

export default HomeScreen;
