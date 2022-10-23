import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import PolymorphicOwnerListFlatlist from 'src/components/PolymorphicOwnerListFlatlist';

const DonationListScreen = ({
  route: {
    params: {postId},
  },
}) => {
  const {data, isLoading, isPaginating, page, isNotPaginatable} =
    useApiSelector(apis.donation.postId.list(postId));
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (isLoading) return;
    reloadGetWithToken(apis.donation.postId.list(postId));
  };
  const handleEndReached = () => {
    if (isPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.donation.postId.list(postId, page + 1),
      'donations',
    );
  };
  return (
    <PolymorphicOwnerListFlatlist
      onRefresh={handleRefresh}
      data={data ? data.donations : []}
      refreshing={isLoading}
      onEndReached={handleEndReached}
      isPaginating={isPaginating}
      title={'응원'}
    />
  );
};

export default DonationListScreen;
