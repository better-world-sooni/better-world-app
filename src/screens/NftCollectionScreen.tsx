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
import NftCollectionProfile from 'src/components/common/NftCollectionProfile';

const NftCollectionScreen = ({
  route: {
    params: {contractAddress},
  },
}) => {
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft_collection.contractAddress.profile(contractAddress),
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(apis.nft_collection.contractAddress._(contractAddress));
  };
  const nftCollection = profileData?.nft_collection;
  console.log(nftCollection);
  return (
    <Div flex bgPrimary>
      <StatusBar animated={true} barStyle={'dark-content'} />
      <Div h={HAS_NOTCH ? 44 : 20} bgPrimary />
      <Row itemsCenter py8>
        <Col auto ml15>
          <ChevronLeft width={20} height={20} color="white" strokeWidth={3} />
        </Col>
        <Col ml10>
          <Span fontSize={24} bold white fontFamily={'UniSans'}>
            BetterWorld
          </Span>
        </Col>
        <Col auto mr15>
          <Div>
            <PlusSquare
              strokeWidth={2}
              color={'white'}
              height={22}
              width={22}
            />
          </Div>
        </Col>
      </Row>
      <Div></Div>
      {nftCollection && (
        <ScrollView
          bgWhite
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }>
          <NftCollectionProfile nftCollection={nftCollection} />
        </ScrollView>
      )}
    </Div>
  );
};

export default NftCollectionScreen;
