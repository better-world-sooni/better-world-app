import React, {useRef} from 'react';
import {Row} from 'src/components/common/Row';
import {Send} from 'react-native-feather';
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
import FeedFlatlist from 'src/components/FeedFlatlist';
import {useScrollToTop} from '@react-navigation/native';
import {Span} from 'src/components/common/Span';
import {Col} from 'src/components/common/Col';
import CommunityWalletSlideShow from 'src/components/common/CommunityWalletSlideShow';
import {Div} from 'src/components/common/Div';

export default function ProposalScreen() {
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
  useScrollToTop(flatlistRef);
  return (
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
            {nftCollectionRes?.nft_collection?.name ? (
              <Span bold fontSize={19}>
                {nftCollectionRes.nft_collection.name}
              </Span>
            ) : (
              <Img h40 w40 source={IMAGES.betterWorldBlueLogo} legacy />
            )}
          </Col>
          <Col itemsEnd rounded100 onPress={gotoChatList}>
            <Send strokeWidth={1.7} color={'black'} height={24} width={24} />
          </Col>
        </Row>
      }
      HeaderComponent={
        <CommunityWalletSlideShow
          communityWallets={communityWallets}
          sliderWidth={DEVICE_WIDTH}
        />
      }
    />
  );
}
