import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
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
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft_collection.contractAddress.profile(nftCollection.contract_address),
  );
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(
      apis.nft_collection.contractAddress.profile(
        nftCollection.contract_address,
      ),
    );
  };
  const nftCollectionProfile = profileData?.nft_collection;
  const isAdmin = useIsAdmin(nftCollection);
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };

  return (
    <Div flex={1} bgWhite relative>
      <NftCollectionProfile
        nftCollectionCore={nftCollection}
        nftCollection={nftCollectionProfile}
        onRefresh={onRefresh}
        refreshing={loading}
        isAdmin={isAdmin}
        onPressEditProfile={editProfile}
      />
      {isAdmin && nftCollectionProfile && (
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
