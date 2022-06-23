import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import NftCollectionProfile from 'src/components/common/NftCollectionProfile';
import {useIsAdmin} from 'src/utils/nftUtils';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {PostOwnerType} from './NewPostScreen';
import {Plus} from 'react-native-feather';
import {Colors} from 'src/modules/styles';

const NftCollectionScreen = ({
  route: {
    params: {nftCollection},
  },
}) => {
  const isAdmin = useIsAdmin(nftCollection);
  const pageableNftCollectionPostFn = (page?) => {
    return apis.post.list.nftCollection(nftCollection.contract_address, page);
  };
  const gotoNewPost = useGotoNewPost({
    postOwnerType: PostOwnerType.NftCollection,
  });
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
      {isAdmin && (
        <Div
          rounded100
          bgPrimary
          zIndex={200}
          absolute
          w54
          h54
          p12
          bottom55
          right15
          onPress={() => gotoNewPost()}
          style={{
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
          }}>
          <Plus
            strokeWidth={2}
            color={Colors.white}
            height={30}
            width={30}></Plus>
        </Div>
      )}
    </Div>
  );
};

export default NftCollectionScreen;
