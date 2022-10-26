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
        nftCollectionProfileApiObject={
          currentNft.contract_address == nftCollection.contract_address
            ? apis.nft_collection._()
            : apis.nft_collection.contractAddress._(
                nftCollection.contract_address,
              )
        }
        pageableNftCollectionPostFn={pageableNftCollectionPostFn}
        isAdmin={isAdmin}
      />
      {isAdmin && (
        <Div
          rounded100
          bgBlack
          absolute
          w54
          h54
          justifyCenter
          itemsCenter
          bottom55
          overflowHidden
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
          <Div absolute>
            <GradientColorRect width={100} height={100} />
          </Div>
          <Plus
            strokeWidth={2}
            color={Colors.white}
            height={28}
            width={28}></Plus>
        </Div>
      )}
    </Div>
  );
};

export default NftCollectionScreen;
