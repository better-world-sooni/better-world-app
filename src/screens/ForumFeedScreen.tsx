import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import Post from 'src/components/common/Post';
import ListFlatlist from 'src/components/ListFlatlist';

export default function ForumFeedScreen({
  route: {
    params: {postId, title},
  },
}) {
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
      apis.post.postId.repost.list.proposal(postId, page + 1),
      'proposals',
    );
  };
  const handleRefresh = () => {
    reloadGetWithToken(apis.post.postId.repost.list.proposal(postId));
  };
  return (
    <ListFlatlist
      onRefresh={handleRefresh}
      data={proposalListRes ? proposalListRes.proposals : []}
      refreshing={proposalListLoading}
      onEndReached={handleEndReached}
      isPaginating={repostListPaginating}
      title={title}
      renderItem={({item}) => {
        return <Post key={(item as any).id} post={item} />;
      }}
    />
  );
}
