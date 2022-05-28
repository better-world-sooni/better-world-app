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
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id),
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(
      apis.nft.contractAddressAndTokenId(nft.contract_address, nft.token_id),
    );
  };
  const nftProfile = profileData?.nft;
  return (
    <Div flex={1} bgWhite>
      {nft && (
        <NftProfile
          nft={nftProfile}
          nftCore={nft}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
      )}
    </Div>
  );
};

export default OtherProfileScreen;
