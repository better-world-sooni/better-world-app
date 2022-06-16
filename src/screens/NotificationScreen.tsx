import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import Notification from 'src/components/Notification';

export default function NotificationScreen() {
  const {
    data: notificationRes,
    isLoading: notificationLoading,
    isPaginating: notificationPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.notification.list._);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (notificationLoading) return;
    reloadGetWithToken(apis.notification.list._());
  };
  const handleEndReached = () => {
    if (notificationPaginating || isNotPaginatable) return;
    paginateGetWithToken(apis.notification.list._(page + 1), 'notifications');
  };
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={notificationRes?.notifications || []}
      refreshing={notificationLoading}
      onEndReached={handleEndReached}
      isPaginating={notificationPaginating}
      title={'알림'}
      renderItem={({item}) => (
        <Notification key={(item as any).id} notification={item} />
      )}
    />
  );
}
