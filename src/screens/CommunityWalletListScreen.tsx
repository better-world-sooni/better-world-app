import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import CommunityWallet from 'src/components/common/CommunityWallet';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useGotoNewCommunityWallet} from 'src/hooks/useGoto';
import {useIsAdmin} from 'src/modules/nftUtils';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';

export default function CommunityWalletListScreen() {
  const {
    data: communityWalletsRes,
    isLoading: communityWalletsLoading,
    isPaginating: communityWalletsPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.nft_collection.communityWallet.list);
  const communityWallets = communityWalletsRes?.community_wallets || [];
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const gotoNewCommunityWallet = useGotoNewCommunityWallet();
  const handleRefresh = () => {
    if (communityWalletsLoading) return;
    reloadGetWithToken(apis.nft_collection.communityWallet.list());
  };
  const handleEndReached = () => {
    if (communityWalletsLoading || isNotPaginatable) return;
    paginateGetWithToken(
      apis.nft_collection.communityWallet.list(page + 1),
      'community_wallets',
    );
  };
  const isAdmin = useIsAdmin();
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={communityWallets}
      refreshing={communityWalletsLoading}
      onEndReached={handleEndReached}
      isPaginating={communityWalletsPaginating}
      HeaderRightComponent={
        isAdmin && (
          <Div onPress={gotoNewCommunityWallet}>
            <Span info bold fontSize={14}>
              추가
            </Span>
          </Div>
        )
      }
      title={'커뮤니티 지갑'}
      renderItem={({item}) => (
        <CommunityWallet
          communityWallet={item}
          width={DEVICE_WIDTH}
          verticalList
        />
      )}
    />
  );
}
