import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {useIsAdmin} from 'src/modules/nftUtils';
import CommunityWalletProfile from 'src/components/common/CommunityWalletProfile';

export default function CommunityWalletProfileScreen({
  route: {
    params: {communityWallet},
  },
}) {
  const isAdmin = useIsAdmin(communityWallet.nft_collection);
  const pageableTransactionListFn = (cursor?) => {
    return apis.community_wallet.address.transaction.list(
      communityWallet.address,
      cursor,
    );
  };
  return (
    <Div flex={1} bgWhite relative overflowHidden>
      <CommunityWalletProfile
        communityWalletCore={communityWallet}
        communityWalletApiObject={apis.community_wallet.address._(
          communityWallet.address,
        )}
        pageableTransactionListFn={pageableTransactionListFn}
        isAdmin={isAdmin}
      />
    </Div>
  );
}
