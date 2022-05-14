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
      position: 'absolute',
      zIndex: 100,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <Div flex bgWhite>
      <Div h={headerHeight} zIndex={100}>
        <Animated.View style={headerStyles}>
          <BlurView
            blurType="xlight"
            blurAmount={5}
            blurRadius={5}
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
          zIndex={100}
          absolute
          w={DEVICE_WIDTH}
          top={HAS_NOTCH ? 44 : 20}>
          <Col></Col>
          <Col auto>
            <Img source={IMAGES.betterWorldBlueLogo} w={40} h={40}></Img>
          </Col>
          <Col></Col>
        </Row>
      </Div>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl refreshing={feedLoad} onRefresh={onRefresh} />
        }
        data={feedRes ? feedRes.feed : []}
        renderItem={({item, index}) => {
          if (index == 0)
            return (
              <ScrollView horizontal pb8 borderBottom={0.5} borderGray200>
                <MyActiveCapsule />
              </ScrollView>
            );
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

export default HomeScreen;
