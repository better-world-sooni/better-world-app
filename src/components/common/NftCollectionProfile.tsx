import {ChevronLeft, Settings} from 'react-native-feather';
import React, {useRef, useState, useEffect} from 'react';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import useFollow from 'src/hooks/useFollow';
import apis from 'src/modules/apis';
import {
  useGotoCollectionSearch,
  useGotoFollowList,
  useGotoNftCollectionProfileEdit,
} from 'src/hooks/useGoto';
import {HAS_NOTCH} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RefreshControl, Platform} from 'react-native';
import {FollowOwnerType, FollowType} from 'src/screens/FollowListScreen';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import TruncatedMarkdown from './TruncatedMarkdown';
import Post from './Post';
import {BlurView} from '@react-native-community/blur';
import {getNftName, getNftProfileImage} from 'src/utils/nftUtils';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ICONS} from 'src/modules/icons';
import ListEmptyComponent from './ListEmptyComponent';
import {handlePressContribution} from 'src/utils/bottomPopupUtils';
import ImageColors from 'react-native-image-colors';
import FocusAwareStatusBar from 'src/components/FocusAwareStatusBar';
import {expandImageViewer} from 'src/utils/imageViewerUtils';

export default function NftCollectionProfile({
  nftCollectionCore,
  isAdmin,
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
  const gotoNftCollectionProfileEdit = useGotoNftCollectionProfileEdit();
  const handleEndReached = () => {
    if (nftCollectionPostListPaginating || isNotPaginatable) return;
    paginateGetWithToken(pageableNftCollectionPostFn(page + 1), 'posts');
  };
  const nftCollection = nftCollectionProfileRes?.nft_collection;
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const [bgImgColor, setBgImgColor] = useState(Colors.gray[400]);
  const {
    isFollowing,
    followerCount,
    handlePressFollowing,
    isBlocked,
    handlePressBlock,
  } = useFollow(
    nftCollection?.is_following,
    nftCollection?.follower_count,
    nftCollectionCore.contract_address,
  );
  const {goBack} = useNavigation();
  const gotoFollowList = useGotoFollowList({
    followOwnerType: FollowOwnerType.NftCollection,
    contractAddress: nftCollectionCore.contract_address,
  });
  const gotoCollectionSearch = useGotoCollectionSearch({
    contractAddress: nftCollectionCore.contract_address,
  });
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 80;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight - 30,
      position: 'absolute',
      zIndex: 100,
      opacity: Math.min((translationY.value - 150) / 100, 1),
    };
  });
  const backgroundImageStyles = useAnimatedStyle(() => {
    return {
      zIndex: -10,
      position: 'absolute',
      top: 0,
      width: DEVICE_WIDTH,
      height: headerHeight + 30,
      transform: [
        {
          scale: Math.max(-(translationY.value - headerHeight) / 100, 1),
        },
      ],
    };
  });
  const titleStyles = useAnimatedStyle(() => {
    const middlePoint = (notchHeight + (headerHeight - 30)) / 2;
    const startPoint = headerHeight - 30;
    const moveLengthScrollRatio = (startPoint - middlePoint) / 100;
    return {
      position: 'relative',
      transform: [
        {
          translateY: Math.max(
            middlePoint - 9,
            startPoint -
              moveLengthScrollRatio * (translationY.value - 150) -
              18,
          ),
        },
      ],
    };
  });

  useEffect(() => {
    if (nftCollection?.background_image_uri) {
      ImageColors.getColors(nftCollection.background_image_uri, {
        fallback: '#228B22',
        cache: true,
        key: nftCollection.background_image_uri,
      }).then(colors => {
        setBgImgColor(colors['average']);
      });
    } else {
      setBgImgColor(Colors.gray[400]);
    }
  }, [nftCollection, bgImgColor, setBgImgColor]);

  return (
    <>
      {Platform.OS === 'android' && (
        <FocusAwareStatusBar
          barStyle="light-content"
          backgroundColor={bgImgColor}
        />
      )}
      <Div
        h={headerHeight}
        onPress={() => {
          if (nftCollection)
            expandImageViewer([{uri: nftCollection.background_image_uri}], 0);
        }}>
        {nftCollection?.background_image_uri ? (
          <Animated.Image
            style={backgroundImageStyles}
            source={{uri: nftCollection.background_image_uri}}></Animated.Image>
        ) : (
          <Div
            absolute
            top0
            h={headerHeight + 30}
            bgGray400
            w={DEVICE_WIDTH}></Div>
        )}
        <Animated.View style={headerStyles}>
          {Platform.OS === 'ios' ? (
            <BlurView
              blurType="light"
              blurAmount={20}
              blurRadius={10}
              overlayColor=""
              style={{
                width: DEVICE_WIDTH,
                height: '100%',
                position: 'absolute',
              }}
              reducedTransparencyFallbackColor={Colors.white}
            />
          ) : (
            <Div
              style={{
                width: DEVICE_WIDTH,
                height: '100%',
                position: 'absolute',
              }}
              backgroundColor={bgImgColor}></Div>
          )}
          <Row itemsCenter justifyCenter width={DEVICE_WIDTH} absolute>
            <Animated.View style={titleStyles}>
              <Span
                bold
                fontSize={19}
                style={{
                  ...(Platform.OS === 'android' && {marginVertical: -5}),
                }}>
                {(nftCollection || nftCollectionCore).name}
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
          top={notchHeight + 5}>
          <Col auto bg={Colors.black} p5 rounded100 mr12 onPress={goBack}>
            <Div>
              <ChevronLeft
                width={20}
                height={20}
                color={Colors.white}
                strokeWidth={2.4}
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
        style={{
          marginTop: -30,
          ...(Platform.OS === 'android' && {paddingTop: 30}),
        }}
        data={nftCollectionPostListRes?.posts || []}
        ListEmptyComponent={
          !nftCollectionPostListLoading && <ListEmptyComponent h={450} />
        }
        ListHeaderComponent={
          <>
            <Row zIndex={100} px15 relative>
              <Div absolute bottom0 w={DEVICE_WIDTH} bgWhite h={48}></Div>
              <Col
                auto
                mr10
                relative
                onPress={() => {
                  if (nftCollection || nftCollectionCore)
                    expandImageViewer(
                      [
                        {
                          uri: getNftProfileImage(
                            nftCollection || nftCollectionCore,
                          ),
                        },
                      ],
                      0,
                    );
                }}>
                <Img
                  rounded100
                  border4
                  borderWhite
                  bgGray200
                  h75
                  w75
                  uri={getNftProfileImage(
                    nftCollection || nftCollectionCore,
                    400,
                    400,
                  )}></Img>
              </Col>
              <Col justifyEnd>
                {!isAdmin &&
                nftCollectionCore.contract_address !=
                  currentNft.contract_address ? (
                  <Div>
                    <Row py8>
                      <Col />
                      {isBlocked ? (
                        <Col
                          auto
                          bgWhite
                          p8
                          rounded100
                          border1
                          borderDanger
                          onPress={handlePressBlock}>
                          <Span danger bold px5>
                            차단 해제
                          </Span>
                        </Col>
                      ) : (
                        <Col
                          auto
                          bgBlack={!isFollowing}
                          p8
                          rounded100
                          border1={isFollowing}
                          borderGray200
                          onPress={handlePressFollowing}>
                          <Span white={!isFollowing} bold px5 fontSize={14}>
                            {!nftCollection
                              ? '불러오는 중'
                              : isFollowing
                              ? '팔로잉'
                              : '팔로우'}
                          </Span>
                        </Col>
                      )}
                    </Row>
                  </Div>
                ) : (
                  isAdmin && (
                    <Div>
                      <Row py10>
                        <Col />
                        <Col
                          auto
                          p6
                          rounded100
                          border={0.5}
                          borderGray200
                          onPress={gotoNftCollectionProfileEdit}>
                          <Span bold px5 fontSize={13}>
                            프로필 편집
                          </Span>
                        </Col>
                      </Row>
                    </Div>
                  )
                )}
              </Col>
            </Row>
            <Div px15 bgWhite borderBottom={0.5} borderGray200 pb8>
              <Div>
                <Span fontSize={20} bold>
                  {(nftCollection || nftCollectionCore).name}{' '}
                  <Img source={ICONS.sealCheck} h18 w18></Img>
                </Span>
              </Div>
              {nftCollection && (
                <>
                  {nftCollection.about ? (
                    <Div mt16>
                      <TruncatedMarkdown
                        text={nftCollection.about}
                        maxLength={500}
                      />
                    </Div>
                  ) : null}
                  <Row mt12>
                    <Col
                      auto
                      mr12
                      onPress={() => gotoFollowList(FollowType.Followers)}>
                      <Span bold fontSize={13}>
                        <Span gray700 regular fontSize={13}>
                          팔로워
                        </Span>{' '}
                        {followerCount}
                      </Span>
                    </Col>
                    <Col auto mr12 onPress={handlePressContribution}>
                      <Span bold fontSize={13}>
                        <Span gray700 regular fontSize={13}>
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
                    <Row mt10 itemsCenter onPress={gotoCollectionSearch}>
                      <Col auto>
                        <AdminProfiles admin={nftCollection.admin_nfts} />
                      </Col>
                      <Col auto>
                        <AdminNames admin={nftCollection.admin_nfts} />
                      </Col>
                      <Col />
                    </Row>
                  )}
                </>
              )}
            </Div>
          </>
        }
        renderItem={({item}) => (
          <Post post={item} displayLabel isProfile={true} />
        )}
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
                <Span textCenter bold>
                  게시물을 모두 확인했습니다.
                </Span>
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
