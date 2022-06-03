import {
  ChevronLeft,
  Edit3,
  Grid,
  Maximize,
  MessageCircle,
} from 'react-native-feather';
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
  useGotoScan,
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
  nftCore,
  refreshing,
  onRefresh,
  enableBack = true,
  qrScan = false,
}) {
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const isCurrentNft = useIsCurrentNft(nftCore);
  const gotoNftCollectionProfile = useGotoNftCollectionProfile({
    nftCollection: nft?.nft_collection,
  });
  const goToCapsule = useGotoCapsule({nft});
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nft?.is_following,
    nft?.follower_count,
    apis.follow.contractAddressAndTokenId(nft?.contract_address, nft?.token_id)
      .url,
  );
  const {goBack} = useNavigation();
  const gotoRankDeltum = useGotoRankDeltum({
    contractAddress: nftCore.contract_address,
    tokenId: nftCore.token_id,
  });
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.Nft,
    contractAddress: nftCore.contract_address,
    tokenId: nftCore.token_id,
  });
  const gotoQr = useGotoQR();
  const gotoScan = useGotoScan();
  const headerHeight = HAS_NOTCH ? 124 : 100;
  const gotoNewPost = useGotoNewPost({postOwnerType: PostOwnerType.Nft});
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
        {nft?.background_image_uri ? (
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
                {getNftName(nftCore)}
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
                strokeWidth={2.4}
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
        data={nft?.posts || []}
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
                  uri={getNftProfileImage(nftCore, 200, 200)}></Img>
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
                            roomName: getNftName(nftCore),
                            roomImage: [getNftProfileImage(nftCore)],
                            contractAddress: nftCore.contract_address,
                            tokenId: nftCore.token_id,
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
                        <Span white={!isFollowing} bold mt2 px5>
                          {!nft
                            ? '불러오는 중'
                            : isFollowing
                            ? '언팔로우'
                            : '팔로우'}
                        </Span>
                      </Col>
                    </Row>
                  </Div>
                ) : (
                  <Div>
                    <Row py10>
                      <Col />
                      {qrScan ? (
                        <Col auto bgRealBlack p8 rounded100 onPress={gotoScan}>
                          <Div>
                            <Maximize
                              strokeWidth={2}
                              color={'white'}
                              height={16}
                              width={16}
                            />
                          </Div>
                        </Col>
                      ) : (
                        <Col
                          auto
                          bgRealBlack
                          p8
                          rounded100
                          onPress={goToCapsule}>
                          <Div>
                            <Img w16 h16 source={ICONS.capsuleIconWhite}></Img>
                          </Div>
                        </Col>
                      )}
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
                      <Col
                        auto
                        bgRealBlack
                        p8
                        rounded100
                        onPress={() => gotoNewPost()}>
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
                  {getNftName(nftCore)}
                </Span>
              </Div>
              {nft && (
                <Div pt3 onPress={gotoNftCollectionProfile}>
                  <Span gray700>{nftCore.nft_metadatum.name}</Span>
                </Div>
              )}
              {nftCore.story ? (
                <Div mt8 bgWhite>
                  <TruncatedMarkdown text={nftCore.story} maxLength={500} />
                </Div>
              ) : null}
              {nft && (
                <Row mt8>
                  <Col
                    auto
                    mr20
                    onPress={() => gotoFollowList(FollowType.Followers)}>
                    <Span bold>
                      <Span gray700 regular>
                        팔로워
                      </Span>{' '}
                      {followerCount}
                    </Span>
                  </Col>
                  <Col
                    auto
                    mr20
                    onPress={() => gotoFollowList(FollowType.Followings)}>
                    <Span bold>
                      <Span gray700 regular>
                        팔로잉
                      </Span>{' '}
                      {nft.following_count}
                    </Span>
                  </Col>
                  <Col auto mr20 onPress={gotoRankSeason}>
                    <Span bold>
                      <Span gray700 regular>
                        랭크
                      </Span>{' '}
                      {nft.current_rank}
                    </Span>
                  </Col>
                  <Col auto mr20 onPress={gotoRankDeltum}>
                    <Span bold>
                      <Span gray700 regular>
                        랭크 스코어
                      </Span>{' '}
                      {nft.current_rank_score}
                    </Span>
                  </Col>
                  <Col />
                </Row>
              )}
            </Div>
          </>
        }
        ListEmptyComponent={
          <Div>
            <Row py15>
              <Col></Col>
              <Col auto>
                <Span>아직 게시물이 없습니다.</Span>
              </Col>
              <Col></Col>
            </Row>
          </Div>
        }
        ListFooterComponent={<Div h={HAS_NOTCH ? 27 : 12} />}
        renderItem={({item}) => <Post post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }></Animated.FlatList>
      {isCurrentNft && qrScan && (
        <BottomPopup ref={bottomPopupRef} snapPoints={['90%']} index={-1}>
          <NftProfileEditBottomSheetScrollView nft={nft} />
        </BottomPopup>
      )}
    </>
  );
}
