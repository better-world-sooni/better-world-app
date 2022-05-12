import React from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl, StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, PlusSquare} from 'react-native-feather';
import {Span} from 'src/components/common/Span';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {ScrollView} from 'src/modules/viewComponents';
import NftProfile from 'src/components/common/NftProfile';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';

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
    <Div flex bgWhite>
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
            refreshing={loading}
            onRefresh={handleRefresh}
          />
        </>
      )}
    </Div>
  );
};

export default OtherProfileScreen;
