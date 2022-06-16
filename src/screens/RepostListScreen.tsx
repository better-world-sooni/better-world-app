import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import ListFlatlist from 'src/components/ListFlatlist';
import PolymorphicOwner from 'src/components/PolymorphicOwner';
import PolymorphicOwnerListFlatlist from 'src/components/PolymorphicOwnerListFlatlist';

const RepostListScreen = ({
  route: {
    params: {postId},
  },
}) => {
  const {
    data: repostListRes,
    isLoading: repostListLoading,
    isPaginating: repostPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.post.postId.repost.list._);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (repostListLoading) return;
    reloadGetWithToken(apis.post.postId.repost.list._(postId));
  };
  const handleEndReached = () => {
    if (repostPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.post.postId.repost.list._(postId, page + 1),
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
      title={'리포스트'}
    />
  );
};

export default RepostListScreen;
