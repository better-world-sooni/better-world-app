import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl, StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {MessageCircle, Bell} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {getNftProfileImage} from 'src/modules/nftUtils';
import {IMAGES} from 'src/modules/images';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoCapsule} from 'src/hooks/useGoto';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';

const HomeScreen = () => {
  const {data: feedRes, isLoading: feedLoad} = useApiSelector(apis.feed._);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.feed._());
  };
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const headerHeight = HAS_NOTCH ? 84 : 60;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <Div flex bgWhite>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        ListHeaderComponent={
          <Div h={headerHeight} zIndex={100}>
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
              py5
              h40
              px15
              zIndex={100}
              absolute
              w={DEVICE_WIDTH}
              top={HAS_NOTCH ? 44 : 20}>
              <Col auto>
                <Img source={IMAGES.betterWorldBlueLogo} w={50} h={50}></Img>
              </Col>
              <Col></Col>
            </Row>
          </Div>
        }
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl refreshing={feedLoad} onRefresh={onRefresh} />
        }
        data={feedRes ? feedRes.feed : []}
        renderItem={({item, index}) => {
          if (index == 0) {
            if ((item as any).length == 0)
              return <Div borderBottom={0.5} borderGray200></Div>;
            return (
              <ScrollView
                horizontal
                py8
                borderBottom={0.5}
                borderGray200
                showsHorizontalScrollIndicator={false}>
                <MyActiveCapsule />
                {(item as any).map(capsuleOwner => {
                  return <ActiveCapsule nft={capsuleOwner} />;
                })}
              </ScrollView>
            );
          }
          return <Post key={(item as any).id} post={item} />;
        }}></Animated.FlatList>
    </Div>
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
  console.log(nft.capsule.is_active, nft);
  return (
    <Div
      ml15
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
