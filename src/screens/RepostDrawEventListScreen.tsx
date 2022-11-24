import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import PolymorphicOwnerListFlatlist from 'src/components/PolymorphicOwnerListFlatlist';

const repostDrawEventScreen = ({
  route: {
    params: {eventId},
  },
}) => {
  const {
    data: repostListRes,
    isLoading: repostListLoading,
    isPaginating: repostPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.draw_event.drawEventId.repost.list);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (repostListLoading) return;
    reloadGetWithToken(apis.draw_event.drawEventId.repost.list(eventId));
  };
  const handleEndReached = () => {
    if (repostPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.draw_event.drawEventId.repost.list(eventId, page + 1),
      'reposts',
    );
  };
  return (
    <PolymorphicOwnerListFlatlist
      onRefresh={handleRefresh}
      data={repostListRes ? repostListRes.reposts : []}
      refreshing={repostListLoading}
      onEndReached={handleEndReached}
      isPaginating={repostPaginating}
      title={'퍼가기'}
    />
  );
};

export default repostDrawEventScreen;
