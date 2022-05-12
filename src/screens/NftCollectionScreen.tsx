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
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import NftProfile from 'src/components/common/NftProfile';
import NftCollectionProfile from 'src/components/common/NftCollectionProfile';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useNavigation} from '@react-navigation/native';

const NftCollectionScreen = ({
  route: {
    params: {contractAddress},
  },
}) => {
  const {goBack} = useNavigation();
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft_collection.contractAddress.profile(contractAddress),
  );
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(
      apis.nft_collection.contractAddress.profile(contractAddress),
    );
  };
  const nftCollection = profileData?.nft_collection;
  return (
    <Div flex bgWhite relative>
      {nftCollection && (
        <>
          <Img
            zIndex={-10}
            uri={nftCollection.background_image_uri}
            absolute
            bgPrimary={!nftCollection.background_image_uri}
            top0
            w={DEVICE_WIDTH}
            h200></Img>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[nftCollection]}
            ListHeaderComponent={
              <Div w={'100%'} zIndex={100} h170>
                <Div h={HAS_NOTCH ? 44 : 20} />
                <Row itemsCenter py8 zIndex={100}>
                  <Col auto ml15 bgBlack p5 rounded100 onPress={goBack}>
                    <ChevronLeft
                      width={20}
                      height={20}
                      color="white"
                      strokeWidth={3}
                    />
                  </Col>
                  <Col ml10></Col>
                  <Col auto mr15 bgBlack p8 rounded100>
                    <Div>
                      <PlusSquare
                        strokeWidth={2}
                        color={'white'}
                        height={20}
                        width={20}
                      />
                    </Div>
                  </Col>
                </Row>
              </Div>
            }
            renderItem={({item}) => (
              <NftCollectionProfile nftCollection={item} />
            )}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }></FlatList>
        </>
      )}
    </Div>
  );
};

export default NftCollectionScreen;
