import {ChevronLeft, Edit, Edit3} from 'react-native-feather';
import React, {useRef} from 'react';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {resizeImageUri} from 'src/modules/uriUtils';
import {DEVICE_WIDTH} from 'src/modules/styles';
import useFollow from 'src/hooks/useFollow';
import apis from 'src/modules/apis';
import {
  useGotoAffinity,
  useGotoFollowList,
  useGotoNewPost,
} from 'src/hooks/useGoto';
import {PostOwnerType} from 'src/screens/NewPostScreen';
import {HAS_NOTCH} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import TruncatedMarkdown from './TruncatedMarkdown';
import Post from './Post';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';

export default function NftCollectionProfile({
  nftCollectionCore,
  isAdmin,
  onPressEditProfile,
  nftCollectionProfileApiObject,
  pageableNftCollectionPostFn,
}) {
  const {
    data: nftCollectionProfileRes,
    isLoading: nftCollectionProfileLoading,
  } = useApiSelector(nftCollectionProfileApiObject);
  const {
    data: nftCollectionPostListRes,
    isLoading: nftCollectionPostListLoading,
    isPaginating: nftCollectionPostListPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(pageableNftCollectionPostFn());
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(nftCollectionProfileApiObject);
    reloadGetWithToken(pageableNftCollectionPostFn());
  };
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (nftCollectionPostListPaginating || isNotPaginatable) return;
    paginateGetWithToken(pageableNftCollectionPostFn(page + 1), 'posts');
  };
  const nftCollection = nftCollectionProfileRes?.nft_collection;
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [isFollowing, followerCount, handlePressFollowing] = useFollow(
    nftCollection?.is_following,
    nftCollection?.follower_count,
    apis.follow.contractAddress(nftCollectionCore.contract_address).url,
  );
  const {goBack} = useNavigation();
  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.NftCollection,
  });
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.NftCollection,
    contractAddress: nftCollectionCore.contract_address,
  });
  const gotoAffinity = useGotoAffinity({
    nftCollection,
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
        {nftCollection?.background_image_uri ? (
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
                {nftCollectionCore.name}
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
          <Col auto bg={'black'} p8 rounded100 mr12 onPress={goBack}>
            <Div>
              <ChevronLeft
                strokeWidth={2.4}
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
        onEndReached={handleEndReached}
        style={{marginTop: -30}}
        data={nftCollectionPostListRes?.posts || []}
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
                  uri={resizeImageUri(
                    nftCollectionCore.image_uri ||
                      nftCollectionCore.nft_metadatum.image_uri,
                    100,
                    100,
                  )}></Img>
              </Col>
              <Col justifyEnd>
                {!isAdmin &&
                nftCollectionCore.contract_address !=
                  currentNft.contract_address ? (
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
                  isAdmin && (
                    <Div>
                      <Row py10>
                        <Col />
                        <Col
                          auto
                          bgRealBlack
                          p8
                          rounded100
                          mr8
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
                          bgRealBlack
                          p8
                          rounded100
                          onPress={() => gotoNewPost(null)}>
                          <Span white bold mt1 px5>
                            게시물 업로드
                          </Span>
                        </Col>
                      </Row>
                    </Div>
                  )
                )}
              </Col>
            </Row>
            <Div px15 py10 bgWhite borderBottom={0.5} borderGray200>
              <Div>
                <Span fontSize={20} bold>
                  {nftCollectionCore.name}
                </Span>
              </Div>
              {nftCollection && (
                <>
                  <Row mt5>
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
                    <Col auto mr20 onPress={gotoAffinity}>
                      <Span bold>
                        <Span gray700 regular>
                          멤버 친목도
                        </Span>{' '}
                        {nftCollection.affinity.total_possible_follows
                          ? Math.ceil(
                              (nftCollection.affinity.follows_among_members /
                                nftCollection.affinity.total_possible_follows) *
                                100,
                            )
                          : 0}
                        % ({nftCollection.affinity.follows_among_members} /{' '}
                        {nftCollection.affinity.total_possible_follows})
                      </Span>
                    </Col>
                    <Col />
                  </Row>
                  {nftCollection.admin_nfts.length > 0 && (
                    <Row mt10 itemsCenter>
                      <Col auto>
                        <AdminProfiles admin={nftCollection.admin_nfts} />
                      </Col>
                      <Col auto>
                        <AdminNames admin={nftCollection.admin_nfts} />
                      </Col>
                      <Col />
                    </Row>
                  )}
                  {nftCollection.about ? (
                    <Div mt16>
                      <TruncatedMarkdown
                        text={nftCollection.about}
                        maxLength={500}
                      />
                    </Div>
                  ) : null}
                </>
              )}
            </Div>
          </>
        }
        renderItem={({item}) => <Post post={item} />}
        ListFooterComponent={
          <>
            {(nftCollectionPostListPaginating ||
              nftCollectionPostListLoading) && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            {isNotPaginatable && (
              <Div itemsCenter py15>
                <Span textCenter>게시물을 모두 확인했습니다.</Span>
              </Div>
            )}
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={nftCollectionProfileLoading}
            onRefresh={handleRefresh}
          />
        }></Animated.FlatList>
    </>
  );
}

function AdminProfiles({admin}) {
  return (
    <Div w={(admin.slice(0, 3).length - 1) * 12 + 19} relative h22 mr5>
      {admin.slice(0, 3).map((nft, index) => {
        return (
          <Img
            key={index}
            uri={getNftProfileImage(nft)}
            rounded100
            h22
            w22
            absolute
            top0
            left={index * 12}
            border={1.5}
            borderWhite></Img>
        );
      })}
    </Div>
  );
}

function AdminNames({admin}) {
  if (admin.length == 0) return null;
  if (admin.length < 4) {
    return (
      <Span>
        <Span bold>
          {admin
            .slice(0, 3)
            .map((nft, index) => {
              return getNftName(nft);
            })
            .join(', ')}
        </Span>
        이(가) 관리중
      </Span>
    );
  }
  return (
    <Span>
      <Span bold>
        {admin
          .slice(0, 3)
          .map((nft, index) => {
            return getNftName(nft);
          })
          .join(', ')}{' '}
      </Span>
      외 <Span bold>{admin.length - 3}</Span>명이 관리중
    </Span>
  );
}