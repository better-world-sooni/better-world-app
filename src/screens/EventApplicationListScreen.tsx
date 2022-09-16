import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import EventApplication from 'src/components/common/EventApplication';

export default function EventApplicationListScreen() {
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.nft.eventApplication.list);
  const eventApplications = data?.event_applications || [];
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.nft.eventApplication.list(page + 1),
      'event_applications',
    );
  };
  const reloadGetWithToken = useReloadGETWithToken();
  const onRefresh = () => {
    if (isLoading) return;
    reloadGetWithToken(apis.nft.eventApplication.list());
  };
  return (
    <ListFlatlist
      onRefresh={onRefresh}
      data={eventApplications}
      refreshing={isLoading}
      onEndReached={handleEndReached}
      isPaginating={isPaginating}
      title={'응모 기록'}
      renderItem={({item}) => {
        return <EventApplication eventApplication={item} />;
      }}
    />
  );
}
