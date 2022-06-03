import {ChevronLeft} from 'react-native-feather';
import React, {useRef} from 'react';
import {getNftName, useIsCurrentNft} from 'src/modules/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Img} from './Img';
import {Row} from './Row';
import {Span} from './Span';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RefreshControl} from 'react-native';
import Post from './Post';
import {HAS_NOTCH} from 'src/modules/constants';
import {DEVICE_WIDTH} from 'src/modules/styles';
import BottomPopup from './BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import NftProfileEditBottomSheetScrollView from './NftProfileEditBottomSheetScrollView';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import NftProfileHeader from './NftProfileHeader';

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
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const isCurrentNft = useIsCurrentNft(nftCore);
  const {goBack} = useNavigation();
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
        data={nftPostListRes?.posts || []}
        onEndReached={handleEndReached}
        ListHeaderComponent={
          <NftProfileHeader
            nftCore={nftCore}
            nft={nft}
            isCurrentNft={isCurrentNft}
            bottomPopupRef={bottomPopupRef}
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
                <Span textCenter>게시물을 모두 확인했습니다.</Span>
              </Div>
            )}
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }
        renderItem={({item}) => <Post post={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }></Animated.FlatList>
      {isCurrentNft && qrScan && (
        <BottomPopup ref={bottomPopupRef} snapPoints={['90%']} index={-1}>
          <NftProfileEditBottomSheetScrollView nft={nftCore} />
        </BottomPopup>
      )}
    </>
  );
}
