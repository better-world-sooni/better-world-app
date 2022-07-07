import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {Colors, DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Col} from 'src/components/common/Col';
import {Row} from 'src/components/common/Row';
import {FlatList, ImageBackground} from 'src/components/common/ViewComponents';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {HAS_NOTCH} from 'src/modules/constants';
import Merchandise from 'src/components/common/Merchandise';
import {Clock, Gift} from 'react-native-feather';
import {useGotoCouponList, useGotoOrderList} from 'src/hooks/useGoto';

export default function StoreScreen() {
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.nft_collection.merchandise.list);
  const {data: nftCollectionRes, isLoading: nftCollectionLoad} = useApiSelector(
    apis.nft_collection._(),
  );
  const nftCollection = nftCollectionRes?.nft_collection;
  const merchandises = data ? data.merchandises : [];
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.nft_collection.merchandise.list(page + 1),
      'merchandises',
    );
  };
  const handleRefresh = () => {
    reloadGetWithToken(apis.nft_collection.merchandise.list());
  };
  const gotoOrderList = useGotoOrderList();
  const gotoCouponList = useGotoCouponList();
  const paddingX = 7;
  const mx = 8;
  const my = 8;
  const numColumns = 2;
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  return (
    <Div flex={1} bgWhite>
      <Div h={notchHeight}></Div>
      <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40 px15>
          <Col auto>
            <Span bold fontSize={19}>
              {'굿즈 드랍'}
            </Span>
          </Col>
          <Col />
          <Col auto mr16 onPress={gotoOrderList}>
            <Clock
              width={22}
              height={22}
              color={Colors.black}
              strokeWidth={2}
            />
          </Col>
          <Col auto onPress={gotoCouponList}>
            <Gift width={22} height={22} color={Colors.black} strokeWidth={2} />
          </Col>
        </Row>
      </Div>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={item => (item as any).id}
        contentContainerStyle={{paddingRight: paddingX, paddingLeft: paddingX}}
        numColumns={2}
        ListHeaderComponent={
          <ImageBackground
            source={{uri: nftCollection?.background_image_uri}}
            style={{
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
              backgroundColor: Colors.primary.DEFAULT,
            }}
            h80
            wFull
            my12
            rounded10
            overflowHidden>
            <Div wFull h80 bgBlack opacity={0.75}></Div>
            <Div absolute top0 wFull h80 px16 py8 justifyCenter>
              <Span white bold>
                정식 베터월드 드랍 샵을 기대해주세요!
              </Span>
            </Div>
          </ImageBackground>
        }
        ListEmptyComponent={
          !isLoading && (
            <ListEmptyComponent h={DEVICE_HEIGHT - headerHeight * 2} />
          )
        }
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
        onEndReached={handleEndReached}
        data={merchandises}
        renderItem={({item}) => {
          return (
            <Merchandise
              key={(item as any).id}
              merchandise={item}
              mx={mx}
              my={my}
              width={
                (DEVICE_WIDTH - paddingX * numColumns - mx * numColumns * 2) / 2
              }
            />
          );
        }}
        ListFooterComponent={
          <>
            {isPaginating && (
              <Div itemsCenter py15>
                <ActivityIndicator />
              </Div>
            )}
            <Div h={HAS_NOTCH ? 27 : 12} />
          </>
        }></FlatList>
    </Div>
  );
}
