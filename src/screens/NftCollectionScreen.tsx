import React, {useRef} from 'react';
import {Div} from 'src/components/common/Div';
import {HAS_NOTCH} from 'src/modules/constants';
import {RefreshControl, StatusBar} from 'react-native';
import {Row} from 'src/components/common/Row';
import {Col} from 'src/components/common/Col';
import {ChevronLeft, PlusSquare} from 'react-native-feather';
import apis from 'src/modules/apis';
import {useApiSelector, useReloadGETWithToken} from 'src/redux/asyncReducer';
import {FlatList, ScrollView} from 'src/modules/viewComponents';
import NftCollectionProfile from 'src/components/common/NftCollectionProfile';
import {Img} from 'src/components/common/Img';
import {DEVICE_WIDTH} from 'src/modules/styles';
import {useNavigation} from '@react-navigation/native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useIsAdmin} from 'src/modules/nftUtils';
import BottomPopup from 'src/components/common/BottomPopup';
import NftCollectionProfileEditBottomSheetScrollView from 'src/components/common/NftCollectionProfileEditBottomSheetScrollView';

const NftCollectionScreen = ({
  route: {
    params: {contractAddress},
  },
}) => {
  const {goBack} = useNavigation();
  const {data: profileData, isLoading: loading} = useApiSelector(
    apis.nft_collection.contractAddress.profile(contractAddress),
  );
  const bottomPopupRef = useRef<BottomSheetModal>(null);
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    reloadGetWithToken(
      apis.nft_collection.contractAddress.profile(contractAddress),
    );
  };
  const nftCollection = profileData?.nft_collection;
  const isAdmin = useIsAdmin(nftCollection);
  const editProfile = () => {
    bottomPopupRef?.current?.expand();
  };
  return (
    <Div flex bgWhite relative>
      {nftCollection && (
        <>
          {nftCollection.background_image_uri ? (
            <Img
              zIndex={-10}
              uri={nftCollection.background_image_uri}
              absolute
              top0
              w={DEVICE_WIDTH}
              h200></Img>
          ) : (
            <Div absolute top0 h200 bgGray400 w={DEVICE_WIDTH}></Div>
          )}
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
                </Row>
              </Div>
            }
            renderItem={({item}) => (
              <NftCollectionProfile
                nftCollection={item}
                isAdmin={isAdmin}
                onPressEditProfile={editProfile}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }></FlatList>
        </>
      )}
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
