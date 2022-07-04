import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import ListFlatlist from 'src/components/ListFlatlist';

export default function StoreScreen() {
  const {
    data: proposalListRes,
    isLoading: proposalListLoading,
    isPaginating: repostListPaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.post.postId.repost.list.proposal);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleEndReached = () => {
    if (repostListPaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.nft_collection.merchandise.list(page + 1),
      'merchandises',
    );
  };
  const handleRefresh = () => {
    reloadGetWithToken(apis.nft_collection.merchandise.list());
  };
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={proposalListRes ? proposalListRes.proposals : []}
      refreshing={proposalListLoading}
      onEndReached={handleEndReached}
      isPaginating={repostListPaginating}
      enableBack={false}
      title={'드랍스 & 스토어'}
      renderItem={({item}) => {
        return <Post key={(item as any).id} post={item} />;
      }}
    />
  );
}
