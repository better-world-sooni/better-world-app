import {ChevronLeft, Edit3, Grid, MessageCircle} from 'react-native-feather';
import React, {useRef} from 'react';
import {
  getNftName,
  getNftProfileImage,
  useIsCurrentNft,
} from 'src/modules/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import Feed from './Feed';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import apis from 'src/modules/apis';
import {useNavigation} from '@react-navigation/native';
import {RefreshControl} from 'react-native';
import Post from './Post';
import TruncatedMarkdown from './TruncatedMarkdown';
import useFollow from 'src/hooks/useFollow';
import {ICONS} from 'src/modules/icons';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import BottomPopup from './BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import NftProfileEditBottomSheetScrollView from './NftProfileEditBottomSheetScrollView';
import {
  useGotoCapsule,
  useGotoChatRoom,
  useGotoFollowList,
  useGotoNewPost,
  useGotoNftCollectionProfile,
  useGotoQR,
  useGotoRankDeltum,
  useGotoRankSeason,
} from 'src/hooks/useGoto';
import {PostOwnerType} from 'src/screens/NewPostScreen';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {ChatRoomType} from 'src/screens/ChatRoomScreen';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';

export default function NftProfile({
  nft,
  refreshing,
  onRefresh,
  enableBack = true,
}) {
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const isCurrentNft = useIsCurrentNft(nft);

  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    contractAddress: nft.contract_address,
  });
  const goToCapsule = useGotoCapsule({nft});
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nft.is_following,
    nft.follower_count,
    apis.follow.contractAddressAndTokenId(nft.contract_address, nft.token_id)
      .url,
  );
  const {goBack} = useNavigation();
  const gotoRankDeltum = useGotoRankDeltum({
    contractAddress: nft.contract_address,
    tokenId: nft.token_id,
  });
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.Nft,
    contractAddress: nft.contract_address,
    tokenId: nft.token_id,
  });
  const gotoQr = useGotoQR();
  const headerHeight = HAS_NOTCH ? 124 : 100;
  const goToNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
  const gotoChatRoom = useGotoChatRoom({
    chatRoomType: ChatRoomType.DirectMessage,
  });
  const gotoRankSeason = useGotoRankSeason({
    cwyear: null,
    cweek: null,
  });

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
        {nft.background_image_uri ? (
          <Img
            zIndex={-10}
            uri={nft.background_image_uri}
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
            absolute
            top={HAS_NOTCH ? 42 : 18}>
            <Animated.View style={titleStyles}>
              <Span bold fontSize={19} mt18>
                {getNftName(nft)}
              </Span>
            </Animated.View>
          </Row>
        </Animated.View>
        <Row
          itemsCenter
          py5
          h40
          zIndex={100}
          absolute
          top={HAS_NOTCH ? 49 : 25}>
          {enableBack && (
            <Col auto ml15 bgRealBlack p5 rounded100 onPress={goBack}>
              <ChevronLeft
                width={20}
                height={20}
                color="white"
                strokeWidth={2}
              />
            </Col>
          )}
          <Col ml10></Col>
        </Row>
      </Div>
      <Animated.FlatList
        bounces
        style={{marginTop: -30}}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        data={nft.posts}
        ListHeaderComponent={
          <>
            <Row zIndex={100} px15 relative>
              <Div absolute bottom0 w={DEVICE_WIDTH} bgWhite h={55}></Div>
              <Col auto mr10 relative>
                <Img
                  rounded100
                  border3
                  borderWhite
                  bgGray200
                  h85
                  w85
                  uri={getNftProfileImage(nft, 100, 100)}></Img>
                {isCurrentNft && (
                  <Div
                    absolute
                    bottom0
                    right0
                    bgRealBlack
                    rounded100
                    p8
                    onPress={gotoQr}>
                    <Grid
                      strokeWidth={2}
                      color={'white'}
                      height={16}
                      width={16}
                    />
                  </Div>
                )}
              </Col>
              <Col justifyEnd>
                {!isCurrentNft ? (
                  <Div>
                    <Row py8>
                      <Col />
                      <Col
                        auto
                        bgRealBlack
                        p8
                        rounded100
                        onPress={() =>
                          gotoChatRoom({
                            roomName: getNftName(nft),
                            roomImage: [getNftProfileImage(nft)],
                            contractAddress: nft.contract_address,
                            tokenId: nft.token_id,
                          })
                        }>
                        <Div>
                          <MessageCircle
                            strokeWidth={2}
                            color={'white'}
                            height={16}
                            width={16}
                          />
                        </Div>
                      </Col>
                      <Col
                        auto
                        bgRealBlack
                        p9
                        rounded100
                        onPress={goToCapsule}
                        mx8>
                        <Div>
                          <Img w16 h16 source={ICONS.capsuleIconWhite}></Img>
                        </Div>
                      </Col>
                      <Col
                        auto
                        bgRealBlack={!isFollowing}
                        p8
                        rounded100
                        border1={isFollowing}
                        borderGray400={isFollowing}
                        onPress={handlePressFollowing}>
                        <Span white={!isFollowing} bold mt3 px5>
                          {isFollowing ? '언팔로우' : '팔로우'}
                        </Span>
                      </Col>
                    </Row>
                  </Div>
                ) : (
                  <Div>
                    <Row py10>
                      <Col />
                      <Col auto bgRealBlack p8 rounded100 onPress={goToCapsule}>
                        <Div>
                          <Img w16 h16 source={ICONS.capsuleIconWhite}></Img>
                        </Div>
                      </Col>
                      <Col
                        auto
                        bgRealBlack
                        p8
                        rounded100
                        onPress={editProfile}
                        mx8>
                        <Div>
                          <Edit3
                            strokeWidth={2}
                            color={'white'}
                            height={16}
                            width={16}
                          />
                        </Div>
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
            <Div px15 py10 bgWhite borderBottom={0.5} borderGray200>
              <Div>
                <Span fontSize={20} bold>
                  {getNftName(nft)}
                </Span>
              </Div>
              <Div pt3 onPress={gotoNftCollectionProfile}>
                <Span gray700>{nft.nft_metadatum.name}</Span>
              </Div>
              {nft.story ? (
                <Div mt8 bgWhite>
                  <TruncatedMarkdown text={nft.story} maxLength={500} />
                </Div>
              ) : null}
              <Row mt8>
                <Col auto mr20>
                  <Span onPress={() => gotoFollowList(FollowType.Followers)}>
                    <Span gray700>팔로워</Span> {followerCount}
                  </Span>
                </Col>
                <Col auto mr20>
                  <Span onPress={() => gotoFollowList(FollowType.Followings)}>
                    <Span gray700>팔로잉</Span> {nft.following_count}
                  </Span>
                </Col>
                <Col auto mr20 onPress={gotoRankSeason}>
                  <Span>
                    <Span gray700>랭크</Span> {nft.current_rank}
                  </Span>
                </Col>
                <Col auto mr20 onPress={gotoRankDeltum}>
                  <Span>
                    <Span gray700>랭크 스코어</Span> {nft.current_rank_score}
                  </Span>
                </Col>
                <Col />
              </Row>
            </Div>
          </>
        }
        ListFooterComponent={
          !isCurrentNft ? <Div h={HAS_NOTCH ? 27 : 12} /> : null
        }
        renderItem={({item}) => <Post post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }></Animated.FlatList>
      {isCurrentNft && (
        <BottomPopup ref={bottomPopupRef} snapPoints={['90%']} index={-1}>
          <NftProfileEditBottomSheetScrollView nft={nft} />
        </BottomPopup>
      )}
    </>
  );
}
