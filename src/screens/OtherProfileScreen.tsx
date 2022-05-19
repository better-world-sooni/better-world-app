import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import NftProfile from 'src/components/common/NftProfile';

const OtherProfileScreen = ({
  route: {
    params: {contractAddress, tokenId},
  },
}) => {
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft.contractAddressAndTokenId(contractAddress, tokenId),
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(
      apis.nft.contractAddressAndTokenId(contractAddress, tokenId),
    );
  };
  const nft = profileData?.nft;
  return (
    <Div flex={1} bgWhite>
      {nft && (
        <NftProfile nft={nft} refreshing={loading} onRefresh={handleRefresh} />
      )}
    </Div>
  );
};

export default OtherProfileScreen;
