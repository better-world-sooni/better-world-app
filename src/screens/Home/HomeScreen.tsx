import React, {useEffect, useRef, useState} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl, StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {MessageCircle, Bell, Send, Maximize} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {
  useGotoCapsule,
  useGotoChatList,
  useGotoNftCollectionProfile,
  useGotoNotification,
  useGotoScan,
} from 'src/hooks/useGoto';
import Animated, {
  diffClamp,
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {useFocusEffect} from '@react-navigation/native';
import {useUpdateUnreadMessageCount} from 'src/redux/appReducer';
import {IMAGES} from 'src/modules/images';
import SideMenu from 'react-native-side-menu-updated';
import MyNftCollectionMenu from '../../components/common/MyNftCollectionMenu';

const HomeScreen = () => {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(apis.feed._);
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection.profile(),
  );
  const gotoChatList = useGotoChatList();
  const gotoNftCollection = useGotoNftCollectionProfile({});
  const gotoScan = useGotoScan();
  const reloadGetWithToken = useReloadGETWithToken();
  const gotoNotification = useGotoNotification();
  const updateUnreadMessageCount = useUpdateUnreadMessageCount();
  const onRefresh = () => {
    reloadGetWithToken(apis.feed._());
  };
  const translationY = useSharedValue(0);
  const scrollClamp = useSharedValue(0);
  const clamp = (value, lowerBound, upperBound) => {
    'worklet';
    return Math.min(Math.max(lowerBound, value), upperBound);
  };
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event, ctx) => {
      translationY.value = event.contentOffset.y;
      // @ts-ignore
      const diff = event.contentOffset.y - ctx.prevY;
      scrollClamp.value = clamp(scrollClamp.value + diff, 0, 200);
    },
    onBeginDrag: (event, ctx) => {
      // @ts-ignore
      ctx.prevY = event.contentOffset.y;
    },
  });
  const notchHeight = HAS_NOTCH ? 44 : 20;
  const headerHeight = notchHeight + 48;
  const notchStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollClamp.value,
      [0, headerHeight],
      [-headerHeight, 0],
      Extrapolate.CLAMP,
    );
    return {
      width: DEVICE_WIDTH,
      height: notchHeight,
      zIndex: 200,
      position: 'absolute',
      top: 0,
      opacity: Math.min(translationY.value / 50, 1),
      transform: [
        {
          translateY: translateY,
        },
      ],
    };
  });
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  const topBarStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollClamp.value,
      [0, headerHeight],
      [0, -headerHeight],
      Extrapolate.CLAMP,
    );
    return {
      height: headerHeight,
      zIndex: 100,
      transform: [
        {
          translateY,
        },
      ],
    };
  });
  const sideMenuRef = useRef(null);
  const openSideMenu = () => {
    sideMenuRef?.current?.openMenu(true);
  };
  useFocusEffect(() => {
    updateUnreadMessageCount();
  });
  return (
    <SideMenu
      ref={sideMenuRef}
      menu={<MyNftCollectionMenu />}
      bounceBackOnOverdraw={false}
      openMenuOffset={DEVICE_WIDTH - 65}>
      <Div flex={1} bgWhite>
        <Animated.View style={notchStyles}>
          <BlurView
            blurType="xlight"
            blurAmount={30}
            blurRadius={20}
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></BlurView>
        </Animated.View>
        <Animated.FlatList
          automaticallyAdjustContentInsets
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          ListHeaderComponent={
            <Animated.View style={topBarStyles}>
              <Animated.View style={headerStyles}>
                <BlurView
                  blurType="xlight"
                  blurAmount={30}
                  blurRadius={20}
                  style={{
                    width: DEVICE_WIDTH,
                    height: '100%',
                    position: 'absolute',
                  }}
                  reducedTransparencyFallbackColor="white"></BlurView>
              </Animated.View>
              <Row
                itemsCenter
                h40
                px15
                zIndex={100}
                absolute
                w={DEVICE_WIDTH}
                top={notchHeight + 5}>
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
              </Row>
            </Animated.View>
          }
          stickyHeaderIndices={[0]}
          refreshControl={
            <RefreshControl refreshing={feedLoad} onRefresh={onRefresh} />
          }
          data={feedRes ? feedRes.feed : []}
          renderItem={({item, index}) => {
            return <Post key={(item as any).id} post={item} />;
          }}></Animated.FlatList>
      </Div>
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
