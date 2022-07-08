import {ChevronLeft, MoreHorizontal} from 'react-native-feather';
import React, {useEffect, useState} from 'react';
import {getNftName, useIsCurrentNft} from 'src/utils/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Row} from './Row';
import {Span} from './Span';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RefreshControl, Platform} from 'react-native';
import Post from './Post';
import {Colors, DEVICE_WIDTH} from 'src/modules/styles';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import NftProfileHeader from './NftProfileHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageColors from 'react-native-image-colors';
import ListEmptyComponent from './ListEmptyComponent';
import FocusAwareStatusBar from 'src/components/FocusAwareStatusBar';
import {BlurView} from '@react-native-community/blur';
import useFollow from 'src/hooks/useFollow';
import {MenuView} from '@react-native-menu/menu';

export default function NftProfile({
  nftCore,
  enableBack = true,
  qrScan = false,
  nftProfileApiObject,
  pageableNftPostFn,
}) {
  const {data: profileData, isLoading: refreshing} =
    useApiSelector(nftProfileApiObject);
  const {
    data: nftPostListRes,
    isLoading: nftPostListLoading,
    isPaginating: nftPostListPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(pageableNftPostFn());
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (nftPostListPaginating || isNotPaginatable) return;
    paginateGetWithToken(pageableNftPostFn(page + 1), 'posts');
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(nftProfileApiObject);
    reloadGetWithToken(pageableNftPostFn());
  };
  const nft = profileData?.nft;
  const [bgImgColor, setBgImgColor] = useState(Colors.gray[400]);
  const {
    isFollowing,
    followerCount,
    handlePressFollowing,
    isBlocked,
    handlePressBlock,
  } = useFollow(
    nft?.is_following,
    nft?.follower_count,
    nft?.contract_address,
    nft?.token_id,
  );
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const isCurrentNft = useIsCurrentNft(nftCore);
  const keyExtractor = item => (item as any).id;
  const {goBack} = useNavigation();
  const notchHeight = useSafeAreaInsets().top;
  //After scroll down height : 80 - 30 = 50 (homescreen header same)
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
  const menuOptions = [
    {
      id: 'block',
      title: isBlocked ? '차단 해제' : '차단',
      image: Platform.select({
        ios: 'flag',
        android: 'stat_sys_warning',
      }),
    },
  ];
  const handlePressMenu = ({nativeEvent: {event}}) => {
    handlePressBlock();
  };
  const renderItem = ({item}) => <Post post={item} displayLabel />;

  useEffect(() => {
    if (nft?.background_image_uri) {
      ImageColors.getColors(nft.background_image_uri, {
        fallback: '#228B22',
        cache: true,
        key: nft.background_image_uri,
      }).then(colors => {
        setBgImgColor(colors['average']);
      });
    }
    else {
      setBgImgColor(Colors.gray[400]);
    }
  }, [nft, bgImgColor, setBgImgColor]);

  return (
    <>
      {Platform.OS === 'android' && (
        <FocusAwareStatusBar
          barStyle="dark-content"
          backgroundColor={bgImgColor}
        />
      )}
      <Div h={headerHeight}>
        {nft?.background_image_uri ? (
          <Animated.Image
            style={backgroundImageStyles}
            source={{uri: nft.background_image_uri}}></Animated.Image>
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
          top={notchHeight + 5}
          w={DEVICE_WIDTH}>
          {enableBack && (
            <Col auto ml15 bgBlack p5 rounded100 onPress={goBack}>
              <ChevronLeft
                width={20}
                height={20}
                color={Colors.white}
                strokeWidth={2.4}
              />
            </Col>
          )}
          <Col></Col>
          {!isCurrentNft && (
            <Col auto mr15 bgBlack p5 rounded100>
              <MenuView onPressAction={handlePressMenu} actions={menuOptions}>
                <MoreHorizontal
                  width={20}
                  height={20}
                  color={Colors.white}
                  strokeWidth={2.4}
                />
              </MenuView>
            </Col>
          )}
        </Row>
      </Div>
      <Animated.FlatList
        bounces
        style={{
          marginTop: -30,
          ...(Platform.OS === 'android' && {paddingTop: 30}),
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        data={nftPostListRes && !isBlocked ? nftPostListRes?.posts : []}
        onEndReached={handleEndReached}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        removeClippedSubviews
        updateCellsBatchingPeriod={100}
        windowSize={11}
        ListEmptyComponent={
          !nftPostListLoading && <ListEmptyComponent h={450} />
        }
        ListHeaderComponent={
          <NftProfileHeader
            nftCore={nftCore}
            nft={nft}
            isCurrentNft={isCurrentNft}
            qrScan={qrScan}
          />
        }
        ListFooterComponent={
          <>
            {(nftPostListPaginating || nftPostListLoading) && (
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
            <Div h={27} />
          </>
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }></Animated.FlatList>
    </>
  );
}
