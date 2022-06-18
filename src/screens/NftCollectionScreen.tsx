import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import NftCollectionProfile from 'src/components/common/NftCollectionProfile';
import {useIsAdmin} from 'src/modules/nftUtils';

const NftCollectionScreen = ({
  route: {
    params: {nftCollection},
  },
}) => {
  const isAdmin = useIsAdmin(nftCollection);
  const pageableNftCollectionPostFn = (page?) => {
    return apis.post.list.nftCollection(nftCollection.contract_address, page);
  };
  return (
    <Div flex={1} bgWhite relative overflowHidden>
      <NftCollectionProfile
        nftCollectionCore={nftCollection}
        nftCollectionProfileApiObject={apis.nft_collection.contractAddress._(
          nftCollection.contract_address,
        )}
        pageableNftCollectionPostFn={pageableNftCollectionPostFn}
        isAdmin={isAdmin}
      />
    </Div>
  );
};

export default NftCollectionScreen;
