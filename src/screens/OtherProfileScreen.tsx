import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import NftProfile from 'src/components/common/NftProfile';

const OtherProfileScreen = ({
  route: {
    params: {nft},
  },
}) => {
  const pageableNftPostFn = (page?) => {
    return apis.post.list.nft(nft.contract_address, nft.token_id, page);
  };
  return (
    <Div flex={1} bgWhite overflowHidden>
      <NftProfile
        nftCore={nft}
        nftProfileApiObject={apis.nft.contractAddressAndTokenId(
          nft.contract_address,
          nft.token_id,
        )}
        pageableNftPostFn={pageableNftPostFn}
      />
    </Div>
  );
};

export default OtherProfileScreen;
