import React, {useRef, useState} from 'react';
import {Div} from './Div';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {HAS_NOTCH} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {CustomBlurView} from 'src/components/common/CustomBlurView';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import Transaction from './Transaction';
import CommunityWalletHeader from './CommunityWalletHeader';
import CommunityWalletTopBar from './CommunityWalletTopBar';

export default function CommunityWalletProfile({
  communityWalletCore,
  communityWalletApiObject,
  pageableTransactionListFn,
}) {
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const {data: communityWalletRes, isLoading: communityWalletLoading} =
    useApiSelector(communityWalletApiObject);
  const {
    data: transactionListRes,
    isLoading: transactionListLoading,
    isPaginating: transactionListPaginating,
  } = useApiSelector(pageableTransactionListFn());
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(communityWalletApiObject);
    reloadGetWithToken(pageableTransactionListFn());
  };
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (transactionListPaginating || !transactionListRes?.cursor) return;
    paginateGetWithToken(
      pageableTransactionListFn(transactionListRes.cursor),
      'transactions',
    );
  };
  const communityWallet =
    communityWalletRes?.community_wallet || communityWalletCore;
  const {goBack} = useNavigation();
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;
  const headerStyles = useAnimatedStyle(() => {
    return {
      width: DEVICE_WIDTH,
      height: headerHeight,
      opacity: Math.min(translationY.value / 50, 1),
    };
  });
  return (
    <Div flex={1} bgWhite>
      <Div h={headerHeight} zIndex={100} absolute top0>
        <Animated.View style={headerStyles}>
          <CustomBlurView
            blurType="xlight"
            blurAmount={30}
            blurRadius={20}
            overlayColor=""
            style={{
              width: DEVICE_WIDTH,
              height: '100%',
              position: 'absolute',
            }}
            reducedTransparencyFallbackColor="white"></CustomBlurView>
        </Animated.View>
        <Div zIndex={100} absolute w={DEVICE_WIDTH} top={notchHeight}>
          <CommunityWalletTopBar
            communityWallet={communityWallet}
            onPressDown={() => setIsAboutOpen(prev => !prev)}
          />
        </Div>
      </Div>
      <Animated.FlatList
        automaticallyAdjustContentInsets
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        keyExtractor={item => (item as any).transaction_hash}
        initialNumToRender={10}
        removeClippedSubviews
        updateCellsBatchingPeriod={100}
        windowSize={11}
        contentContainerStyle={{
          marginTop: headerHeight,
          marginBottom: headerHeight,
        }}
        refreshControl={
          <RefreshControl
            refreshing={transactionListLoading}
            onRefresh={handleRefresh}
            progressViewOffset={headerHeight}
          />
        }
        onEndReached={handleEndReached}
        data={transactionListRes?.transactions || []}
        renderItem={({item}) => <Transaction transaction={item} />}
        ListHeaderComponent={
          isAboutOpen && (
            <CommunityWalletHeader
              communityWallet={communityWallet || communityWalletCore}
            />
          )
        }
        ListFooterComponent={
          <>
            {transactionListPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            <Div h={headerHeight}></Div>
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }></Animated.FlatList>
    </Div>
  );
}
