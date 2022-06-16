import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import PolymorphicOwnerListFlatlist from 'src/components/PolymorphicOwnerListFlatlist';

export enum LikeListType {
  Comment = 'comment',
  Post = 'post',
}

const LikeListScreen = ({
  route: {
    params: {likableType, likableId},
  },
}) => {
  const {
    data: likeListRes,
    isLoading: likeListLoad,
    isPaginating: likePaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.like.list);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (likeListLoad) return;
    reloadGetWithToken(apis.like.list(likableType, likableId));
  };
  const handleEndReached = () => {
    if (likePaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.like.list(likableType, likableId, page + 1),
      'likes',
    );
  };
  return (
    <PolymorphicOwnerListFlatlist
      onRefresh={handleRefresh}
      data={likeListRes ? likeListRes.likes : []}
      refreshing={likeListLoad}
      onEndReached={handleEndReached}
      isPaginating={likePaginating}
      title={'좋아요'}
    />
  );
};

export default LikeListScreen;
