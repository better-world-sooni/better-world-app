import {ChevronLeft} from 'react-native-feather';
import React, {useRef} from 'react';
import {getNftName, useIsCurrentNft} from 'src/modules/nftUtils';
import {Col} from './Col';
import {Div} from './Div';
import {Row} from './Row';
import {Span} from './Span';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RefreshControl, Platform} from 'react-native';
import Post from './Post';
import {DEVICE_WIDTH} from 'src/modules/styles';
import BottomPopup from './BottomPopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import NftProfileEditBottomSheetScrollView from './NftProfileEditBottomSheetScrollView';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import NftProfileHeader from './NftProfileHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

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
  // const [statusBarColor, setStatusBarColor] = useState()
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const bottomPopupRef = useRef<BottomSheetModal>(null);
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
  const renderItem = ({item}) => <Post post={item} />;

  return (
    <>
      <Div h={headerHeight}>
        {nft?.background_image_uri ? (
          <Animated.Image
            style={backgroundImageStyles}
            source={{uri: nft.background_image_uri}}></Animated.Image>
        ) : (
          <Div absolute top0 h={headerHeight} bgGray400 w={DEVICE_WIDTH}></Div>
        )}
        <Animated.View style={headerStyles}>
          <CustomBlurView
            blurType="light"
            blurAmount={20}
            blurRadius={10}
            overlayColor=""
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></CustomBlurView>
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
        <Row itemsCenter py5 h40 zIndex={100} absolute top={notchHeight + 5}>
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
        style={{
          marginTop: -30,
          ...(Platform.OS === 'android' && {paddingTop: 30}),
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        data={nftPostListRes?.posts || []}
        onEndReached={handleEndReached}
        keyExtractor={keyExtractor}
        initialNumToRender={5}
        removeClippedSubviews
        updateCellsBatchingPeriod={100}
        windowSize={11}
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
            <Div h={27} />
          </>
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }></Animated.FlatList>
      {isCurrentNft && nft && (
        <BottomPopup ref={bottomPopupRef} snapPoints={['90%']} index={-1}>
          <NftProfileEditBottomSheetScrollView nft={nft} />
        </BottomPopup>
      )}
    </>
  );
}
