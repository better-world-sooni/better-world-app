import React from 'react';
import apis from 'src/modules/apis';
import {
  useApiSelector,
  usePaginateGETWithToken,
  useReloadGETWithToken,
} from 'src/redux/asyncReducer';
import {VoteCategory} from 'src/hooks/useVote';
import PolymorphicOwnerListFlatlist from 'src/components/PolymorphicOwnerListFlatlist';

const VoteListScreen = ({
  route: {
    params: {voteCategory, postId},
  },
}) => {
  const {
    data: voteListRes,
    isLoading: voteListLoading,
    isPaginating: votePaginating,
    page,
    isNotPaginatable,
  } = useApiSelector(apis.vote.list);
  const reloadGetWithToken = useReloadGETWithToken();
  const paginateGetWithToken = usePaginateGETWithToken();
  const handleRefresh = () => {
    if (voteListLoading) return;
    reloadGetWithToken(apis.vote.list(voteCategory, postId));
  };
  const handleEndReached = () => {
    if (votePaginating || isNotPaginatable) return;
    paginateGetWithToken(
      apis.like.list(voteCategory, postId, page + 1),
      'votes',
    );
  };
  const title =
    voteCategory == VoteCategory.For
      ? '찬성'
      : voteCategory == VoteCategory.Against
      ? '반대'
      : '중립';
  return (
    <PolymorphicOwnerListFlatlist
      onRefresh={handleRefresh}
      data={voteListRes ? voteListRes.votes : []}
      refreshing={voteListLoading}
      onEndReached={handleEndReached}
      isPaginating={votePaginating}
      title={title}
    />
  );
};

export default VoteListScreen;
