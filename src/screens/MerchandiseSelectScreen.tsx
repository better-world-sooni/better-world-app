import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {Div} from 'src/components/common/Div';
import {Span} from 'src/components/common/Span';
import {DEVICE_HEIGHT, DEVICE_WIDTH} from 'src/modules/styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Col} from 'src/components/common/Col';
import {Row} from 'src/components/common/Row';
import {FlatList} from 'src/components/common/ViewComponents';
import ListEmptyComponent from 'src/components/common/ListEmptyComponent';
import {ActivityIndicator, RefreshControl} from 'react-native';
import {HAS_NOTCH} from 'src/modules/constants';
import Merchandise from 'src/components/common/Merchandise';
import {useNavigation} from '@react-navigation/native';
import {X} from 'react-native-feather';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function MerchandiseSelectScreen({
  route: {
    params: {onCancel = null, onConfirm = null},
  },
}) {
  const {goBack} = useNavigation();
  const handleCancel = () => {
    if (onCancel) onCancel();
    goBack();
  };
  const handleConfirm = merchandise => {
    if (onConfirm) onConfirm(merchandise);
    goBack();
  };
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.nft_collection.merchandise.list);
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
  const paddingX = 7;
  const mx = 8;
  const my = 8;
  const numColumns = 2;
  const notchHeight = useSafeAreaInsets().top;
  const headerHeight = notchHeight + 50;

  return (
    <Div flex={1} bgWhite>
      <Div bgWhite h={50} justifyCenter borderBottom={0.5} borderGray200>
        <Row itemsCenter py5 h40 px15>
          <Col onPress={handleCancel}>
            <X width={30} height={30} color={Colors.black} strokeWidth={2} />
          </Col>
          <Col auto>
            <Span bold fontSize={19}>
              {'굿즈 선택하기'}
            </Span>
          </Col>
          <Col></Col>
        </Row>
      </Div>
      <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={item => (item as any).id}
        contentContainerStyle={{paddingRight: paddingX, paddingLeft: paddingX}}
        numColumns={2}
        stickyHa
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
              selectableFn={handleConfirm}
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
