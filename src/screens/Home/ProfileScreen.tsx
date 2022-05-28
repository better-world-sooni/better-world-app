import React from 'react';
import {Div} from 'src/components/common/Div';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import NftProfile from 'src/components/common/NftProfile';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from 'src/redux/rootReducer';

const ProfileScreen = ({route: {params}}) => {
  const {data: profileData, isLoading: loading} = useApiSelector(apis.nft._);
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(apis.nft._());
  };
  const {currentNft} = useSelector(
    (root: RootState) => root.app.session,
    shallowEqual,
  );
  const nft = profileData?.nft;
  return (
    <Div flex={1} bgWhite>
      {nft && (
        <NftProfile
          qrScan
          nftCore={currentNft}
          nft={nft}
          enableBack={false}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
      )}
    </Div>
  );
};
export default ProfileScreen;
