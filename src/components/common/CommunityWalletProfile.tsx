import React, {useState} from 'react';
import {Div} from './Div';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {HAS_NOTCH} from 'src/modules/constants';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Transaction from './Transaction';
import CommunityWalletTopBar from './CommunityWalletTopBar';
import {FlatList} from './ViewComponents';

export default function CommunityWalletProfile({
  communityWalletCore,
  communityWalletApiObject,
  pageableTransactionListFn,
}) {
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
      <Div h={notchHeight} />
      <FlatList
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => (item as any).transaction_hash}
        ListHeaderComponent={
          <Div
            bgWhite
            px8
            h={50}
            justifyCenter
            borderBottom={0.5}
            borderGray200>
            <Div>
              <CommunityWalletTopBar communityWallet={communityWallet} />
            </Div>
          </Div>
        }
        refreshControl={
          <RefreshControl
            refreshing={transactionListLoading}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleEndReached}
        data={transactionListRes?.transactions || []}
        renderItem={({item}) => (
          <Transaction
            transaction={item}
            mainAddress={communityWalletCore.address}
          />
        )}
        ListFooterComponent={
          <>
            {transactionListPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }></FlatList>
    </Div>
  );
}
