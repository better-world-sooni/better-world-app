import {ChevronLeft, Edit, Edit3} from 'react-native-feather';
import React, {useRef} from 'react';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {resizeImageUri} from 'src/modules/uriUtils';
import ProfileDataTabs from '../ProfileDataTabs';
import {DEVICE_WIDTH} from 'src/modules/styles';
import useFollow from 'src/hooks/useFollow';
import apis from 'src/modules/apis';
import {useGotoFollowList, useGotoNewPost} from 'src/hooks/useGoto';
import {PostOwnerType} from 'src/screens/NewPostScreen';
import {HAS_NOTCH} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';

export default function NftCollectionProfile({
  nftCollection,
  isAdmin,
  onPressEditProfile,
  refreshing,
  onRefresh,
}) {
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nftCollection.is_following,
    nftCollection.follower_count,
    apis.follow.contractAddress(nftCollection.contract_address).url,
  );
  const goToNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.NftCollection,
  });
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.NftCollection,
    contractAddress: nftCollection.contract_address,
  });
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const headerHeight = HAS_NOTCH ? 124 : 100;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      position: 'absolute',
      zIndex: 100,
      opacity: Math.min((translationY.value - 150) / 100, 1),
    };
  });
  const titleStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: Math.max(0, headerHeight - (translationY.value - 150)),
        },
      ],
    };
  });

  return (
    <>
      <Div h={headerHeight}>
        {nftCollection.background_image_uri ? (
          <Img
            zIndex={-10}
            uri={nftCollection.background_image_uri}
            absolute
            top0
            w={DEVICE_WIDTH}
            h={headerHeight}></Img>
        ) : (
          <Div absolute top0 h={headerHeight} bgGray400 w={DEVICE_WIDTH}></Div>
        )}
        <Animated.View style={headerStyles}>
          <BlurView
            blurType="light"
            blurAmount={20}
            blurRadius={10}
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></BlurView>
          <Row
            itemsCenter
            justifyCenter
            width={DEVICE_WIDTH}
            zIndex={100}
            absolute
            top={HAS_NOTCH ? 42 : 18}>
            <Animated.View style={titleStyles}>
              <Span bold fontSize={19} mt18>
                {nftCollection.name}
              </Span>
            </Animated.View>
          </Row>
        </Animated.View>
        <Row
          itemsCenter
          py5
          h40
          px15
          zIndex={100}
          absolute
          top={HAS_NOTCH ? 49 : 25}>
          <Col auto bg={'black'} p8 rounded100 mr12>
            <Div>
              <ChevronLeft
                strokeWidth={2}
                color={'white'}
                height={16}
                width={16}
              />
            </Div>
          </Col>
          <Col ml10></Col>
        </Row>
      </Div>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        style={{marginTop: -30}}
        data={[null]}
        ListHeaderComponent={
          <>
            <Row zIndex={100} px15 relative>
              <Div absolute bottom0 w={DEVICE_WIDTH} bgWhite h={55}></Div>
              <Col auto mr10 relative>
                <Img
                  rounded100
                  border4
                  borderWhite
                  bgGray200
                  h85
                  w85
                  uri={resizeImageUri(nftCollection.image_uri, 100, 100)}></Img>
              </Col>
              <Col justifyEnd>
                {!isAdmin ? (
                  <Div>
                    <Row py8>
                      <Col />
                      <Col
                        auto
                        bgRealBlack={!isFollowing}
                        p8
                        rounded100
                        border1={isFollowing}
                        borderGray400={isFollowing}
                        onPress={handlePressFollowing}>
                        <Span white={!isFollowing} bold mt2 px5>
                          {isFollowing ? '언팔로우' : '팔로우'}
                        </Span>
                      </Col>
                    </Row>
                  </Div>
                ) : (
                  <Div>
                    <Row py10>
                      <Col />
                      <Col
                        auto
                        bgRealBlack
                        p8
                        rounded100
                        onPress={onPressEditProfile}>
                        <Div>
                          <Edit3
                            strokeWidth={2}
                            color={'white'}
                            height={16}
                            width={16}
                          />
                        </Div>
                      </Col>
                      <Col
                        auto
                        bgRealBlack={!isFollowing}
                        p8
                        mx8
                        rounded100
                        border1={isFollowing}
                        borderGray400={isFollowing}
                        onPress={handlePressFollowing}>
                        <Span white={!isFollowing} bold mt1 px5>
                          {isFollowing ? '언팔로우' : '팔로우'}
                        </Span>
                      </Col>
                      <Col auto bgRealBlack p8 rounded100 onPress={goToNewPost}>
                        <Span white bold mt1 px5>
                          게시물 업로드
                        </Span>
                      </Col>
                    </Row>
                  </Div>
                )}
              </Col>
            </Row>
            <Div px15 pt10 bgWhite>
              <Div>
                <Span fontSize={20} bold>
                  {nftCollection.name}
                </Span>
              </Div>
              <Row mt5>
                <Col auto mr20>
                  <Span onPress={() => gotoFollowList(FollowType.Followers)}>
                    {followerCount} 팔로워
                  </Span>
                </Col>
                <Col />
              </Row>
            </Div>
          </>
        }
        renderItem={() => (
          <ProfileDataTabs
            posts={nftCollection.posts}
            about={nftCollection.about}
            members={nftCollection.nfts}
            adminNfts={nftCollection.admin_nfts}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }></Animated.FlatList>
    </>
  );
}
