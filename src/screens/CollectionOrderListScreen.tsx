import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import OrderMerchandise from 'src/components/common/OrderMerchandise';

export default function CollectionOrderListScreen() {
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.nft_collection.order.list);
  const orders = data?.orders || [];
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.nft_collection.order.list(page + 1), 'orders');
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (isLoading) return;
    reloadGetWithToken(apis.nft_collection.order.list());
  };
  return (
    <ListFlatlist
      onRefresh={onRefresh}
      data={orders}
      refreshing={isLoading}
      onEndReached={handleEndReached}
      isPaginating={isPaginating}
      title={'응모 기록'}
      renderItem={({item}) => {
        return <OrderMerchandise admin order={item} />;
      }}
    />
  );
}
