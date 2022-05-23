import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {Col} from 'src/components/common/Col';
import {Send} from 'react-native-feather';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {Img} from 'src/components/common/Img';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoCapsule, useGotoChatList} from 'src/hooks/useGoto';
import {useFocusEffect} from '@react-navigation/native';
import {useUpdateUnreadMessageCount} from 'src/redux/appReducer';
import {IMAGES} from 'src/modules/images';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from '../../components/common/MyNftCollectionMenu';
import FeedFlatlist from 'src/components/FeedFlatlist';

const HomeScreen = () => {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(apis.feed._);
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection.profile(),
  );
  const gotoChatList = useGotoChatList();
  const reloadGetWithToken = useReloadGETWithToken();
  const updateUnreadMessageCount = useUpdateUnreadMessageCount();
  const onRefresh = () => {
    reloadGetWithToken(apis.feed._());
    reloadGetWithToken(apis.nft_collection.profile());
  };
  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
  const diffClamp = (value, lowerBound, upperBound) => {
    'worklet';
    return Math.min(Math.max(lowerBound, value), upperBound);
  };
  useFocusEffect(() => {
    updateUnreadMessageCount();
  });
  return (
    <SideMenu
      ref={sideMenuRef}
      toleranceX={0}
      edgeHitWidth={100}
      menu={<MyNftCollectionMenu />}
      bounceBackOnOverdraw={false}
      openMenuOffset={DEVICE_WIDTH - 65}>
      <FeedFlatlist
        refreshing={feedLoad}
        onRefresh={onRefresh}
        renderItem={({item, index}) => {
          return <Post key={(item as any).id} post={item} />;
        }}
        data={feedRes ? feedRes.feed : []}
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
            <Col itemsEnd rounded100 onPress={gotoChatList}>
              <Div>
                <Send
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

function MyActiveCapsule() {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const goToCapsule = useGotoCapsule({nft: currentNft});
  return (
    <Div ml15 relative onPress={goToCapsule}>
      <Img uri={currentNft.capsule.image_uri} w92 h132 rounded10 />
      <Img
        absolute
        top10
        left10
        w28
        h28
        rounded20
        border1
        borderWhite
        uri={getNftProfileImage(currentNft, 50, 50)}></Img>
    </Div>
  );
}

function ActiveCapsule({nft}) {
  const goToCapsule = useGotoCapsule({nft});
  return (
    <Div
      ml8
      relative
      onPress={goToCapsule}
      opacity={nft.capsule.is_active ? 1 : 0.8}>
      <Img uri={nft.capsule.image_uri} w92 h132 rounded10 />
      <Img
        absolute
        top10
        left10
        w28
        h28
        rounded20
        border1
        borderWhite
        uri={getNftProfileImage(nft, 50, 50)}></Img>
    </Div>
  );
}

export default HomeScreen;
