import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import NftCollectionProfile from 'src/components/common/NftCollectionProfile';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsAdmin} from 'src/modules/nftUtils';
import BottomPopup from 'src/components/common/BottomPopup';
import NftCollectionProfileEditBottomSheetScrollView from 'src/components/common/NftCollectionProfileEditBottomSheetScrollView';

const NftCollectionScreen = ({
  route: {
    params: {nftCollection},
  },
}) => {
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const isAdmin = useIsAdmin(nftCollection);
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  const pageableNftCollectionPostFn = (page?) => {
    return apis.post.list.nftCollection(nftCollection.contract_address, page);
  };
  return (
    <Div flex={1} bgWhite relative>
      <NftCollectionProfile
        nftCollectionCore={nftCollection}
        nftCollectionProfileApiObject={apis.nft_collection.contractAddress.profile(
          nftCollection.contract_address,
        )}
        pageableNftCollectionPostFn={pageableNftCollectionPostFn}
        isAdmin={isAdmin}
        onPressEditProfile={editProfile}
      />
      {isAdmin && (
        <BottomPopup ref={bottomPopupRef} snapPoints={['90%']} index={-1}>
          <NftCollectionProfileEditBottomSheetScrollView
            nftCollection={nftCollection}
          />
        </BottomPopup>
      )}
    </Div>
  );
};

export default NftCollectionScreen;
