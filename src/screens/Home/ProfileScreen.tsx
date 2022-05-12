import React, {useState} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl, StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {PlusSquare, Edit} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import {ScrollView} from 'src/modules/viewComponents';
import {Img} from 'src/components/common/Img';
import {getNftName, getNftProfileImage} from 'src/modules/nftUtils';
import NftProfile from 'src/components/common/NftProfile';
import {DEVICE_WIDTH} from 'src/modules/styles';

const ProfileScreen = ({route: {params}}) => {
  const {data: profileData, isLoading: loading} = useApiSelector(apis.nft._);
  const reloadGetWithToken = useReloadGETWithToken();
  const handleRefresh = () => {
    reloadGetWithToken(apis.nft._());
  };
  const nft = profileData?.nft;
  return (
    <Div flex bgWhite relative>
      {nft && (
        <>
          <Img
            uri={nft.background_image_uri}
            absolute
            bgPrimary={!nft.background_image_uri}
            top0
            w={DEVICE_WIDTH}
            h200></Img>
          <NftProfile
            nft={nft}
            enableBack={false}
            refreshing={loading}
            onRefresh={handleRefresh}
          />
        </>
      )}
    </Div>
  );
};
export default ProfileScreen;
