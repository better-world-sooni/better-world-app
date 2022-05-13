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
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsAdmin} from 'src/modules/nftUtils';
import BottomPopup from './BottomPopup';
import NftCollectionProfileEditBottomSheetScrollView from './NftCollectionProfileEditBottomSheetScrollView';
import useFollow from 'src/hooks/useFollow';
import apis from 'src/modules/apis';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {PostOwnerType} from 'src/screens/NewPostScreen';
import {HAS_NOTCH} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import {RefreshControl} from 'react-native';

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
  const {goBack} = useNavigation();
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });

  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: HAS_NOTCH ? 124 : 100,
      position: 'absolute',
      zIndex: 100,
      opacity: Math.min(translationY.value / 100, 1),
    };
  });

  return (
    <>
      <Div h={HAS_NOTCH ? 124 : 100}>
        {nftCollection.background_image_uri ? (
          <Img
            zIndex={-10}
            uri={nftCollection.background_image_uri}
            absolute
            top0
            w={DEVICE_WIDTH}
            h={HAS_NOTCH ? 124 : 100}></Img>
        ) : (
          <Div
            absolute
            top0
            h={HAS_NOTCH ? 124 : 100}
            bgGray400
            w={DEVICE_WIDTH}></Div>
        )}
        <Animated.View style={headerStyles}>
          <BlurView
            blurType="dark"
            blurAmount={20}
            blurRadius={10}
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></BlurView>
          <Row itemsCenter justifyCenter width={DEVICE_WIDTH} h={'100%'} mt4>
            <Span white bold fontSize={17}>
              {nftCollection.name}
            </Span>
          </Row>
        </Animated.View>
        <Row
          itemsCenter
          py5
          h40
          zIndex={100}
          absolute
          top={HAS_NOTCH ? 44 : 20}>
          <Col auto ml15 bgBlack p5 rounded100 onPress={goBack}>
            <ChevronLeft width={20} height={20} color="white" strokeWidth={3} />
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
                        bgPrimary={!isFollowing}
                        p8
                        rounded100
                        border1={isFollowing}
                        borderPrimary={isFollowing}
                        onPress={handlePressFollowing}>
                        <Span
                          white={!isFollowing}
                          primary={isFollowing}
                          bold
                          mt2
                          px5>
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
                        bgPrimary
                        p8
                        rounded100
                        onPress={onPressEditProfile}>
                        <Div>
                          <Edit3
                            strokeWidth={2}
                            color={'white'}
                            height={18}
                            width={18}
                          />
                        </Div>
                      </Col>
                      <Col
                        auto
                        bgPrimary={!isFollowing}
                        p8
                        mx8
                        rounded100
                        border1={isFollowing}
                        borderPrimary={isFollowing}
                        onPress={handlePressFollowing}>
                        <Span
                          white={!isFollowing}
                          primary={isFollowing}
                          bold
                          mt2
                          px5>
                          {isFollowing ? '언팔로우' : '팔로우'}
                        </Span>
                      </Col>
                      <Col auto bgPrimary p8 rounded100 onPress={goToNewPost}>
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
              <Row>
                <Col auto mr20>
                  <Span>팔로워 {followerCount}</Span>
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
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }></Animated.FlatList>
    </>
  );
}
