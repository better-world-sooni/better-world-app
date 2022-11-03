import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import NftCollectionProfile from 'src/components/common/NftCollectionProfile';
import {useIsAdmin} from 'src/utils/nftUtils';
import {useGotoNewPost} from 'src/hooks/useGoto';
import {PostOwnerType, PostType} from './NewPostScreen';
import {Plus} from 'react-native-feather';
import {Colors} from 'src/modules/styles';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';
import {Img} from 'src/components/common/Img';
import {ICONS} from 'src/modules/icons';
import GradientColorRect from 'src/components/common/GradientColorRect';

const NftCollectionScreen = ({
  route: {
    params: {nftCollection},
  },
}) => {
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const isAdmin = useIsAdmin(nftCollection);
  const pageableNftCollectionDrawEventFn = (page?) => {
    return apis.feed.draw_event.nftCollection(
      nftCollection.contract_address,
      page,
    );
  };
  return (
    <Div flex={1} bgWhite relative overflowHidden>
      <NftCollectionProfile
        nftCollectionCore={nftCollection}
        nftCollectionProfileApiObject={
          currentNft.contract_address == nftCollection.contract_address
            ? apis.nft_collection._()
            : apis.nft_collection.contractAddress._(
                nftCollection.contract_address,
              )
        }
        pageableNftCollectionDrawEventFn={pageableNftCollectionDrawEventFn}
        isAdmin={isAdmin}
      />
    </Div>
  );
};

export default NftCollectionScreen;
